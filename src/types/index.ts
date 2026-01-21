// Color variant with color-specific images
export interface ColorVariant {
  name: string;
  hex: string;
  images: string[];
  available_sizes?: string[];
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  category: 'dresses' | 'tops' | 'bottoms' | 'outerwear' | 'footwear' | 'accessories';
  images: string[];
  sizes: string[];
  colors: Array<{ name: string; hex: string }>;
  colorVariants?: ColorVariant[];
  description: string;
  material: string;
  inStock: boolean;
  tags: string[];
  occasions?: string[];
  rating?: number;
  reviews?: number;
}

export interface CartItem {
  product: Product;
  size: string;
  color: string;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
}

export interface FilterState {
  category: string;
  search: string;
  sortBy: 'newest' | 'price-low' | 'price-high';
  priceRange: [number, number];
  sizes: string[];
  colors: string[];
  tags: string[];
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  description: string;
  productCount: number;
  instagramHandle?: string;
  instagramFollowers?: string;
  sellsOnInstagram?: boolean;
  galleryImages?: string[];
}

export interface Occasion {
  id: string;
  name: string;
  image: string;
  description: string;
}

export interface Store {
  id: string;
  name: string;
  image: string;
  address: string;
  city: string;
  phone: string;
  hours: string;
  mapLink: string;
  whatsapp: string;
}

export interface Designer {
  id: string;
  name: string;
  brand_name: string;
  slug: string;
  banner_image?: string;
  city: string;
  category: string;
  price_range: string;
  instagram_link: string;
  followers: number;
  contact_number: string;
  email: string;
  profile_image: string;
  product_images: string[];
  description: string;
  collection_name?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DesignerProduct {
  id: string;
  title: string;
  price: number;
  original_price?: number;
  images: string[];
  category: string;
  colors: { name: string; hex: string }[];
  sizes: string[];
  description?: string;
  material?: string;
  is_available: boolean;
  designer_id: string;
  created_at?: string;
}

export interface ProductFilters {
  category?: string;
  priceRange?: [number, number];
  colors?: string[];
  inStockOnly?: boolean;
}
