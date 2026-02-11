import { createClient } from "https://esm.sh/@supabase/supabase-js@2.76.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Product data generators (same as frontend)
const generateId = (category: string, index: number): string => {
  const prefix = category.substring(0, 4);
  return `${prefix}-${index}`;
};

const getRandomRating = (): number => {
  return Number((3.8 + Math.random() * 1.1).toFixed(1));
};

const brands = [
  "OGURA",
  "ELEGANCE",
  "LUXE",
  "URBAN",
  "CLASSIC",
  "BREEZE",
  "DENIM CO",
  "PROFESSIONAL",
  "STEPS",
  "SPORT",
  "SUMMER",
  "JEWEL",
];
const getBrand = (index: number): string => {
  return brands[index % brands.length];
};

const unsplashImages = {
  dresses: [
    "1572804013309-59a88b7e92f1",
    "1595777457583-95e059d581b8",
    "1566174053879-31528523f8ae",
    "1539008835657-9e8e9680c956",
    "1515372039744-b8f02a3ae446",
    "1496747611176-843222e1e57c",
    "1551045920-23ba15b87e72",
    "1595777216932-96cf2e3d6c7b",
    "1612336307429-8a898d10e223",
    "1582418702059-97ebafb35d09",
    "1617019114583-c7d2e7f05e10",
    "1617019114784-e5e2e5f05e10",
  ],
  tops: [
    "1618517351616-38fb9c5210c6",
    "1624206112918-f140f087f9b5",
    "1594633313593-bab3825d0caf",
    "1620799140188-3b2a02fd9a77",
    "1578932750294-f5075e85f44a",
    "1525507119028-ed4c629a60a3",
    "1591369822096-ffd140ec948f",
    "1562157873-175d2f7e3295",
    "1583744946564-b52ac1c389c8",
  ],
  bottoms: [
    "1541099649105-f69ad21f3246",
    "1583496661160-fb5886a0aaaa",
    "1591195853828-11db59a44f6b",
    "1594633312681-425e7b97ccd3",
    "1582552938560-c76c25b4d48e",
    "1509631179647-0177331693ae",
    "1598554747436-c9293d6a588f",
    "1624378439575-d1d4d5c5f7b5",
  ],
  outerwear: [
    "1551028719-00167b16eac5",
    "1591047139829-d91aecb6caea",
    "1539533018447-63fcce2678e3",
    "1591047139619-d91aecb6caea",
    "1578932750294-f5075e85f44a",
    "1544022613-e87317e7b5cc",
    "1580657018950-64d5f6619563",
    "1548624313-b8e6c5c4e6c9",
  ],
  footwear: [
    "1543163521-1bf539c55dd2",
    "1549298916-b41d501d3772",
    "1603487742131-4160ec999306",
    "1608256246200-53e635b5b65f",
    "1560343090-f0409e92791a",
    "1605348532760-3e37ce7f6e5b",
    "1551107696-a348e4b6b0a7",
    "1605408499393-6e2dcd5b8e5f",
    "1533867617858-e7b97e060509",
  ],
  accessories: [
    "1584917865442-de89df76afd3",
    "1599643478518-a784e5dc4c8f",
    "1601924994987-69e26d50dc26",
    "1611652022419-a9419a4a0e67",
    "1590736969955-71cc94901144",
    "1585856255908-a545f7b2f18a",
    "1611312449408-fcece27cdbb7",
    "1607013251379-e6eecfffe234",
  ],
  bags: [
    "/bags/woven-hobo-burgundy.webp",
    "/bags/woven-hobo-brown.webp",
    "/bags/buckle-shoulder-burgundy.webp",
    "/bags/woven-tote-cream.webp",
    "/bags/classic-crossbody-black.webp",
    "/bags/vanity-top-handle-black.webp",
    "/bags/fringe-hobo-brown.webp",
    "/bags/moon-crescent-blue.webp",
    "/bags/striped-canvas-tote.webp",
  ],
};

