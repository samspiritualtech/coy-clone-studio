import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface SocialPostPayload {
  event: string;
  timestamp: string;
  design: {
    title: string;
    description: string;
    imageUrl: string;
    designer?: {
      name: string;
      city: string;
    };
    customizations: {
      dressType: string;
      fabric: string;
      color: string;
      colorHex: string;
      embroideryLevel: string;
    };
    priceRange: string;
    occasion?: string;
  };
  source: {
    url: string;
    platform: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const webhookUrl = Deno.env.get("MAKE_WEBHOOK_URL");
    
    if (!webhookUrl) {
      console.error("MAKE_WEBHOOK_URL not configured");
      return new Response(
        JSON.stringify({ error: "Webhook URL not configured" }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const payload: SocialPostPayload = await req.json();

    // Validate required fields
    if (!payload.event || !payload.design?.title || !payload.design?.description) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: event, design.title, design.description" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    console.log("Sending to Make.com webhook:", JSON.stringify(payload, null, 2));

    // Send to Make.com webhook
    const webhookResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!webhookResponse.ok) {
      const errorText = await webhookResponse.text();
      console.error("Make.com webhook error:", errorText);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Webhook delivery failed",
          status: webhookResponse.status 
        }),
        { 
          status: 502, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    console.log("Successfully sent to Make.com webhook");

    return new Response(
      JSON.stringify({ success: true, message: "Social post triggered successfully" }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    console.error("Error in social-post-webhook:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
