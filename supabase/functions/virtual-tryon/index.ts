import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Content-Type": "application/json",
};

const SPACE_URL = "https://yisol-idm-vton.hf.space";
const MAX_WAIT_MS = 90_000;

const jsonResponse = (payload: Record<string, unknown>) =>
  new Response(JSON.stringify(payload), { headers: corsHeaders, status: 200 });

function makeFileData(url: string, name: string) {
  return { path: url, url, meta: { _type: "gradio.FileData" }, orig_name: name };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const HUGGINGFACE_API_TOKEN = Deno.env.get("HUGGINGFACE_API_TOKEN");
    if (!HUGGINGFACE_API_TOKEN) return jsonResponse({ success: false, error: "HUGGINGFACE_API_TOKEN is not set" });

    const body = await req.json();
    console.log("Virtual try-on request received");

    let humanImageUrl = body.humanImageUrl;
    const garmentImageUrl = body.garmentImageUrl;

    if (!garmentImageUrl) return jsonResponse({ success: false, error: "Missing required field: garmentImageUrl" });
    if (!humanImageUrl) {
      console.log("No human image, using garment as fallback");
      humanImageUrl = garmentImageUrl;
    }

    const garmentDesc = body.garmentDescription || "clothing item";
    const sessionHash = crypto.randomUUID().replace(/-/g, "").slice(0, 12);

    console.log("Using queue/join with URL-based FileData:", {
      humanImageUrl: humanImageUrl.substring(0, 80),
      garmentImageUrl: garmentImageUrl.substring(0, 80),
    });

    // Step 1: Join the queue with URL-based FileData (SSE v3 protocol)
    const joinPayload = {
      data: [
        {
          background: makeFileData(humanImageUrl, "human.jpg"),
          layers: [],
          composite: null,
        },
        makeFileData(garmentImageUrl, "garment.jpg"),
        garmentDesc,
        true,   // auto-masking
        false,  // is_checked_crop
        30,     // denoise_steps
        42,     // seed
      ],
      fn_index: 2,
      session_hash: sessionHash,
    };

    const joinRes = await fetch(`${SPACE_URL}/queue/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${HUGGINGFACE_API_TOKEN}`,
      },
      body: JSON.stringify(joinPayload),
    });

    if (!joinRes.ok) {
      const errText = await joinRes.text();
      console.error("queue/join failed:", joinRes.status, errText);
      if (joinRes.status === 503 || joinRes.status === 429) {
        return jsonResponse({ success: false, loading: true });
      }
      return jsonResponse({ success: false, error: `Queue join failed (${joinRes.status}): ${errText.substring(0, 200)}` });
    }

    const joinData = await joinRes.json();
    console.log("Joined queue, event_id:", joinData.event_id);

    // Step 2: Listen on queue/data SSE stream
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), MAX_WAIT_MS);

    try {
      const dataRes = await fetch(
        `${SPACE_URL}/queue/data?session_hash=${sessionHash}`,
        {
          headers: { Authorization: `Bearer ${HUGGINGFACE_API_TOKEN}` },
          signal: controller.signal,
        },
      );

      if (!dataRes.ok || !dataRes.body) {
        const msg = dataRes.ok ? "No response body" : await dataRes.text();
        console.error("queue/data failed:", msg);
        return jsonResponse({ success: false, loading: true });
      }

      const reader = dataRes.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        // Parse SSE lines: "data: {...}\n\n"
        let idx = buffer.indexOf("\n\n");
        while (idx !== -1) {
          const block = buffer.slice(0, idx).trim();
          buffer = buffer.slice(idx + 2);
          idx = buffer.indexOf("\n\n");

          if (!block.startsWith("data:")) continue;
          const jsonStr = block.slice(5).trim();
          if (!jsonStr) continue;

          let msg;
          try { msg = JSON.parse(jsonStr); } catch { continue; }

          console.log("SSE msg:", msg.msg, msg.success !== undefined ? `success=${msg.success}` : "");

          if (msg.msg === "process_completed") {
            if (msg.success && msg.output?.data?.[0]) {
              const outputFile = msg.output.data[0];
              const fileUrl = outputFile.url || (outputFile.path?.startsWith("http") ? outputFile.path : `${SPACE_URL}/file=${outputFile.path}`);

              console.log("Fetching result image:", fileUrl);
              const imgRes = await fetch(fileUrl, { headers: { Authorization: `Bearer ${HUGGINGFACE_API_TOKEN}` } });
              if (!imgRes.ok) {
                return jsonResponse({ success: false, error: `Failed to fetch result image: ${imgRes.status}` });
              }
              const blob = await imgRes.blob();
              const buf = await blob.arrayBuffer();
              const bytes = new Uint8Array(buf);
              let binary = "";
              const chunkSize = 8192;
              for (let i = 0; i < bytes.length; i += chunkSize)
                binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
              const base64 = `data:image/png;base64,${btoa(binary)}`;

              console.log("Try-on generation successful");
              return jsonResponse({ success: true, image: base64 });
            }

            // Process completed but failed
            console.error("Process completed with error:", JSON.stringify(msg.output?.error || msg.output));
            return jsonResponse({ success: false, error: "Model processing failed. Please try again." });
          }

          if (msg.msg === "queue_full") {
            return jsonResponse({ success: false, loading: true });
          }

          if (msg.msg === "close_stream") {
            break;
          }

          // estimation, process_starts, heartbeat — continue waiting
        }
      }

      return jsonResponse({ success: false, loading: true });
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    console.error("Error in virtual-tryon function:", error);
    if (error instanceof DOMException && error.name === "AbortError") {
      return jsonResponse({ success: false, loading: true });
    }
    return jsonResponse({ success: false, error: error instanceof Error ? error.message : "Unknown error occurred" });
  }
});
