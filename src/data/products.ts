import { Product, ColorVariant } from "@/types";

// Helper function to generate product ID
const generateId = (category: string, index: number): string => {
  const prefix = category.substring(0, 4);
  return `${prefix}-${index}`;
};

// Helper function to get random rating
const getRandomRating = (): number => {
  return Number((3.8 + Math.random() * 1.1).toFixed(1));
};

// Helper function to get random reviews
const getRandomReviews = (): number => {
  return Math.floor(15 + Math.random() * 785);
};

// Helper function to randomly assign tags
const getRandomTags = (index: number): string[] => {
  const tags: string[] = [];
  if (index % 3 === 0) tags.push("sale");
  if (index % 5 === 0) tags.push("new-arrivals");
  if (index % 10 === 0) tags.push("trending");
  return tags;
};

// Helper function to determine if product is in stock
const isInStock = (index: number): boolean => {
  return index % 11 !== 0; // 90% in stock
};

// Helper function to get sale price
const getSalePrice = (price: number, hasSale: boolean): number | undefined => {
  return hasSale ? Math.floor(price * 1.4) : undefined;
};

// Helper function to assign occasions based on product type and category
const getOccasions = (category: string, productName: string, index: number): string[] => {
  const occasions: string[] = [];
  const name = productName.toLowerCase();
  
  // Category-based occasion assignments
  if (category === "dresses") {
    if (name.includes("evening") || name.includes("gown") || name.includes("formal") || name.includes("cocktail")) {
      occasions.push("wedding", "party");
    }
    if (name.includes("maxi") || name.includes("floral") || name.includes("beach") || name.includes("sundress")) {
      occasions.push("casual", "vacation");
    }
    if (name.includes("midi") || name.includes("shift") || name.includes("bodycon")) {
      occasions.push("office", "casual");
    }
    if (name.includes("printed") || name.includes("bohemian")) {
      occasions.push("festive", "casual");
    }
  }
  
  if (category === "tops") {
    if (name.includes("shirt") || name.includes("blouse")) {
      occasions.push("office", "casual");
    }
    if (name.includes("silk") || name.includes("ruffled") || name.includes("embroidered")) {
      occasions.push("festive", "party");
    }
    if (name.includes("t-shirt") || name.includes("tank") || name.includes("crop")) {
      occasions.push("casual", "vacation");
    }
  }
  
  if (category === "bottoms") {
    if (name.includes("trouser") || name.includes("formal") || name.includes("cigarette")) {
      occasions.push("office");
    }
    if (name.includes("jeans") || name.includes("shorts") || name.includes("casual")) {
      occasions.push("casual", "vacation");
    }
    if (name.includes("palazzo") || name.includes("culottes") || name.includes("wide")) {
      occasions.push("festive", "casual");
    }
  }
  
  if (category === "outerwear") {
    if (name.includes("blazer") || name.includes("formal") || name.includes("professional")) {
      occasions.push("office", "wedding");
    }
    if (name.includes("denim") || name.includes("bomber") || name.includes("utility")) {
      occasions.push("casual");
    }
    if (name.includes("velvet") || name.includes("sequin") || name.includes("embellished")) {
      occasions.push("party", "festive");
    }
  }
  
  if (category === "footwear") {
    if (name.includes("heel") || name.includes("pump") || name.includes("stiletto")) {
      occasions.push("wedding", "party", "office");
    }
    if (name.includes("sneaker") || name.includes("flat") || name.includes("sandal")) {
      occasions.push("casual", "vacation");
    }
    if (name.includes("boot") && (name.includes("ankle") || name.includes("chelsea"))) {
      occasions.push("office", "casual");
    }
  }
  
  if (category === "accessories") {
    if (name.includes("clutch") || name.includes("jewelry") || name.includes("statement")) {
      occasions.push("wedding", "party", "festive");
    }
    if (name.includes("tote") || name.includes("backpack") || name.includes("crossbody")) {
      occasions.push("casual", "office");
    }
    if (name.includes("sunglass") || name.includes("beach") || name.includes("straw")) {
      occasions.push("vacation", "casual");
    }
  }
  
  // Ensure every product has at least one occasion
  if (occasions.length === 0) {
    occasions.push("casual");
  }
  
  return occasions;
};

