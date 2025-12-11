import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RecommendationRequest {
  type: 'similar' | 'brand' | 'search' | 'category';
  productId?: string;
  productData?: {
    name: string;
    brand: string;
    category: string;
    price: number;
    description: string;
    material: string;
    colors: string[];
  };
  brandName?: string;
  query?: string;
  category?: string;
  allProducts: Array<{
    id: string;
    name: string;
    brand: string;
    category: string;
    price: number;
    description: string;
    tags: string[];
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

    const { type, productId, productData, brandName, query, category, allProducts }: RecommendationRequest = await req.json();

    console.log(`Processing ${type} recommendation request`);

    let prompt = '';
    
    switch (type) {
      case 'similar':
        prompt = `You are a fashion recommendation AI. Given this product:
Name: ${productData?.name}
Brand: ${productData?.brand}
Category: ${productData?.category}
Price: ₹${productData?.price}
Description: ${productData?.description}
Material: ${productData?.material}
Colors: ${productData?.colors?.join(', ')}

From this product catalog, select the 8 most similar products based on style, category, price range, and aesthetic. Return ONLY a JSON array of product IDs, nothing else.

Products catalog:
${allProducts.slice(0, 100).map(p => `ID: ${p.id}, Name: ${p.name}, Brand: ${p.brand}, Category: ${p.category}, Price: ₹${p.price}`).join('\n')}

Response format: ["id1", "id2", "id3", ...]`;
        break;

      case 'brand':
        prompt = `You are a fashion recommendation AI. Find products from the brand "${brandName}" that would complement other items.
Current product ID to exclude: ${productId}

From this product catalog, select 8 products from the brand "${brandName}" that showcase variety in style and category. Return ONLY a JSON array of product IDs, nothing else.

Products catalog (filtered by brand "${brandName}"):
${allProducts.filter(p => p.brand === brandName && p.id !== productId).slice(0, 50).map(p => `ID: ${p.id}, Name: ${p.name}, Category: ${p.category}, Price: ₹${p.price}`).join('\n')}

Response format: ["id1", "id2", "id3", ...]`;
        break;

      case 'search':
        prompt = `You are a fashion recommendation AI. A user searched for: "${query}"

From this product catalog, select the 8 most relevant products that match the search intent. Consider product names, brands, categories, and descriptions. Return ONLY a JSON array of product IDs, nothing else.

Products catalog:
${allProducts.slice(0, 100).map(p => `ID: ${p.id}, Name: ${p.name}, Brand: ${p.brand}, Category: ${p.category}, Price: ₹${p.price}, Tags: ${p.tags.join(', ')}`).join('\n')}

Response format: ["id1", "id2", "id3", ...]`;
        break;

      case 'category':
        prompt = `You are a fashion recommendation AI. A user is browsing the "${category}" category.

From this product catalog, select the 8 best products in the "${category}" category. Prioritize trending items, new arrivals, and best sellers. Return ONLY a JSON array of product IDs, nothing else.

Products catalog (category: ${category}):
${allProducts.filter(p => p.category === category?.toLowerCase()).slice(0, 50).map(p => `ID: ${p.id}, Name: ${p.name}, Brand: ${p.brand}, Price: ₹${p.price}, Tags: ${p.tags.join(', ')}`).join('\n')}

Response format: ["id1", "id2", "id3", ...]`;
        break;

      default:
        throw new Error(`Unknown recommendation type: ${type}`);
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
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
            content: 'You are a fashion product recommendation AI. You analyze product catalogs and return relevant product recommendations. Always respond with valid JSON arrays of product IDs only.'
          },
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded', productIds: [] }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '[]';
    
    console.log('AI response:', content);

    // Parse the JSON array from the response
    let productIds: string[] = [];
    try {
      // Extract JSON array from response (handle markdown code blocks)
      const jsonMatch = content.match(/\[[\s\S]*?\]/);
      if (jsonMatch) {
        productIds = JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      productIds = [];
    }

    return new Response(JSON.stringify({ productIds }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-recommendations:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      productIds: []
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
