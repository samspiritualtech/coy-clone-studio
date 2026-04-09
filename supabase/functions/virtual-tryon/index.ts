import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SPACE_URL = "https://yisol-idm-vton.hf.space";

async function fetchImageBlob(url: string): Promise<Blob> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch image: ${url} (${res.status})`);
  return await res.blob();
}

async function uploadToSpace(blob: Blob, filename: string, token: string): Promise<string> {
  const formData = new FormData();
  formData.append("files", blob, filename);

  const res = await fetch(`${SPACE_URL}/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Upload failed (${res.status}): ${errText}`);
  }

  const paths = await res.json();
  return paths[0];
}

async function blobToBase64DataUrl(blob: Blob): Promise<string> {
  const buf = await blob.arrayBuffer();
  const bytes = new Uint8Array(buf);
  let binary = "";
  const chunkSize = 8192;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return `data:image/png;base64,${btoa(binary)}`;
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

    if (!humanImageUrl) {
      console.log("No human image, using garment as fallback");
      humanImageUrl = garmentImageUrl;
    }

    const garmentDesc = body.garmentDescription || "clothing item";

    // Step 1: Fetch images
    console.log("Fetching images...");
    const [humanBlob, garmentBlob] = await Promise.all([
      fetchImageBlob(humanImageUrl),
      fetchImageBlob(garmentImageUrl),
    ]);

    // Step 2: Upload to Gradio Space
    console.log("Uploading images to Space...");
    const [humanPath, garmentPath] = await Promise.all([
      uploadToSpace(humanBlob, "human.jpg", HUGGINGFACE_API_TOKEN),
      uploadToSpace(garmentBlob, "garment.jpg", HUGGINGFACE_API_TOKEN),
    ]);
    console.log("Uploaded:", humanPath, garmentPath);

    // Step 3: Call the /tryon named endpoint
    // dict param = ImageEditor with background + empty layers
    // garm_img = garment FileData
    const predictPayload = {
      data: [
        {
          background: { path: humanPath, meta: { _type: "gradio.FileData" } },
          layers: [],
          composite: null,
        },
        { path: garmentPath, meta: { _type: "gradio.FileData" } },
        garmentDesc,
        true,   // is_checked (auto-masking)
        false,  // is_checked_crop
        30,     // denoise_steps
        42,     // seed
      ],
    };

    console.log("Calling /api/predict (tryon endpoint)...");

    let predictRes: Response | null = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      predictRes = await fetch(`${SPACE_URL}/call/tryon`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${HUGGINGFACE_API_TOKEN}`,
        },
        body: JSON.stringify(predictPayload),
      });

      if (predictRes.status === 503 || predictRes.status === 429) {
        const txt = await predictRes.text();
        console.log(`Space ${predictRes.status}, retry ${attempt + 1}...`, txt);
        await new Promise((r) => setTimeout(r, 5000));
        continue;
      }
      break;
    }

    if (!predictRes || !predictRes.ok) {
      const errText = predictRes ? await predictRes.text() : "No response";
      console.error("Call error:", predictRes?.status, errText);

      if (predictRes?.status === 503 || predictRes?.status === 502) {
        return new Response(
          JSON.stringify({ error: "The AI model is loading. Please try again in 30-60 seconds.", loading: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 503 }
        );
      }
      throw new Error(`Model API error (${predictRes?.status}): ${errText.substring(0, 300)}`);
    }

    // /call/ returns { event_id: "..." } - need to poll /call/tryon/{event_id}
    const callResult = await predictRes.json();
    const eventId = callResult.event_id;
    console.log("Event ID:", eventId);

    if (!eventId) {
      throw new Error("No event_id returned from /call/tryon");
    }

    // Step 4: Poll for result using SSE endpoint
    console.log("Polling for result...");
    const resultRes = await fetch(`${SPACE_URL}/call/tryon/${eventId}`, {
      headers: { Authorization: `Bearer ${HUGGINGFACE_API_TOKEN}` },
    });

    if (!resultRes.ok) {
      const errText = await resultRes.text();
      throw new Error(`Result polling error (${resultRes.status}): ${errText.substring(0, 300)}`);
    }

    // Parse SSE response
    const sseText = await resultRes.text();
    console.log("SSE response length:", sseText.length);

    // Find the "complete" event data
    const lines = sseText.split("\n");
    let resultData = null;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith("event: complete")) {
        const dataLine = lines[i + 1];
        if (dataLine && dataLine.startsWith("data: ")) {
          resultData = JSON.parse(dataLine.substring(6));
          break;
        }
      }
      if (lines[i].startsWith("event: error")) {
        const dataLine = lines[i + 1];
        const errMsg = dataLine?.startsWith("data: ") ? dataLine.substring(6) : "Unknown error";
        throw new Error(`Model error: ${errMsg}`);
      }
    }

    if (!resultData || !resultData.length) {
      console.error("SSE text:", sseText.substring(0, 500));
      throw new Error("No result data from model");
    }

    // First element is the output image FileData
    const outputFile = resultData[0];
    const filePath = outputFile?.url || outputFile?.path;

    if (!filePath) {
      console.error("Output:", JSON.stringify(outputFile));
      throw new Error("No output file path");
    }

    const fileUrl = filePath.startsWith("http")
      ? filePath
      : `${SPACE_URL}/file=${filePath}`;

    console.log("Fetching result image:", fileUrl);
    const resultBlob = await fetchImageBlob(fileUrl);
    const outputDataUrl = await blobToBase64DataUrl(resultBlob);

    console.log("Try-on generation successful");

    return new Response(
      JSON.stringify({ output: outputDataUrl, image: outputDataUrl }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Error in virtual-tryon function:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error occurred",
        ok: false,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