// Common color palettes
const neutralColors = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Beige", hex: "#D2B48C" },
  { name: "Grey", hex: "#808080" },
  { name: "Navy", hex: "#000080" }
];

const vibrantColors = [
  { name: "Red", hex: "#DC143C" },
  { name: "Blue", hex: "#2196F3" },
  { name: "Green", hex: "#4CAF50" },
  { name: "Yellow", hex: "#FFC107" },
  { name: "Pink", hex: "#E91E63" }
];

const pastelColors = [
  { name: "Powder Blue", hex: "#B0E0E6" },
  { name: "Blush Pink", hex: "#FFB6C1" },
  { name: "Mint", hex: "#98FF98" },
  { name: "Lavender", hex: "#E6E6FA" },
  { name: "Peach", hex: "#FFDAB9" }
];

// Brand distribution helper
const brands = ["OGURA", "ELEGANCE", "LUXE", "URBAN", "CLASSIC", "BREEZE", "DENIM CO", "PROFESSIONAL", "STEPS", "SPORT", "SUMMER", "JEWEL"];
const getBrand = (index: number): string => {
  return brands[index % brands.length];
};

// Unsplash image IDs for variety
const unsplashImages = {
  dresses: [
    "1572804013309-59a88b7e92f1", "1595777457583-95e059d581b8", "1566174053879-31528523f8ae",
    "1539008835657-9e8e9680c956", "1515372039744-b8f02a3ae446", "1496747611176-843222e1e57c",
    "1551045920-23ba15b87e72", "1595777216932-96cf2e3d6c7b", "1612336307429-8a898d10e223",
    "1582418702059-97ebafb35d09", "1617019114583-c7d2e7f05e10", "1617019114784-e5e2e5f05e10"
  ],
  tops: [
    "1618517351616-38fb9c5210c6", "1624206112918-f140f087f9b5", "1594633313593-bab3825d0caf",
    "1620799140188-3b2a02fd9a77", "1578932750294-f5075e85f44a", "1525507119028-ed4c629a60a3",
    "1591369822096-ffd140ec948f", "1562157873-175d2f7e3295", "1583744946564-b52ac1c389c8"
  ],
  bottoms: [
    "1541099649105-f69ad21f3246", "1583496661160-fb5886a0aaaa", "1591195853828-11db59a44f6b",
    "1594633312681-425e7b97ccd3", "1582552938560-c76c25b4d48e", "1509631179647-0177331693ae",
    "1598554747436-c9293d6a588f", "1624378439575-d1d4d5c5f7b5"
  ],
  outerwear: [
    "1551028719-00167b16eac5", "1591047139829-d91aecb6caea", "1539533018447-63fcce2678e3",
    "1591047139619-d91aecb6caea", "1578932750294-f5075e85f44a", "1544022613-e87317e7b5cc",
    "1580657018950-64d5f6619563", "1548624313-b8e6c5c4e6c9"
  ],
  footwear: [
    "1543163521-1bf539c55dd2", "1549298916-b41d501d3772", "1603487742131-4160ec999306",
    "1608256246200-53e635b5b65f", "1560343090-f0409e92791a", "1605348532760-3e37ce7f6e5b",
    "1551107696-a348e4b6b0a7", "1605408499393-6e2dcd5b8e5f", "1533867617858-e7b97e060509"
  ],
  accessories: [
    "1584917865442-de89df76afd3", "1599643478518-a784e5dc4c8f", "1601924994987-69e26d50dc26",
    "1611652022419-a9419a4a0e67", "1590736969955-71cc94901144", "1585856255908-a545f7b2f18a",
    "1611312449408-fcece27cdbb7", "1607013251379-e6eecfffe234"
  ]
};

