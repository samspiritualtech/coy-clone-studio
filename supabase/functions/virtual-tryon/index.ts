import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const HUGGINGFACE_API_TOKEN = Deno.env.get("HUGGINGFACE_API_TOKEN");
    if (!HUGGINGFACE_API_TOKEN) {
      throw new Error("HUGGINGFACE_API_TOKEN is not set");
    }

    const body = await req.json();
    console.log("Virtual try-on request received");

    if (!body.humanImageUrl || !body.garmentImageUrl) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: humanImageUrl and garmentImageUrl" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    console.log("Calling Hugging Face IDM-VTON model...");

    // Fetch both images as blobs
    const [humanRes, garmentRes] = await Promise.all([
      fetch(body.humanImageUrl),
      fetch(body.garmentImageUrl),
    ]);

    if (!humanRes.ok || !garmentRes.ok) {
      throw new Error("Failed to fetch input images");
    }

    const humanBlob = await humanRes.blob();
    const garmentBlob = await garmentRes.blob();

    // Build multipart form for HF Inference API
    const formData = new FormData();
    formData.append("inputs", JSON.stringify({
      human_img: "human",
      garm_img: "garment",
      garment_des: body.garmentDescription || "clothing item",
      category: body.category || "upper_body",
    }));
    formData.append("human", humanBlob, "human.jpg");
    formData.append("garment", garmentBlob, "garment.jpg");

    const hfResponse = await fetch(
      "https://api-inference.huggingface.co/models/yisol/IDM-VTON",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HUGGINGFACE_API_TOKEN}`,
        },
        body: formData,
      }
    );

    // If the model returns JSON (error or loading), handle it
    const contentType = hfResponse.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const jsonData = await hfResponse.json();
      console.log("HF JSON response:", jsonData);

      if (jsonData.error) {
        // Model might be loading
        if (jsonData.estimated_time) {
          return new Response(
            JSON.stringify({ error: `Model is loading, please retry in ~${Math.ceil(jsonData.estimated_time)}s`, loading: true }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 503 }
          );
        }
        throw new Error(jsonData.error);
      }

      return new Response(JSON.stringify(jsonData), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!hfResponse.ok) {
      const errorText = await hfResponse.text();
      console.error("HF error:", hfResponse.status, errorText);
      throw new Error(`Hugging Face API error: ${hfResponse.status}`);
    }

    // Success — response is an image blob
    const imageArrayBuffer = await hfResponse.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(imageArrayBuffer)));
    const dataUrl = `data:image/png;base64,${base64}`;

    console.log("Try-on generation successful, returning base64 image");

    return new Response(
      JSON.stringify({ output: dataUrl }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Error in virtual-tryon function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error occurred" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
