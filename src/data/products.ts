import { Product } from "@/types";

export const products: Product[] = [
  // Dresses
  {
    id: "dress-1",
    name: "Floral Maxi Dress",
    brand: "OGURA",
    price: 3499,
    category: "dresses",
    images: [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800"
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Floral Blue", hex: "#4A90E2" },
      { name: "Floral Pink", hex: "#E91E63" }
    ],
    description: "Elegant floral maxi dress perfect for summer occasions",
    material: "100% Cotton",
    inStock: true,
    tags: ["new-arrivals"],
    rating: 4.5,
    reviews: 128
  },
  {
    id: "dress-2",
    name: "Black Cocktail Dress",
    brand: "ELEGANCE",
    price: 4999,
    originalPrice: 7999,
    category: "dresses",
    images: [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800",
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800"
    ],
    sizes: ["S", "M", "L"],
    colors: [{ name: "Black", hex: "#000000" }],
    description: "Classic little black dress for evening events",
    material: "Polyester blend",
    inStock: true,
    tags: ["sale"],
    rating: 4.8,
    reviews: 245
  },
  {
    id: "dress-3",
    name: "Summer Midi Dress",
    brand: "BREEZE",
    price: 2799,
    category: "dresses",
    images: [
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800"
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Yellow", hex: "#FFC107" },
      { name: "White", hex: "#FFFFFF" }
    ],
    description: "Breezy midi dress for casual summer days",
    material: "Linen blend",
    inStock: true,
    tags: ["new-arrivals"],
    rating: 4.3,
    reviews: 89
  },
  
  // Tops
  {
    id: "top-1",
    name: "White Cotton Shirt",
    brand: "CLASSIC",
    price: 1499,
    category: "tops",
    images: [
      "https://images.unsplash.com/photo-1618517351616-38fb9c5210c6?w=800"
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Blue", hex: "#2196F3" }
    ],
    description: "Essential white cotton shirt for any wardrobe",
    material: "100% Cotton",
    inStock: true,
    tags: [],
    rating: 4.6,
    reviews: 312
  },
  {
    id: "top-2",
    name: "Silk Blouse",
    brand: "LUXE",
    price: 2899,
    originalPrice: 4299,
    category: "tops",
    images: [
      "https://images.unsplash.com/photo-1624206112918-f140f087f9b5?w=800"
    ],
    sizes: ["S", "M", "L"],
    colors: [
      { name: "Champagne", hex: "#F3E5AB" },
      { name: "Black", hex: "#000000" }
    ],
    description: "Luxurious silk blouse for elegant styling",
    material: "Pure Silk",
    inStock: true,
    tags: ["sale"],
    rating: 4.7,
    reviews: 156
  },
  {
    id: "top-3",
    name: "Striped Crop Top",
    brand: "URBAN",
    price: 1199,
    category: "tops",
    images: [
      "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800"
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Navy Stripe", hex: "#001f3f" },
      { name: "Red Stripe", hex: "#FF4136" }
    ],
    description: "Trendy striped crop top for casual wear",
    material: "Cotton Jersey",
    inStock: true,
    tags: ["new-arrivals"],
    rating: 4.2,
    reviews: 78
  },

  // Bottoms
  {
    id: "bottom-1",
    name: "High-Waist Jeans",
    brand: "DENIM CO",
    price: 2499,
    category: "bottoms",
    images: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800"
    ],
    sizes: ["26", "28", "30", "32", "34"],
    colors: [
      { name: "Dark Blue", hex: "#003366" },
      { name: "Black", hex: "#000000" }
    ],
    description: "Classic high-waist jeans with perfect fit",
    material: "Denim",
    inStock: true,
    tags: [],
    rating: 4.5,
    reviews: 423
  },
  {
    id: "bottom-2",
    name: "Pleated Midi Skirt",
    brand: "ELEGANCE",
    price: 1999,
    originalPrice: 2999,
    category: "bottoms",
    images: [
      "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800"
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Beige", hex: "#D2B48C" },
      { name: "Navy", hex: "#000080" }
    ],
    description: "Elegant pleated midi skirt for office or events",
    material: "Polyester",
    inStock: true,
    tags: ["sale"],
    rating: 4.4,
    reviews: 167
  },
  {
    id: "bottom-3",
    name: "Leather Shorts",
    brand: "URBAN",
    price: 3299,
    category: "bottoms",
    images: [
      "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800"
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: [{ name: "Black", hex: "#000000" }],
    description: "Edgy leather shorts for bold fashion statements",
    material: "Faux Leather",
    inStock: true,
    tags: ["new-arrivals"],
    rating: 4.3,
    reviews: 92
  },

  // Outerwear
  {
    id: "outer-1",
    name: "Denim Jacket",
    brand: "CLASSIC",
    price: 3999,
    category: "outerwear",
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Light Blue", hex: "#87CEEB" },
      { name: "Dark Blue", hex: "#00008B" }
    ],
    description: "Timeless denim jacket for layering",
    material: "Denim",
    inStock: true,
    tags: [],
    rating: 4.7,
    reviews: 289
  },
  {
    id: "outer-2",
    name: "Wool Blazer",
    brand: "PROFESSIONAL",
    price: 5999,
    category: "outerwear",
    images: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800"
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Grey", hex: "#808080" }
    ],
    description: "Professional wool blazer for work",
    material: "Wool blend",
    inStock: true,
    tags: ["new-arrivals"],
    rating: 4.8,
    reviews: 234
  },

  // Footwear
  {
    id: "foot-1",
    name: "Classic Heels",
    brand: "STEPS",
    price: 2999,
    category: "footwear",
    images: [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800"
    ],
    sizes: ["36", "37", "38", "39", "40"],
    colors: [
      { name: "Nude", hex: "#E3BC9A" },
      { name: "Black", hex: "#000000" }
    ],
    description: "Elegant classic heels for any occasion",
    material: "Synthetic leather",
    inStock: true,
    tags: [],
    rating: 4.4,
    reviews: 198
  },
  {
    id: "foot-2",
    name: "White Sneakers",
    brand: "SPORT",
    price: 3499,
    category: "footwear",
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800"
    ],
    sizes: ["36", "37", "38", "39", "40", "41"],
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Off-White", hex: "#F5F5DC" }
    ],
    description: "Comfortable white sneakers for everyday wear",
    material: "Canvas & Rubber",
    inStock: true,
    tags: ["new-arrivals"],
    rating: 4.6,
    reviews: 567
  },
  {
    id: "foot-3",
    name: "Strappy Sandals",
    brand: "SUMMER",
    price: 1999,
    originalPrice: 2999,
    category: "footwear",
    images: [
      "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=800"
    ],
    sizes: ["36", "37", "38", "39", "40"],
    colors: [
      { name: "Tan", hex: "#D2691E" },
      { name: "Black", hex: "#000000" }
    ],
    description: "Stylish strappy sandals for summer",
    material: "Leather",
    inStock: true,
    tags: ["sale"],
    rating: 4.3,
    reviews: 145
  },
  {
    id: "foot-4",
    name: "Ankle Boots",
    brand: "URBAN",
    price: 4499,
    category: "footwear",
    images: [
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800"
    ],
    sizes: ["36", "37", "38", "39", "40"],
    colors: [{ name: "Black", hex: "#000000" }],
    description: "Chic ankle boots for fall and winter",
    material: "Genuine Leather",
    inStock: true,
    tags: [],
    rating: 4.7,
    reviews: 289
  },

  // Accessories
  {
    id: "acc-1",
    name: "Leather Handbag",
    brand: "LUXE",
    price: 5999,
    category: "accessories",
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800"
    ],
    sizes: ["One Size"],
    colors: [
      { name: "Brown", hex: "#8B4513" },
      { name: "Black", hex: "#000000" }
    ],
    description: "Premium leather handbag with spacious interior",
    material: "Genuine Leather",
    inStock: true,
    tags: ["new-arrivals"],
    rating: 4.8,
    reviews: 312
  },
  {
    id: "acc-2",
    name: "Gold Layered Necklace",
    brand: "JEWEL",
    price: 1299,
    category: "accessories",
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800"
    ],
    sizes: ["One Size"],
    colors: [{ name: "Gold", hex: "#FFD700" }],
    description: "Delicate layered necklace for everyday elegance",
    material: "Gold-plated",
    inStock: true,
    tags: [],
    rating: 4.5,
    reviews: 423
  },
  {
    id: "acc-3",
    name: "Silk Scarf",
    brand: "ELEGANCE",
    price: 999,
    originalPrice: 1499,
    category: "accessories",
    images: [
      "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800"
    ],
    sizes: ["One Size"],
    colors: [
      { name: "Multi", hex: "#FF69B4" },
      { name: "Blue", hex: "#4169E1" }
    ],
    description: "Luxurious silk scarf with artistic print",
    material: "Pure Silk",
    inStock: true,
    tags: ["sale"],
    rating: 4.4,
    reviews: 167
  }
];
