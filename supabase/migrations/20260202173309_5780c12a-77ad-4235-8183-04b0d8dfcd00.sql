-- =====================================================
-- OGURA SELLER PORTAL - DATABASE SCHEMA
-- =====================================================

-- 1. Create role enum for RBAC
CREATE TYPE public.app_role AS ENUM ('consumer', 'seller', 'admin');

-- 2. User roles table (CRITICAL: roles stored separately from profiles)
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at timestamptz DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 4. RLS policies for user_roles
CREATE POLICY "Users can view own roles" 
ON public.user_roles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" 
ON public.user_roles FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- 5. Sellers table
CREATE TABLE public.sellers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    brand_name text NOT NULL,
    city text NOT NULL,
    instagram_handle text,
    profile_image text,
    banner_image text,
    description text,
    is_verified boolean DEFAULT false,
    is_active boolean DEFAULT true,
    application_status text DEFAULT 'pending' CHECK (application_status IN ('pending', 'approved', 'rejected')) NOT NULL,
    
    -- Business details
    gstin text,
    pan_number text,
    bank_account_number text,
    bank_ifsc text,
    bank_name text,
    
    -- Seller type
    seller_type text CHECK (seller_type IN ('independent_designer', 'studio_owner')) NOT NULL,
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS on sellers
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;

-- Sellers RLS policies
CREATE POLICY "Sellers can view own profile" 
ON public.sellers FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Sellers can update own profile" 
ON public.sellers FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert seller application" 
ON public.sellers FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all sellers" 
ON public.sellers FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- 6. Enhance products table for seller portal
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS seller_id uuid REFERENCES public.sellers(id);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS status text DEFAULT 'draft' 
  CHECK (status IN ('draft', 'submitted', 'under_review', 'live', 'rejected', 'disabled'));
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS rejection_reason text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS short_description text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS fabric text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS care_instructions text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS occasion_tags jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS style_tags jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS dispatch_days integer DEFAULT 7;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_made_to_order boolean DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_returnable boolean DEFAULT true;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS category_id uuid;

-- Update products RLS to support seller access
DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can insert products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can update products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can delete products" ON public.products;

CREATE POLICY "Anyone can view live products" 
ON public.products FOR SELECT 
USING (status = 'live' AND is_available = true);

CREATE POLICY "Sellers can view own products" 
ON public.products FOR SELECT 
USING (seller_id IN (SELECT id FROM public.sellers WHERE user_id = auth.uid()));

CREATE POLICY "Sellers can insert own products" 
ON public.products FOR INSERT 
WITH CHECK (seller_id IN (SELECT id FROM public.sellers WHERE user_id = auth.uid()));

CREATE POLICY "Sellers can update own products" 
ON public.products FOR UPDATE 
USING (seller_id IN (SELECT id FROM public.sellers WHERE user_id = auth.uid()));

CREATE POLICY "Sellers can delete own products" 
ON public.products FOR DELETE 
USING (seller_id IN (SELECT id FROM public.sellers WHERE user_id = auth.uid()));

CREATE POLICY "Admins can manage all products" 
ON public.products FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- 7. Product variants table for stock tracking
CREATE TABLE public.product_variants (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    size text NOT NULL,
    color_name text NOT NULL,
    color_hex text,
    sku text,
    stock_quantity integer DEFAULT 0 CHECK (stock_quantity >= 0),
    price_override integer,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE (product_id, size, color_name)
);

ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view variants of live products" 
ON public.product_variants FOR SELECT 
USING (product_id IN (SELECT id FROM public.products WHERE status = 'live' AND is_available = true));

CREATE POLICY "Sellers can manage own product variants" 
ON public.product_variants FOR ALL 
USING (product_id IN (
    SELECT p.id FROM public.products p 
    JOIN public.sellers s ON p.seller_id = s.id 
    WHERE s.user_id = auth.uid()
));

-- 8. Orders table
CREATE TABLE public.orders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number text UNIQUE NOT NULL,
    customer_id uuid REFERENCES auth.users(id) NOT NULL,
    seller_id uuid REFERENCES public.sellers(id) NOT NULL,
    
    status text DEFAULT 'new' CHECK (status IN ('new', 'accepted', 'packed', 'shipped', 'delivered', 'cancelled')) NOT NULL,
    
    subtotal integer NOT NULL,
    shipping_fee integer DEFAULT 0,
    discount integer DEFAULT 0,
    total integer NOT NULL,
    
    tracking_id text,
    shipping_carrier text,
    shipping_address jsonb NOT NULL,
    
    created_at timestamptz DEFAULT now(),
    accepted_at timestamptz,
    packed_at timestamptz,
    shipped_at timestamptz,
    delivered_at timestamptz,
    cancelled_at timestamptz
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view own orders" 
ON public.orders FOR SELECT 
USING (auth.uid() = customer_id);

