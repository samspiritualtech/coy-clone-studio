import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP from headers (Supabase edge functions expose this)
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() 
      || req.headers.get('x-real-ip') 
      || '';

    console.log('Detecting location for IP:', clientIP);

    // Use ip-api.com (free, no API key required, 45 requests/minute limit)
    // For production, consider using a paid service with higher limits
    const geoResponse = await fetch(`http://ip-api.com/json/${clientIP}?fields=status,message,country,regionName,city`);
    
    if (!geoResponse.ok) {
      throw new Error('Failed to fetch geolocation data');
    }

    const geoData = await geoResponse.json();
    console.log('Geo API response:', geoData);

    if (geoData.status === 'fail') {
      // Fallback for localhost/private IPs - default to Delhi
      console.log('Geo lookup failed (likely private IP), using fallback');
      return new Response(
        JSON.stringify({
          success: true,
          city: 'Delhi',
          state: 'Delhi',
          country: 'India',
          source: 'fallback'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    // Check if in India
    const isIndia = geoData.country === 'India';
    
    return new Response(
      JSON.stringify({
        success: true,
        city: geoData.city || 'Delhi',
        state: geoData.regionName || 'Delhi',
        country: isIndia ? 'India' : geoData.country,
        source: 'ip-api'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('IP geolocation error:', error);
    
    // Return fallback location on error
    return new Response(
      JSON.stringify({
        success: true,
        city: 'Delhi',
        state: 'Delhi',
        country: 'India',
        source: 'fallback'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  }
});
