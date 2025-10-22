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
