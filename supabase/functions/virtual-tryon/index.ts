import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Content-Type": "application/json",
};

const SPACE_URL = "https://yisol-idm-vton.hf.space";
const MAX_WAIT_MS = 90_000;
const RETRY_DELAY_MS = 3_000;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const jsonResponse = (payload: Record<string, unknown>) =>
  new Response(JSON.stringify(payload), {
    headers: corsHeaders,
    status: 200,
  });

const isLoadingMessage = (message?: string | null) =>
  /loading|warming|busy|queue|503|429|null|timeout/i.test(message ?? "");

function parseSseEvent(eventBlock: string): { event: string; data: string } | null {
  const lines = eventBlock
    .split("\n")
    .map((line) => line.trimEnd())
    .filter(Boolean);

  if (!lines.length) return null;

  let event = "message";
  const dataLines: string[] = [];

  for (const line of lines) {
    if (line.startsWith("event:")) {
      event = line.slice(6).trim();
    } else if (line.startsWith("data:")) {
      dataLines.push(line.slice(5).trimStart());
    }
  }

  return { event, data: dataLines.join("\n") };
}

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

async function callTryOnSpace(
  payload: Record<string, unknown>,
  token: string,
): Promise<{ success: true; eventId: string } | { success: false; loading?: true; error: string }> {
  for (let attempt = 0; attempt < 3; attempt++) {
    const response = await fetch(`${SPACE_URL}/call/tryon`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 503 || response.status === 429) {
      const message = await response.text();
      console.log(`Space ${response.status}, retry ${attempt + 1}...`, message);

      if (attempt === 2) {
        return {
          success: false,
          loading: true,
          error: message || "The model is starting up.",
        };
      }

      await wait(RETRY_DELAY_MS);
      continue;
    }

    if (!response.ok) {
      const message = await response.text();
      return {
        success: false,
        error: `Model API error (${response.status}): ${message.substring(0, 300)}`,
      };
    }

    const callResult = await response.json();
    const eventId = callResult?.event_id;

    if (!eventId) {
      return {
        success: false,
        error: "No event_id returned from /call/tryon",
      };
    }

    return { success: true, eventId };
  }

  return {
    success: false,
    loading: true,
    error: "The model is still loading.",
  };
}

async function waitForTryOnResult(
  eventId: string,
  token: string,
): Promise<
  | { success: true; resultData: unknown[] }
  | { success: false; loading?: true; error: string }
> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), MAX_WAIT_MS);

  try {
    const response = await fetch(`${SPACE_URL}/call/tryon/${eventId}`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
    });

    if (!response.ok) {
      const message = await response.text();
      if (response.status === 503 || isLoadingMessage(message)) {
        return {
          success: false,
          loading: true,
          error: message || "The model is still loading.",
        };
      }

      return {
        success: false,
        error: `Result polling error (${response.status}): ${message.substring(0, 300)}`,
      };
    }

    if (!response.body) {
      return {
        success: false,
        loading: true,
        error: "No response stream returned from the model.",
      };
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      let separatorIndex = buffer.indexOf("\n\n");
      while (separatorIndex !== -1) {
        const eventBlock = buffer.slice(0, separatorIndex);
        buffer = buffer.slice(separatorIndex + 2);
        separatorIndex = buffer.indexOf("\n\n");

        const parsedEvent = parseSseEvent(eventBlock);
        if (!parsedEvent) continue;

        console.log("SSE event:", parsedEvent.event, parsedEvent.data.slice(0, 200));

        if (parsedEvent.event === "complete") {
          const parsedData = JSON.parse(parsedEvent.data);
          if (Array.isArray(parsedData) && parsedData.length > 0) {
            return { success: true, resultData: parsedData };
          }

          return {
            success: false,
            error: "Unexpected completion payload from model.",
          };
        }

        if (parsedEvent.event === "error") {
          if (isLoadingMessage(parsedEvent.data)) {
            return {
              success: false,
              loading: true,
              error: parsedEvent.data || "The model is still warming up.",
            };
          }

          return {
            success: false,
            error: parsedEvent.data || "Unknown model error.",
          };
        }
      }
    }

    return {
      success: false,
      loading: true,
      error: "Timed out waiting for the model result.",
    };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return {
        success: false,
        loading: true,
        error: "Timed out waiting for the model result.",
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to poll model result.",
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

function resolveOutputFileUrl(resultData: unknown[]): string | null {
  const output = resultData[0];

  if (typeof output === "string") {
    return output.startsWith("http") ? output : `${SPACE_URL}/file=${output}`;
  }

  if (output && typeof output === "object") {
    const candidate = output as { url?: string; path?: string };
    const filePath = candidate.url || candidate.path;
    if (!filePath) return null;
    return filePath.startsWith("http") ? filePath : `${SPACE_URL}/file=${filePath}`;
  }

  return null;
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
      return jsonResponse({ success: false, error: "HUGGINGFACE_API_TOKEN is not set" });
    }

    const body = await req.json();
    console.log("Virtual try-on request received");

    let humanImageUrl = body.humanImageUrl;
    const garmentImageUrl = body.garmentImageUrl;

    if (!garmentImageUrl) {
      return jsonResponse({ success: false, error: "Missing required field: garmentImageUrl" });
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

    const callResult = await callTryOnSpace(predictPayload, HUGGINGFACE_API_TOKEN);
    if (!callResult.success) {
      console.error("Call error:", callResult.error);
      return jsonResponse(
        callResult.loading
          ? { success: false, loading: true }
          : { success: false, error: callResult.error },
      );
    }

    const eventId = callResult.eventId;
    console.log("Event ID:", eventId);

    // Step 4: Poll for result using SSE endpoint
    console.log("Polling for result...");

    const result = await waitForTryOnResult(eventId, HUGGINGFACE_API_TOKEN);
    if (!result.success) {
      console.error("Result polling error:", result.error);
      return jsonResponse(
        result.loading
          ? { success: false, loading: true }
          : { success: false, error: result.error },
      );
    }

    // First element is the output image FileData
    const fileUrl = resolveOutputFileUrl(result.resultData);

    if (!fileUrl) {
      console.error("Output:", JSON.stringify(result.resultData[0]));
      return jsonResponse({ success: false, error: "No output file path returned by the model." });
    }

    console.log("Fetching result image:", fileUrl);
    const resultBlob = await fetchImageBlob(fileUrl);
    const outputDataUrl = await blobToBase64DataUrl(resultBlob);

    console.log("Try-on generation successful");

    return jsonResponse({ success: true, image: outputDataUrl });
  } catch (error) {
    console.error("Error in virtual-tryon function:", error);
    return jsonResponse({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
});
