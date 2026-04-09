import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function fetchImageAsBase64DataUrl(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch image from ${url} (${res.status})`);
  const buf = await res.arrayBuffer();
  const bytes = new Uint8Array(buf);
  let binary = "";
  const chunkSize = 8192;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  const base64 = btoa(binary);
  const ct = res.headers.get("content-type") || "image/jpeg";
  return `data:${ct};base64,${base64}`;
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

    // Fallback: use garment as human if not provided
    if (!humanImageUrl) {
      console.log("No human image, using garment as fallback");
      humanImageUrl = garmentImageUrl;
    }

    console.log("Converting images to base64 data URLs...");
    const [humanDataUrl, garmentDataUrl] = await Promise.all([
      fetchImageAsBase64DataUrl(humanImageUrl),
      fetchImageAsBase64DataUrl(garmentImageUrl),
    ]);

    // Use Gradio Spaces API for IDM-VTON
    const spaceUrl = "https://yisol-idm-vton.hf.space";
    const garmentDesc = body.garmentDescription || "clothing item";
    const category = body.category || "upper_body";

    // Map category to the Space's expected format
    const categoryMap: Record<string, boolean> = {
      upper_body: true,
      lower_body: false,
      dresses: false,
    };
    const isUpperBody = categoryMap[category] ?? true;

    console.log("Calling IDM-VTON Gradio Space...");

    // Step 1: Submit prediction
    const predictPayload = {
      data: [
        { path: humanDataUrl }, // human image
        { path: garmentDataUrl }, // garment image
        garmentDesc, // description
        isUpperBody, // is_checked (upper body)
        !isUpperBody, // is_checked_crop (for lower/dress)
        30, // denoise steps
        2, // seed
      ],
    };

    let predictRes: Response | null = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      predictRes = await fetch(`${spaceUrl}/api/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${HUGGINGFACE_API_TOKEN}`,
        },
        body: JSON.stringify(predictPayload),
      });

      if (predictRes.status === 503 || predictRes.status === 429) {
        console.log(`Space returned ${predictRes.status}, retrying in 5s... (attempt ${attempt + 1})`);
        await predictRes.text(); // consume body
        await new Promise((r) => setTimeout(r, 5000));
        continue;
      }
      break;
    }

    if (!predictRes || !predictRes.ok) {
      const errText = predictRes ? await predictRes.text() : "No response";
      console.error("Gradio predict error:", predictRes?.status, errText);
      
      // If Space is sleeping/loading, return friendly message
      if (predictRes?.status === 503 || predictRes?.status === 502) {
        return new Response(
          JSON.stringify({ error: "The AI model is currently loading. Please try again in 30-60 seconds.", loading: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 503 }
        );
      }
      throw new Error(`Gradio API error: ${predictRes?.status} - ${errText}`);
    }

    const result = await predictRes.json();
    console.log("Gradio response received");

    // Extract the output image from Gradio response
    // Gradio returns { data: [...] } where the image is typically the first element
    if (!result.data || result.data.length === 0) {
      throw new Error("No output from model");
    }

    const outputImage = result.data[0];
    let outputDataUrl: string;

    if (typeof outputImage === "string") {
      // Already a data URL or URL
      if (outputImage.startsWith("data:")) {
        outputDataUrl = outputImage;
      } else {
        // It's a URL, fetch it
        outputDataUrl = await fetchImageAsBase64DataUrl(
          outputImage.startsWith("/") ? `${spaceUrl}${outputImage}` : outputImage
        );
      }
    } else if (outputImage?.url) {
      outputDataUrl = await fetchImageAsBase64DataUrl(
        outputImage.url.startsWith("/") ? `${spaceUrl}${outputImage.url}` : outputImage.url
      );
    } else if (outputImage?.path) {
      // Gradio file response with path
      const fileUrl = `${spaceUrl}/file=${outputImage.path}`;
      outputDataUrl = await fetchImageAsBase64DataUrl(fileUrl);
    } else {
      console.error("Unexpected output format:", JSON.stringify(outputImage));
      throw new Error("Unexpected output format from model");
    }

    console.log("Try-on generation successful");

    return new Response(
      JSON.stringify({ output: outputDataUrl, image: outputDataUrl }),
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
