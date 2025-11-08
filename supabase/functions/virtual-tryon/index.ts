import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Replicate from "https://esm.sh/replicate@0.25.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const REPLICATE_API_KEY = Deno.env.get("REPLICATE_API_KEY");
    if (!REPLICATE_API_KEY) {
      throw new Error("REPLICATE_API_KEY is not set");
    }

    const replicate = new Replicate({ auth: REPLICATE_API_KEY });
    const body = await req.json();

    console.log("Virtual try-on request:", body);

    // Handle status check
    if (body.predictionId) {
      console.log("Checking status for prediction:", body.predictionId);
      const prediction = await replicate.predictions.get(body.predictionId);
      console.log("Status check response:", prediction);
      
      return new Response(JSON.stringify(prediction), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Handle new generation
    if (!body.humanImageUrl || !body.garmentImageUrl) {
      return new Response(
        JSON.stringify({ 
          error: "Missing required fields: humanImageUrl and garmentImageUrl are required" 
        }), 
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    console.log("Starting virtual try-on generation");
    console.log("Human image:", body.humanImageUrl);
    console.log("Garment image:", body.garmentImageUrl);

    // Use IDM-VTON model for high-quality virtual try-on
    const output = await replicate.run(
      "cuuupid/idm-vton:c871bb9b046607b680449ecbae55fd8c6d945e0a1948644bf2361b3d021d3ff4",
      {
        input: {
          human_img: body.humanImageUrl,
          garm_img: body.garmentImageUrl,
          garment_des: body.garmentDescription || "clothing item",
          category: body.category || "upper_body",
          n_samples: 1,
          n_steps: body.steps || 20,
          guidance_scale: body.guidanceScale || 2.0,
          seed: body.seed || Math.floor(Math.random() * 1000000),
        }
      }
    );

    console.log("Generation response:", output);
    
    return new Response(JSON.stringify({ output }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in virtual-tryon function:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error occurred"
      }), 
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
