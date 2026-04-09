import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function fetchImageAsBase64(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch image: ${url} (${res.status})`);
  const buf = await res.arrayBuffer();
  const bytes = new Uint8Array(buf);
  let binary = "";
  const chunkSize = 8192;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

async function callHuggingFace(humanBase64: string, clothBase64: string, token: string, retries = 3): Promise<Response> {
  const url = "https://api-inference.huggingface.co/models/yisol/IDM-VTON";

  for (let i = 0; i < retries; i++) {
    console.log(`HF attempt ${i + 1}/${retries}`);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: {
          image: humanBase64,
          cloth: clothBase64,
        },
      }),
    });

    if (response.status === 503) {
      const body = await response.text();
      console.log("Model loading (503), retrying in 3s...", body);
      await new Promise((r) => setTimeout(r, 3000));
      continue;
    }

    return response;
  }

  throw new Error("Max retries reached — model may still be loading");
}

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

    let humanImageUrl = body.humanImageUrl;
    const garmentImageUrl = body.garmentImageUrl;

    if (!garmentImageUrl) {
      return new Response(
        JSON.stringify({ error: "Missing required field: garmentImageUrl" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Fallback: if no human image, use garment as both
    if (!humanImageUrl) {
      console.log("No human image provided, using garment image as fallback");
      humanImageUrl = garmentImageUrl;
    }

    console.log("Converting images to base64...");
    const [humanBase64, clothBase64] = await Promise.all([
      fetchImageAsBase64(humanImageUrl),
      fetchImageAsBase64(garmentImageUrl),
    ]);

    console.log("Calling Hugging Face IDM-VTON model...");
    const hfResponse = await callHuggingFace(humanBase64, clothBase64, HUGGINGFACE_API_TOKEN);

    const contentType = hfResponse.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const jsonData = await hfResponse.json();
      console.log("HF JSON response:", JSON.stringify(jsonData));

      if (jsonData.error) {
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
      throw new Error(`Hugging Face API error: ${hfResponse.status} - ${errorText}`);
    }

    // Success — binary image response
    const imageBuffer = await hfResponse.arrayBuffer();
    const imageBytes = new Uint8Array(imageBuffer);
    let binary = "";
    const chunkSize = 8192;
    for (let i = 0; i < imageBytes.length; i += chunkSize) {
      binary += String.fromCharCode(...imageBytes.subarray(i, i + chunkSize));
    }
    const base64 = btoa(binary);
    const dataUrl = `data:image/png;base64,${base64}`;

    console.log("Try-on generation successful");

    return new Response(
      JSON.stringify({ output: dataUrl, image: dataUrl }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Error in virtual-tryon function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error occurred", ok: false }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
