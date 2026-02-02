// Seller Portal TypeScript Interfaces

export type AppRole = 'consumer' | 'seller' | 'admin';

export type SellerType = 'independent_designer' | 'studio_owner';

export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export type ProductStatus = 'draft' | 'submitted' | 'under_review' | 'live' | 'rejected' | 'disabled';

export type OrderStatus = 'new' | 'accepted' | 'packed' | 'shipped' | 'delivered' | 'cancelled';

export type PayoutStatus = 'pending' | 'processing' | 'completed' | 'failed';

export type TicketStatus = 'open' | 'in_progress' | 'resolved';

export interface Seller {
  id: string;
  user_id: string;
  brand_name: string;
  city: string;
  instagram_handle?: string;
  profile_image?: string;
  banner_image?: string;
  description?: string;
  is_verified: boolean;
  is_active: boolean;
  application_status: ApplicationStatus;
  gstin?: string;
  pan_number?: string;
  bank_account_number?: string;
  bank_ifsc?: string;
  bank_name?: string;
  seller_type: SellerType;
  created_at: string;
  updated_at: string;
}

export interface SellerProduct {
  id: string;
  title: string;
  short_description?: string;
  description?: string;
  price: number;
  original_price?: number;
  images: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  category: string;
  category_id?: string;
  fabric?: string;
  material?: string;
  care_instructions?: string;
  occasion_tags: string[];
  style_tags: string[];
  dispatch_days: number;
  is_made_to_order: boolean;
  is_returnable: boolean;
  is_available: boolean;
  status: ProductStatus;
  rejection_reason?: string;
  seller_id: string;
  designer_id?: string;
  vendor_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  size: string;
  color_name: string;
  color_hex?: string;
  sku?: string;
  stock_quantity: number;
  price_override?: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  seller_id: string;
  status: OrderStatus;
  subtotal: number;
  shipping_fee: number;
  discount: number;
  total: number;
  tracking_id?: string;
  shipping_carrier?: string;
  shipping_address: {
    full_name: string;
    mobile: string;
    address_line: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  created_at: string;
  accepted_at?: string;
  packed_at?: string;
  shipped_at?: string;
  delivered_at?: string;
  cancelled_at?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  size?: string;
  color?: string;
  created_at: string;
  product?: SellerProduct;
}

export interface Payout {
  id: string;
  seller_id: string;
  amount: number;
  status: PayoutStatus;
  order_ids: string[];
  settlement_cycle?: string;
  payout_date?: string;
  transaction_reference?: string;
  created_at: string;
  processed_at?: string;
}

export interface SupportTicket {
  id: string;
  seller_id: string;
  subject: string;
  description: string;
  status: TicketStatus;
  order_id?: string;
  product_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

// Dashboard stats
export interface SellerDashboardStats {
  totalProducts: number;
  liveProducts: number;
  todayOrders: number;
  pendingOrders: number;
  monthlyRevenue: number;
  lowStockProducts: { id: string; title: string; stock: number }[];
}

// Form data for creating/updating products
export interface ProductFormData {
  // Step 1: Media
  images: string[];
  
  // Step 2: Details
  title: string;
  short_description: string;
  description: string;
  fabric: string;
  care_instructions: string;
  
  // Step 3: Category & Tags
  category_id: string;
  occasion_tags: string[];
  style_tags: string[];
  
  // Step 4: Pricing & Variants
  price: number;
  original_price?: number;
  variants: {
    size: string;
    color_name: string;
    color_hex: string;
    stock_quantity: number;
  }[];
  
  // Step 5: Dispatch & Policies
  dispatch_days: number;
  is_made_to_order: boolean;
  is_returnable: boolean;
}

// Seller application form
export interface SellerApplicationData {
  brand_name: string;
  city: string;
  instagram_handle?: string;
  description: string;
  seller_type: SellerType;
}