const getImage = (category: string, index: number): string => {
  const categoryKey = category as keyof typeof unsplashImages;
  const images = unsplashImages[categoryKey] || unsplashImages.dresses;
  const imageId = images[index % images.length];
  // Bags use local image paths directly
  if (category === "bags") {
    return imageId;
  }
  return `https://images.unsplash.com/photo-${imageId}?w=800&q=80`;
};

// Product type definitions
interface AlgoliaProduct {
  objectID: string;
  name: string;
  category: string;
  price: number;
  brand: string;
  gender: string;
  image: string;
  url: string;
  originalPrice?: number;
  inStock: boolean;
  tags: string[];
  rating?: number;
}

// Generate static products (same logic as frontend)
function generateStaticProducts(): AlgoliaProduct[] {
  const products: AlgoliaProduct[] = [];

  // Dresses (110 items)
  const dressTypes = [
    "Floral Maxi",
    "Bohemian Maxi",
    "Evening Maxi",
    "Beach Maxi",
    "Printed Maxi",
    "A-line Midi",
    "Wrap Midi",
    "Shirt Midi",
    "Bodycon Midi",
    "Pleated Midi",
    "Cocktail Mini",
    "Party Mini",
    "Casual Mini",
    "Denim Mini",
    "Skater Mini",
    "Evening Gown",
    "Cocktail Formal",
    "Ball Gown",
    "Formal Midi",
    "Velvet Formal",
    "T-shirt Casual",
    "Sundress",
    "Shift Casual",
    "Slip Dress",
    "Tunic Dress",
  ];

  for (let i = 0; i < 110; i++) {
    const type = dressTypes[i % dressTypes.length];
    const price = 1499 + Math.floor(Math.random() * 7500);
    const tags: string[] = [];
    if (i % 3 === 0) tags.push("sale");
    if (i % 5 === 0) tags.push("new-arrivals");
    if (i % 10 === 0) tags.push("trending");

    products.push({
      objectID: generateId("dress", i + 1),
      name: `${type} Dress`,
      category: "dresses",
      price,
      brand: getBrand(i),
      gender: "women",
      image: getImage("dresses", i),
      url: `/product/${generateId("dress", i + 1)}`,
      originalPrice: tags.includes("sale")
        ? Math.floor(price * 1.4)
        : undefined,
      inStock: i % 11 !== 0,
      tags,
      rating: getRandomRating(),
    });
  }

  // Tops (110 items)
  const topTypes = [
    "Button-down Shirt",
    "Oxford Shirt",
    "Chambray Shirt",
    "Linen Shirt",
    "Silk Shirt",
    "Ruffled Blouse",
    "Peasant Blouse",
    "Peplum Blouse",
    "Tie-neck Blouse",
    "Wrap Blouse",
    "Basic T-shirt",
    "Graphic T-shirt",
    "V-neck Tee",
    "Crop Tee",
    "Oversized Tee",
    "Cami Crop Top",
    "Off-shoulder Top",
    "Halter Top",
    "Tube Top",
    "Wrap Crop Top",
    "Embroidered Tunic",
    "Printed Tunic",
    "Flowy Tunic",
    "Longline Tunic",
    "Kaftan Top",
  ];

  for (let i = 0; i < 110; i++) {
    const type = topTypes[i % topTypes.length];
    const price = 999 + Math.floor(Math.random() * 4000);
    const tags: string[] = [];
    if (i % 3 === 0) tags.push("sale");
    if (i % 5 === 0) tags.push("new-arrivals");
    if (i % 10 === 0) tags.push("trending");

    products.push({
      objectID: generateId("tops", i + 1),
      name: type,
      category: "tops",
      price,
      brand: getBrand(i),
      gender: "women",
      image: getImage("tops", i),
      url: `/product/${generateId("tops", i + 1)}`,
      originalPrice: tags.includes("sale")
        ? Math.floor(price * 1.4)
        : undefined,
      inStock: i % 11 !== 0,
      tags,
      rating: getRandomRating(),
    });
  }

  // Bottoms (110 items)
  const bottomTypes = [
    "Skinny Jeans",
    "Straight Jeans",
    "Wide-leg Jeans",
    "Boyfriend Jeans",
    "Mom Jeans",
    "Formal Trousers",
    "Culottes",
    "Palazzo Pants",
    "Cigarette Pants",
    "Chinos",
    "Pencil Skirt",
    "A-line Skirt",
    "Pleated Skirt",
    "Wrap Skirt",
    "Maxi Skirt",
    "Denim Shorts",
    "Tailored Shorts",
    "Bermuda Shorts",
    "High-waist Shorts",
    "Athletic Shorts",
    "Basic Leggings",
    "Printed Leggings",
    "Leather-look Leggings",
    "High-waist Leggings",
    "Ankle Leggings",
  ];

  for (let i = 0; i < 110; i++) {
    const type = bottomTypes[i % bottomTypes.length];
    const price = 1299 + Math.floor(Math.random() * 4700);
    const tags: string[] = [];
    if (i % 3 === 0) tags.push("sale");
    if (i % 5 === 0) tags.push("new-arrivals");
    if (i % 10 === 0) tags.push("trending");

    products.push({
      objectID: generateId("bott", i + 1),
      name: type,
      category: "bottoms",
      price,
      brand: getBrand(i),
      gender: "unisex",
      image: getImage("bottoms", i),
      url: `/product/${generateId("bott", i + 1)}`,
      originalPrice: tags.includes("sale")
        ? Math.floor(price * 1.4)
        : undefined,
      inStock: i % 11 !== 0,
      tags,
      rating: getRandomRating(),
    });
  }

  // Outerwear (105 items)
  const outerwearTypes = [
    "Denim Jacket",
    "Bomber Jacket",
    "Biker Jacket",
    "Varsity Jacket",
    "Utility Jacket",
    "Classic Blazer",
    "Oversized Blazer",
    "Double-breasted Blazer",
    "Linen Blazer",
    "Velvet Blazer",
    "Trench Coat",
    "Wool Coat",
    "Pea Coat",
    "Puffer Coat",
    "Longline Coat",
    "Chunky Cardigan",
    "Longline Cardigan",
    "Cropped Cardigan",
    "Belted Cardigan",
    "Open-front Cardigan",
    "Leather Jacket",
  ];

  for (let i = 0; i < 105; i++) {
    const type = outerwearTypes[i % outerwearTypes.length];
    const price = 2499 + Math.floor(Math.random() * 10500);
    const tags: string[] = [];
    if (i % 3 === 0) tags.push("sale");
    if (i % 5 === 0) tags.push("new-arrivals");
    if (i % 10 === 0) tags.push("trending");

    products.push({
      objectID: generateId("oute", i + 1),
      name: type,
      category: "outerwear",
      price,
      brand: getBrand(i),
      gender: "unisex",
      image: getImage("outerwear", i),
      url: `/product/${generateId("oute", i + 1)}`,
      originalPrice: tags.includes("sale")
        ? Math.floor(price * 1.4)
        : undefined,
      inStock: i % 11 !== 0,
      tags,
      rating: getRandomRating(),
    });
  }

  // Footwear (110 items)
  const footwearTypes = [
    "Classic Pumps",
    "Stiletto Heels",
    "Block Heel",
    "Kitten Heels",
    "Platform Heels",
    "Ballet Flats",
    "Loafers",
    "Mules",
    "D'Orsay Flats",
    "Pointed Flats",
    "Low-top Sneakers",
    "High-top Sneakers",
    "Slip-on Sneakers",
    "Platform Sneakers",
    "Chunky Sneakers",
    "Strappy Sandals",
    "Flat Sandals",
    "Wedge Sandals",
    "Slide Sandals",
    "Gladiator Sandals",
    "Ankle Boots",
    "Knee-high Boots",
    "Chelsea Boots",
    "Combat Boots",
    "Western Boots",
  ];

  for (let i = 0; i < 110; i++) {
    const type = footwearTypes[i % footwearTypes.length];
    const price = 1499 + Math.floor(Math.random() * 6500);
    const tags: string[] = [];
    if (i % 3 === 0) tags.push("sale");
    if (i % 5 === 0) tags.push("new-arrivals");
    if (i % 10 === 0) tags.push("trending");

    products.push({
      objectID: generateId("foot", i + 1),
      name: type,
      category: "footwear",
      price,
      brand: getBrand(i),
      gender: "unisex",
      image: getImage("footwear", i),
      url: `/product/${generateId("foot", i + 1)}`,
      originalPrice: tags.includes("sale")
        ? Math.floor(price * 1.4)
        : undefined,
      inStock: i % 11 !== 0,
      tags,
      rating: getRandomRating(),
    });
  }

  // Accessories (110 items)
  const accessoryTypes = [
    "Tote Bag",
    "Crossbody Bag",
    "Clutch Bag",
    "Backpack",
    "Hobo Bag",
    "Satchel",
    "Layered Necklace",
    "Statement Necklace",
    "Pendant Necklace",
    "Choker",
    "Pearl Necklace",
    "Hoop Earrings",
    "Stud Earrings",
    "Drop Earrings",
    "Chandelier Earrings",
    "Ear Cuffs",
    "Charm Bracelet",
    "Bangle Set",
    "Cuff Bracelet",
    "Chain Bracelet",
    "Beaded Bracelet",
    "Statement Ring",
    "Stackable Rings",
    "Cocktail Ring",
    "Band Ring",
    "Midi Rings",
    "Silk Scarf",
    "Pashmina",
    "Infinity Scarf",
    "Bandana",
    "Square Scarf",
    "Leather Belt",
    "Chain Belt",
    "Fabric Belt",
    "Wide Belt",
    "Skinny Belt",
    "Cat-eye Sunglasses",
    "Aviator Sunglasses",
    "Round Sunglasses",
    "Square Sunglasses",
    "Oversized Sunglasses",
    "Headband",
    "Hair Clips",
    "Scrunchies",
    "Bobby Pins",
    "Hair Ties",
  ];

  for (let i = 0; i < 110; i++) {
    const type = accessoryTypes[i % accessoryTypes.length];
    const price = 499 + Math.floor(Math.random() * 9500);
    const tags: string[] = [];
    if (i % 3 === 0) tags.push("sale");
    if (i % 5 === 0) tags.push("new-arrivals");
    if (i % 10 === 0) tags.push("trending");

    products.push({
      objectID: generateId("acce", i + 1),
      name: type,
      category: "accessories",
      price,
      brand: getBrand(i),
      gender: "unisex",
      image: getImage("accessories", i),
      url: `/product/${generateId("acce", i + 1)}`,
      originalPrice: tags.includes("sale")
        ? Math.floor(price * 1.4)
        : undefined,
      inStock: i % 11 !== 0,
      tags,
      rating: getRandomRating(),
    });
  }

  // Bags (45 items)
  const bagTypes = [
    "Woven Hobo Bag",
    "Buckle Shoulder Bag",
    "Woven Tote Bag",
    "Classic Crossbody Bag",
    "Vanity Top Handle Bag",
    "Fringe Hobo Bag",
    "Moon Crescent Bag",
    "Striped Canvas Tote",
    "Leather Satchel Bag",
    "Chain Strap Shoulder Bag",
    "Quilted Crossbody Bag",
    "Mini Bucket Bag",
    "Structured Box Bag",
    "Slouchy Hobo Bag",
    "Convertible Backpack Bag",
    "Evening Clutch Bag",
    "Work Tote Bag",
    "Weekend Duffle Bag",
    "Woven Beach Tote",
    "Metallic Evening Bag",
  ];

  for (let i = 0; i < 45; i++) {
    const type = bagTypes[i % bagTypes.length];
    const price = 2999 + Math.floor(Math.random() * 13000);
    const tags: string[] = [];
    if (i % 3 === 0) tags.push("sale");
    if (i % 5 === 0) tags.push("new-arrivals");
    if (i % 10 === 0) tags.push("trending");

    products.push({
      objectID: generateId("bags", i + 1),
      name: type,
      category: "bags",
      price,
      brand: getBrand(i),
      gender: "women",
      image: getImage("bags", i),
      url: `/product/${generateId("bags", i + 1)}`,
      originalPrice: tags.includes("sale")
        ? Math.floor(price * 1.4)
        : undefined,
      inStock: i % 11 !== 0,
      tags,
      rating: getRandomRating(),
    });
  }

  return products;
}

