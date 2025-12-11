import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ImageAnalysisRequest {
  imageBase64: string;
  allProducts: Array<{
    id: string;
    name: string;
    brand: string;
    category: string;
    price: number;
    description: string;
    colors: Array<{ name: string; hex: string }>;
    material: string;
  }>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const { imageBase64, allProducts }: ImageAnalysisRequest = await req.json();

    console.log('Processing image analysis request');

    // First, analyze the image to extract fashion attributes
    const analysisResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are a fashion image analysis AI. Analyze clothing images and extract key attributes like category, colors, style, patterns, and materials.'
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this fashion image and extract:
1. Category (dresses, tops, bottoms, outerwear, footwear, accessories)
2. Primary colors (list 2-3 main colors)
3. Style (casual, formal, bohemian, sporty, elegant, etc.)
4. Pattern (solid, floral, striped, geometric, etc.)
5. Material appearance (cotton, silk, denim, leather, etc.)

Respond in JSON format only:
{
  "category": "string",
  "colors": ["color1", "color2"],
  "style": "string",
  "pattern": "string",
  "material": "string"
}`
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64.startsWith('data:') ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
      }),
    });

    if (!analysisResponse.ok) {
      const errorText = await analysisResponse.text();
      console.error('Image analysis error:', analysisResponse.status, errorText);
      
      if (analysisResponse.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded', productIds: [], attributes: null }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`Image analysis error: ${analysisResponse.status}`);
    }

    const analysisData = await analysisResponse.json();
    const analysisContent = analysisData.choices?.[0]?.message?.content || '{}';
    
    console.log('Image analysis result:', analysisContent);

    // Parse the attributes
    let attributes = {
      category: 'dresses',
      colors: ['black'],
      style: 'casual',
      pattern: 'solid',
      material: 'cotton'
    };
    
    try {
      const jsonMatch = analysisContent.match(/\{[\s\S]*?\}/);
      if (jsonMatch) {
        attributes = JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error('Failed to parse image attributes:', parseError);
    }

    // Now find matching products
    const matchPrompt = `You are a fashion recommendation AI. Based on these image attributes:
Category: ${attributes.category}
Colors: ${attributes.colors.join(', ')}
Style: ${attributes.style}
Pattern: ${attributes.pattern}
Material: ${attributes.material}

From this product catalog, select the 8 products that best match these visual attributes. Return ONLY a JSON array of product IDs, nothing else.

Products catalog:
${allProducts.slice(0, 100).map(p => `ID: ${p.id}, Name: ${p.name}, Brand: ${p.brand}, Category: ${p.category}, Colors: ${p.colors?.map(c => c.name).join(', ')}, Material: ${p.material}`).join('\n')}

Response format: ["id1", "id2", "id3", ...]`;

    const matchResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are a fashion product recommendation AI. You match image attributes to product catalogs. Always respond with valid JSON arrays of product IDs only.'
          },
          { role: 'user', content: matchPrompt }
        ],
      }),
    });

    if (!matchResponse.ok) {
      throw new Error(`Product matching error: ${matchResponse.status}`);
    }

    const matchData = await matchResponse.json();
    const matchContent = matchData.choices?.[0]?.message?.content || '[]';
    
    console.log('Product matching result:', matchContent);

    let productIds: string[] = [];
    try {
      const jsonMatch = matchContent.match(/\[[\s\S]*?\]/);
      if (jsonMatch) {
        productIds = JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error('Failed to parse product IDs:', parseError);
      productIds = [];
    }

    return new Response(JSON.stringify({ productIds, attributes }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in image-analysis:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      productIds: [],
      attributes: null
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