const getImage = (category: string, index: number): string[] => {
  const categoryKey = category as keyof typeof unsplashImages;
  const images = unsplashImages[categoryKey] || unsplashImages.dresses;
  const imageId = images[index % images.length];
  return [`https://images.unsplash.com/photo-${imageId}?w=800&q=80`];
};

// Generate color variants with unique images for each color
const generateColorVariants = (
  category: string,
  baseIndex: number,
  colorPalette: Array<{ name: string; hex: string }>,
  sizes: string[]
): ColorVariant[] => {
  const categoryKey = category as keyof typeof unsplashImages;
  const images = unsplashImages[categoryKey] || unsplashImages.dresses;
  
  // Select 2-4 colors for variants
  const numVariants = 2 + (baseIndex % 3);
  const variants: ColorVariant[] = [];
  
  // Different crop parameters to simulate different views of the same product
  const viewParams = [
    "w=800&q=80&fit=crop",                    // Main view
    "w=800&q=80&fit=crop&crop=top",           // Top focus
    "w=800&q=80&fit=crop&crop=bottom",        // Bottom focus
    "w=800&q=80&fit=crop&crop=faces,center"   // Center focus
  ];
  
  for (let i = 0; i < numVariants; i++) {
    const color = colorPalette[(baseIndex + i) % colorPalette.length];
    // Get ONE base image for this variant
    const imageIdx = (baseIndex + i) % images.length;
    const imageId = images[imageIdx];
    
    // Generate 4 "views" of the SAME image with different crop parameters
    const variantImages: string[] = [];
    for (let j = 0; j < 4; j++) {
      variantImages.push(`https://images.unsplash.com/photo-${imageId}?${viewParams[j]}`);
    }
    
    variants.push({
      name: color.name,
      hex: color.hex,
      images: variantImages,
      available_sizes: sizes
    });
  }
  
  return variants;
};

// Generate Dresses (110 items)
const generateDresses = (): Product[] => {
  const dresses: Product[] = [];
  const types = [
    "Floral Maxi", "Bohemian Maxi", "Evening Maxi", "Beach Maxi", "Printed Maxi",
    "A-line Midi", "Wrap Midi", "Shirt Midi", "Bodycon Midi", "Pleated Midi",
    "Cocktail Mini", "Party Mini", "Casual Mini", "Denim Mini", "Skater Mini",
    "Evening Gown", "Cocktail Formal", "Ball Gown", "Formal Midi", "Velvet Formal",
    "T-shirt Casual", "Sundress", "Shift Casual", "Slip Dress", "Tunic Dress"
  ];
  
  for (let i = 0; i < 110; i++) {
    const typeIndex = i % types.length;
    const type = types[typeIndex];
    const tags = getRandomTags(i);
    const hasSale = tags.includes("sale");
    const price = 799 + Math.floor(Math.random() * 2200); // Price range: 799 - 2999
    const colorPalette = i % 3 === 0 ? vibrantColors : i % 3 === 1 ? pastelColors : neutralColors;
    const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
    const colorVariants = generateColorVariants("dresses", i, colorPalette, sizes);
    
    const productName = `${type} Dress`;
    dresses.push({
      id: generateId("dress", i + 1),
      name: productName,
      brand: getBrand(i),
      price,
      originalPrice: getSalePrice(price, hasSale),
      category: "dresses",
      images: colorVariants[0]?.images || getImage("dresses", i),
      sizes,
      colors: [colorPalette[i % colorPalette.length], colorPalette[(i + 1) % colorPalette.length]],
      colorVariants,
      description: `Elegant ${type.toLowerCase()} dress perfect for any occasion`,
      material: i % 4 === 0 ? "100% Cotton" : i % 4 === 1 ? "Polyester blend" : i % 4 === 2 ? "Silk" : "Rayon",
      inStock: isInStock(i),
      tags,
      occasions: getOccasions("dresses", productName, i),
      rating: getRandomRating(),
      reviews: getRandomReviews()
    });
  }
  return dresses;
};