CREATE POLICY "Sellers can view orders for their products" 
ON public.orders FOR SELECT 
USING (seller_id IN (SELECT id FROM public.sellers WHERE user_id = auth.uid()));

CREATE POLICY "Sellers can update orders for their products" 
ON public.orders FOR UPDATE 
USING (seller_id IN (SELECT id FROM public.sellers WHERE user_id = auth.uid()));

CREATE POLICY "Customers can create orders" 
ON public.orders FOR INSERT 
WITH CHECK (auth.uid() = customer_id);

-- 9. Order items table
CREATE TABLE public.order_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id uuid REFERENCES public.products(id) NOT NULL,
    variant_id uuid REFERENCES public.product_variants(id),
    quantity integer NOT NULL CHECK (quantity > 0),
    unit_price integer NOT NULL,
    total_price integer NOT NULL,
    size text,
    color text,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view own order items" 
ON public.order_items FOR SELECT 
USING (order_id IN (SELECT id FROM public.orders WHERE customer_id = auth.uid()));

CREATE POLICY "Sellers can view order items for their orders" 
ON public.order_items FOR SELECT 
USING (order_id IN (
    SELECT o.id FROM public.orders o 
    JOIN public.sellers s ON o.seller_id = s.id 
    WHERE s.user_id = auth.uid()
));

CREATE POLICY "Customers can insert order items" 
ON public.order_items FOR INSERT 
WITH CHECK (order_id IN (SELECT id FROM public.orders WHERE customer_id = auth.uid()));

-- 10. Payouts table
CREATE TABLE public.payouts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id uuid REFERENCES public.sellers(id) NOT NULL,
    amount integer NOT NULL,
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')) NOT NULL,
    
    order_ids jsonb DEFAULT '[]'::jsonb,
    
    settlement_cycle text,
    payout_date date,
    transaction_reference text,
    
    created_at timestamptz DEFAULT now(),
    processed_at timestamptz
);

ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sellers can view own payouts" 
ON public.payouts FOR SELECT 
USING (seller_id IN (SELECT id FROM public.sellers WHERE user_id = auth.uid()));

-- 11. Support tickets table
CREATE TABLE public.support_tickets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id uuid REFERENCES public.sellers(id) NOT NULL,
    subject text NOT NULL,
    description text NOT NULL,
    status text DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')) NOT NULL,
    
    order_id uuid REFERENCES public.orders(id),
    product_id uuid REFERENCES public.products(id),
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sellers can view own tickets" 
ON public.support_tickets FOR SELECT 
USING (seller_id IN (SELECT id FROM public.sellers WHERE user_id = auth.uid()));

CREATE POLICY "Sellers can create tickets" 
ON public.support_tickets FOR INSERT 
WITH CHECK (seller_id IN (SELECT id FROM public.sellers WHERE user_id = auth.uid()));

CREATE POLICY "Sellers can update own tickets" 
ON public.support_tickets FOR UPDATE 
USING (seller_id IN (SELECT id FROM public.sellers WHERE user_id = auth.uid()));

-- 12. Categories table (system-defined)
CREATE TABLE public.categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL UNIQUE,
    slug text NOT NULL UNIQUE,
    parent_id uuid REFERENCES public.categories(id),
    sort_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active categories" 
ON public.categories FOR SELECT 
USING (is_active = true);

-- Add foreign key from products to categories
ALTER TABLE public.products 
ADD CONSTRAINT products_category_id_fkey 
FOREIGN KEY (category_id) REFERENCES public.categories(id);

-- Pre-populate categories
INSERT INTO public.categories (name, slug, sort_order) VALUES
  ('Sarees', 'sarees', 1),
  ('Lehengas', 'lehengas', 2),
  ('Kurta Sets', 'kurta-sets', 3),
  ('Dresses', 'dresses', 4),
  ('Blouses', 'blouses', 5),
  ('Dupattas', 'dupattas', 6),
  ('Indo-Western', 'indo-western', 7),
  ('Bridal Wear', 'bridal-wear', 8);

-- 13. Triggers for updated_at
CREATE TRIGGER update_sellers_updated_at
BEFORE UPDATE ON public.sellers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_product_variants_updated_at
BEFORE UPDATE ON public.product_variants
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_support_tickets_updated_at
BEFORE UPDATE ON public.support_tickets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 14. Function to auto-grant seller role on approved application
CREATE OR REPLACE FUNCTION public.handle_seller_approval()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.application_status = 'approved' AND OLD.application_status != 'approved' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.user_id, 'seller')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_seller_approval
AFTER UPDATE ON public.sellers
FOR EACH ROW
EXECUTE FUNCTION public.handle_seller_approval();

-- 15. Create index for performance
CREATE INDEX IF NOT EXISTS idx_products_seller_id ON public.products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_orders_seller_id ON public.orders(seller_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON public.product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_payouts_seller_id ON public.payouts(seller_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);