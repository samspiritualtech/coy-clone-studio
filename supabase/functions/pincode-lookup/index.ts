import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PostOffice {
  Name: string;
  District: string;
  State: string;
  Pincode: string;
  Country: string;
}

interface PincodeAPIResponse {
  Status: string;
  Message: string;
  PostOffice: PostOffice[] | null;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pincode } = await req.json();

    // Validate PIN code format
    if (!pincode || !/^\d{6}$/.test(pincode)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Please enter a valid 6-digit PIN code',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Call India Post API
    const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch from postal API');
    }

    const data: PincodeAPIResponse[] = await response.json();

    // Check if we got valid data
    if (!data || data.length === 0 || data[0].Status !== 'Success' || !data[0].PostOffice || data[0].PostOffice.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'PIN code not found. Please check or enter details manually.',
        }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const postOffice = data[0].PostOffice[0];

    return new Response(
      JSON.stringify({
        success: true,
        city: postOffice.District,
        state: postOffice.State,
        country: postOffice.Country || 'India',
        postOfficeName: postOffice.Name,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Pincode lookup error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Unable to detect location. Please enter manually.',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