// Generate Tops (110 items)
const generateTops = (): Product[] => {
  const tops: Product[] = [];
  const types = [
    "Button-down Shirt", "Oxford Shirt", "Chambray Shirt", "Linen Shirt", "Silk Shirt",
    "Ruffled Blouse", "Peasant Blouse", "Peplum Blouse", "Tie-neck Blouse", "Wrap Blouse",
    "Basic T-shirt", "Graphic T-shirt", "V-neck Tee", "Crop Tee", "Oversized Tee",
    "Cami Crop Top", "Off-shoulder Top", "Halter Top", "Tube Top", "Wrap Crop Top",
    "Embroidered Tunic", "Printed Tunic", "Flowy Tunic", "Longline Tunic", "Kaftan Top"
  ];
  
  for (let i = 0; i < 110; i++) {
    const typeIndex = i % types.length;
    const type = types[typeIndex];
    const tags = getRandomTags(i);
    const hasSale = tags.includes("sale");
    const price = 999 + Math.floor(Math.random() * 4000);
    const colorPalette = i % 2 === 0 ? neutralColors : vibrantColors;
    const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
    const colorVariants = generateColorVariants("tops", i, colorPalette, sizes);
    
    tops.push({
      id: generateId("tops", i + 1),
      name: type,
      brand: getBrand(i),
      price,
      originalPrice: getSalePrice(price, hasSale),
      category: "tops",
      images: colorVariants[0]?.images || getImage("tops", i),
      sizes,
      colors: [colorPalette[i % colorPalette.length], colorPalette[(i + 2) % colorPalette.length]],
      colorVariants,
      description: `Stylish ${type.toLowerCase()} for everyday wear`,
      material: i % 5 === 0 ? "100% Cotton" : i % 5 === 1 ? "Polyester" : i % 5 === 2 ? "Silk" : i % 5 === 3 ? "Linen" : "Cotton blend",
      inStock: isInStock(i),
      tags,
      occasions: getOccasions("tops", type, i),
      rating: getRandomRating(),
      reviews: getRandomReviews()
    });
  }
  return tops;
};

// Generate Bottoms (110 items)
const generateBottoms = (): Product[] => {
  const bottoms: Product[] = [];
  const types = [
    "Skinny Jeans", "Straight Jeans", "Wide-leg Jeans", "Boyfriend Jeans", "Mom Jeans",
    "Formal Trousers", "Culottes", "Palazzo Pants", "Cigarette Pants", "Chinos",
    "Pencil Skirt", "A-line Skirt", "Pleated Skirt", "Wrap Skirt", "Maxi Skirt",
    "Denim Shorts", "Tailored Shorts", "Bermuda Shorts", "High-waist Shorts", "Athletic Shorts",
    "Basic Leggings", "Printed Leggings", "Leather-look Leggings", "High-waist Leggings", "Ankle Leggings"
  ];
  
  for (let i = 0; i < 110; i++) {
    const typeIndex = i % types.length;
    const type = types[typeIndex];
    const isJeans = type.includes("Jeans") || type.includes("Trousers") || type.includes("Chinos");
    const tags = getRandomTags(i);
    const hasSale = tags.includes("sale");
    const price = 1299 + Math.floor(Math.random() * 4700);
    const sizes = isJeans ? ["26", "28", "30", "32", "34", "36"] : ["XS", "S", "M", "L", "XL"];
    const colorVariants = generateColorVariants("bottoms", i, neutralColors, sizes);
    
    bottoms.push({
      id: generateId("bott", i + 1),
      name: type,
      brand: getBrand(i),
      price,
      originalPrice: getSalePrice(price, hasSale),
      category: "bottoms",
      images: colorVariants[0]?.images || getImage("bottoms", i),
      sizes,
      colors: [neutralColors[i % neutralColors.length], neutralColors[(i + 1) % neutralColors.length]],
      colorVariants,
      description: `Comfortable ${type.toLowerCase()} for any occasion`,
      material: i % 4 === 0 ? "Denim" : i % 4 === 1 ? "Cotton" : i % 4 === 2 ? "Polyester" : "Viscose",
      inStock: isInStock(i),
      tags,
      occasions: getOccasions("bottoms", type, i),
      rating: getRandomRating(),
      reviews: getRandomReviews()
    });
  }
  return bottoms;
};