// Algolia API helper
async function saveObjectsToAlgolia(
  objects: AlgoliaProduct[],
  appId: string,
  adminKey: string,
  indexName: string
): Promise<{ taskID: number }> {
  const url = `https://${appId}.algolia.net/1/indexes/${indexName}/batch`;

  const requests = objects.map((obj) => ({
    action: "updateObject",
    body: obj,
  }));

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "X-Algolia-Application-Id": appId,
      "X-Algolia-API-Key": adminKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ requests }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Algolia API error: ${error}`);
  }

  return response.json();
}

// Configure index settings
async function configureAlgoliaIndex(
  appId: string,
  adminKey: string,
  indexName: string
): Promise<void> {
  const url = `https://${appId}.algolia.net/1/indexes/${indexName}/settings`;

  const settings = {
    searchableAttributes: ["name", "brand", "category"],
    attributesForFaceting: [
      "filterOnly(objectID)",
      "category",
      "brand",
      "gender",
      "price",
      "tags",
      "inStock",
    ],
    customRanking: ["desc(rating)", "desc(inStock)"],
    ranking: [
      "typo",
      "geo",
      "words",
      "filters",
      "proximity",
      "attribute",
      "exact",
      "custom",
    ],
  };

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "X-Algolia-Application-Id": appId,
      "X-Algolia-API-Key": adminKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(settings),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to configure index: ${error}`);
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ALGOLIA_APP_ID = "KEBAEMMQPI";
    const ALGOLIA_ADMIN_KEY = Deno.env.get("ALGOLIA_ADMIN_KEY");
    const ALGOLIA_INDEX_NAME = "ogura-products";

    if (!ALGOLIA_ADMIN_KEY) {
      throw new Error("ALGOLIA_ADMIN_KEY is not configured");
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Fetch database products
    const { data: dbProducts, error: dbError } = await supabase
      .from("products")
      .select(
        `
        id,
        title,
        category,
        price,
        original_price,
        images,
        is_available,
        designer_id,
        designers (name, brand_name)
      `
      );

    if (dbError) {
      console.error("Database error:", dbError);
    }

    // Transform database products to Algolia format
    const dbAlgoliaProducts: AlgoliaProduct[] = (dbProducts || []).map(
      (product: any) => ({
        objectID: product.id,
        name: product.title,
        category: product.category,
        price: product.price,
        brand: product.designers?.brand_name || product.designers?.name || "OGURA",
        gender: "women",
        image: Array.isArray(product.images) ? product.images[0] : "",
        url: `/product/${product.id}`,
        originalPrice: product.original_price,
        inStock: product.is_available !== false,
        tags: [],
        rating: 4.5,
      })
    );

    // Generate static products
    const staticProducts = generateStaticProducts();

    // Combine all products
    const allProducts = [...staticProducts, ...dbAlgoliaProducts];

    console.log(
      `Syncing ${allProducts.length} products (${staticProducts.length} static + ${dbAlgoliaProducts.length} from database)`
    );

    // Configure index settings first
    await configureAlgoliaIndex(
      ALGOLIA_APP_ID,
      ALGOLIA_ADMIN_KEY,
      ALGOLIA_INDEX_NAME
    );

    // Batch upload in chunks of 1000
    const BATCH_SIZE = 1000;
    let totalSynced = 0;

    for (let i = 0; i < allProducts.length; i += BATCH_SIZE) {
      const batch = allProducts.slice(i, i + BATCH_SIZE);
      await saveObjectsToAlgolia(
        batch,
        ALGOLIA_APP_ID,
        ALGOLIA_ADMIN_KEY,
        ALGOLIA_INDEX_NAME
      );
      totalSynced += batch.length;
      console.log(`Synced batch: ${totalSynced}/${allProducts.length}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully synced ${allProducts.length} products to Algolia`,
        details: {
          static_products: staticProducts.length,
          database_products: dbAlgoliaProducts.length,
          total: allProducts.length,
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Sync error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