// Generate Outerwear (105 items)
const generateOuterwear = (): Product[] => {
  const outerwear: Product[] = [];
  const types = [
    "Denim Jacket", "Bomber Jacket", "Biker Jacket", "Varsity Jacket", "Utility Jacket",
    "Classic Blazer", "Oversized Blazer", "Double-breasted Blazer", "Linen Blazer", "Velvet Blazer",
    "Trench Coat", "Wool Coat", "Pea Coat", "Puffer Coat", "Longline Coat",
    "Chunky Cardigan", "Longline Cardigan", "Cropped Cardigan", "Belted Cardigan", "Open-front Cardigan",
    "Leather Jacket"
  ];
  
  for (let i = 0; i < 105; i++) {
    const typeIndex = i % types.length;
    const type = types[typeIndex];
    const tags = getRandomTags(i);
    const hasSale = tags.includes("sale");
    const price = 2499 + Math.floor(Math.random() * 10500);
    const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
    const colorVariants = generateColorVariants("outerwear", i, neutralColors, sizes);
    
    outerwear.push({
      id: generateId("oute", i + 1),
      name: type,
      brand: getBrand(i),
      price,
      originalPrice: getSalePrice(price, hasSale),
      category: "outerwear",
      images: colorVariants[0]?.images || getImage("outerwear", i),
      sizes,
      colors: [neutralColors[i % neutralColors.length], neutralColors[(i + 2) % neutralColors.length]],
      colorVariants,
      description: `Premium ${type.toLowerCase()} for layering`,
      material: i % 5 === 0 ? "Denim" : i % 5 === 1 ? "Wool blend" : i % 5 === 2 ? "Polyester" : i % 5 === 3 ? "Cotton" : "Leather",
      inStock: isInStock(i),
      tags,
      occasions: getOccasions("outerwear", type, i),
      rating: getRandomRating(),
      reviews: getRandomReviews()
    });
  }
  return outerwear;
};

// Generate Footwear (110 items)
const generateFootwear = (): Product[] => {
  const footwear: Product[] = [];
  const types = [
    "Classic Pumps", "Stiletto Heels", "Block Heel", "Kitten Heels", "Platform Heels",
    "Ballet Flats", "Loafers", "Mules", "D'Orsay Flats", "Pointed Flats",
    "Low-top Sneakers", "High-top Sneakers", "Slip-on Sneakers", "Platform Sneakers", "Chunky Sneakers",
    "Strappy Sandals", "Flat Sandals", "Wedge Sandals", "Slide Sandals", "Gladiator Sandals",
    "Ankle Boots", "Knee-high Boots", "Chelsea Boots", "Combat Boots", "Western Boots"
  ];
  
  for (let i = 0; i < 110; i++) {
    const typeIndex = i % types.length;
    const type = types[typeIndex];
    const tags = getRandomTags(i);
    const hasSale = tags.includes("sale");
    const price = 1499 + Math.floor(Math.random() * 6500);
    const colorPalette = i % 2 === 0 ? neutralColors : [...neutralColors.slice(0, 2), { name: "Tan", hex: "#D2691E" }, { name: "Brown", hex: "#8B4513" }];
    const sizes = ["36", "37", "38", "39", "40", "41", "42"];
    const colorVariants = generateColorVariants("footwear", i, colorPalette, sizes);
    
    footwear.push({
      id: generateId("foot", i + 1),
      name: type,
      brand: getBrand(i),
      price,
      originalPrice: getSalePrice(price, hasSale),
      category: "footwear",
      images: colorVariants[0]?.images || getImage("footwear", i),
      sizes,
      colors: [colorPalette[i % colorPalette.length], colorPalette[(i + 1) % colorPalette.length]],
      colorVariants,
      description: `Comfortable ${type.toLowerCase()} for all-day wear`,
      material: i % 4 === 0 ? "Genuine Leather" : i % 4 === 1 ? "Synthetic Leather" : i % 4 === 2 ? "Canvas" : "Suede",
      inStock: isInStock(i),
      tags,
      occasions: getOccasions("footwear", type, i),
      rating: getRandomRating(),
      reviews: getRandomReviews()
    });
  }
  return footwear;
};

// Generate Accessories (110 items)
const generateAccessories = (): Product[] => {
  const accessories: Product[] = [];
  const types = [
    "Tote Bag", "Crossbody Bag", "Clutch Bag", "Backpack", "Hobo Bag", "Satchel",
    "Layered Necklace", "Statement Necklace", "Pendant Necklace", "Choker", "Pearl Necklace",
    "Hoop Earrings", "Stud Earrings", "Drop Earrings", "Chandelier Earrings", "Ear Cuffs",
    "Charm Bracelet", "Bangle Set", "Cuff Bracelet", "Chain Bracelet", "Beaded Bracelet",
    "Statement Ring", "Stackable Rings", "Cocktail Ring", "Band Ring", "Midi Rings",
    "Silk Scarf", "Pashmina", "Infinity Scarf", "Bandana", "Square Scarf",
    "Leather Belt", "Chain Belt", "Fabric Belt", "Wide Belt", "Skinny Belt",
    "Cat-eye Sunglasses", "Aviator Sunglasses", "Round Sunglasses", "Square Sunglasses", "Oversized Sunglasses",
    "Headband", "Hair Clips", "Scrunchies", "Bobby Pins", "Hair Ties"
  ];
  
  for (let i = 0; i < 110; i++) {
    const typeIndex = i % types.length;
    const type = types[typeIndex];
    const tags = getRandomTags(i);
    const hasSale = tags.includes("sale");
    const price = 499 + Math.floor(Math.random() * 9500);
    const colorPalette = type.includes("Jewelry") || type.includes("Necklace") || type.includes("Earrings") || type.includes("Bracelet") || type.includes("Ring")
      ? [{ name: "Gold", hex: "#FFD700" }, { name: "Silver", hex: "#C0C0C0" }, { name: "Rose Gold", hex: "#B76E79" }]
      : neutralColors;
    const sizes = ["One Size"];
    const colorVariants = generateColorVariants("accessories", i, colorPalette, sizes);
    
    accessories.push({
      id: generateId("acce", i + 1),
      name: type,
      brand: getBrand(i),
      price,
      originalPrice: getSalePrice(price, hasSale),
      category: "accessories",
      images: colorVariants[0]?.images || getImage("accessories", i),
      sizes,
      colors: [colorPalette[i % colorPalette.length]],
      colorVariants,
      description: `Stylish ${type.toLowerCase()} to complete your look`,
      material: i % 5 === 0 ? "Genuine Leather" : i % 5 === 1 ? "Gold-plated" : i % 5 === 2 ? "Silk" : i % 5 === 3 ? "Metal" : "Synthetic",
      inStock: isInStock(i),
      tags,
      occasions: getOccasions("accessories", type, i),
      rating: getRandomRating(),
      reviews: getRandomReviews()
    });
  }
  return accessories;
};

// Combine all products
export const products: Product[] = [
  ...generateDresses(),
  ...generateTops(),
  ...generateBottoms(),
  ...generateOuterwear(),
  ...generateFootwear(),
  ...generateAccessories()
];
