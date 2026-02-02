

# Ogura Seller Portal - Implementation Plan

## Executive Summary

This plan implements a comprehensive **Seller Portal** for Ogura, enabling sellers (designers/studio owners) to manage products, inventory, orders, and payouts. The portal follows the product philosophy of being a **creator workspace, not an enterprise ERP tool**.

---

## Architecture Overview

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                           OGURA UNIFIED PLATFORM                            │
├──────────────────────────────────┬──────────────────────────────────────────┤
│      Consumer Marketplace        │           Seller Portal                  │
│         ogura.com                │        /seller/* routes                  │
├──────────────────────────────────┴──────────────────────────────────────────┤
│                                                                             │
│                           Single Backend                                    │
│                     ┌─────────────────────┐                                │
│                     │    Supabase DB      │                                │
│                     │  + RLS Policies     │                                │
│                     └─────────────────────┘                                │
│                                                                             │
│                     Role-Based Access Control (RBAC)                        │
│                     ┌─────────┬──────────┬─────────┐                       │
│                     │consumer │  seller  │  admin  │                       │
│                     └─────────┴──────────┴─────────┘                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Database Schema Design

### 1. User Roles System (CRITICAL - Security)

Following Supabase best practices, roles are stored in a **separate table**, not on profiles:

```sql
-- Role enum
CREATE TYPE public.app_role AS ENUM ('consumer', 'seller', 'admin');

-- User roles table (separate from profiles)
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at timestamptz DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;
```

### 2. Sellers Table (Extends User to Seller)

```sql
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
```

### 3. Products Table Enhancement

Add seller-specific fields and status tracking:

```sql
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
```

### 4. Product Variants Table (For Stock Tracking)

```sql
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
```

### 5. Orders Table

```sql
CREATE TABLE public.orders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number text UNIQUE NOT NULL,
    customer_id uuid REFERENCES auth.users(id) NOT NULL,
    seller_id uuid REFERENCES public.sellers(id) NOT NULL,
    
    -- Order status
    status text DEFAULT 'new' CHECK (status IN ('new', 'accepted', 'packed', 'shipped', 'delivered', 'cancelled')) NOT NULL,
    
    -- Totals
    subtotal integer NOT NULL,
    shipping_fee integer DEFAULT 0,
    discount integer DEFAULT 0,
    total integer NOT NULL,
    
    -- Shipping
    tracking_id text,
    shipping_carrier text,
    shipping_address jsonb NOT NULL,
    
    -- Timestamps
    created_at timestamptz DEFAULT now(),
    accepted_at timestamptz,
    packed_at timestamptz,
    shipped_at timestamptz,
    delivered_at timestamptz,
    cancelled_at timestamptz
);
```

### 6. Order Items Table

```sql
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
```

### 7. Payouts Table

```sql
CREATE TABLE public.payouts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id uuid REFERENCES public.sellers(id) NOT NULL,
    amount integer NOT NULL,
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')) NOT NULL,
    
    -- Reference to orders
    order_ids jsonb DEFAULT '[]'::jsonb,
    
    -- Settlement details
    settlement_cycle text,
    payout_date date,
    transaction_reference text,
    
    created_at timestamptz DEFAULT now(),
    processed_at timestamptz
);
```

### 8. Support Tickets Table

```sql
CREATE TABLE public.support_tickets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id uuid REFERENCES public.sellers(id) NOT NULL,
    subject text NOT NULL,
    description text NOT NULL,
    status text DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')) NOT NULL,
    
    -- Optional references
    order_id uuid REFERENCES public.orders(id),
    product_id uuid REFERENCES public.products(id),
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);
```

### 9. Categories Table (System-Defined)

```sql
CREATE TABLE public.categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL UNIQUE,
    slug text NOT NULL UNIQUE,
    parent_id uuid REFERENCES public.categories(id),
    sort_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now()
);

-- Pre-populate with fashion categories
INSERT INTO public.categories (name, slug) VALUES
  ('Sarees', 'sarees'),
  ('Lehengas', 'lehengas'),
  ('Kurta Sets', 'kurta-sets'),
  ('Dresses', 'dresses'),
  ('Blouses', 'blouses'),
  ('Dupattas', 'dupattas'),
  ('Indo-Western', 'indo-western'),
  ('Bridal Wear', 'bridal-wear');
```

---

## RLS Policies (Security)

### Sellers Table

```sql
-- Sellers can view/update only their own data
CREATE POLICY "Sellers can view own seller profile" 
ON public.sellers FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Sellers can update own seller profile" 
ON public.sellers FOR UPDATE 
USING (auth.uid() = user_id);
```

### Products (Seller-Owned)

```sql
-- Sellers can only manage their own products
CREATE POLICY "Sellers can manage own products" 
ON public.products 
FOR ALL 
USING (
  seller_id IN (SELECT id FROM public.sellers WHERE user_id = auth.uid())
);

-- Public can view only live products
CREATE POLICY "Anyone can view live products" 
ON public.products FOR SELECT 
USING (status = 'live' AND is_available = true);
```

### Orders (Seller Access)

```sql
CREATE POLICY "Sellers can view own orders" 
ON public.orders FOR SELECT 
USING (seller_id IN (SELECT id FROM public.sellers WHERE user_id = auth.uid()));

CREATE POLICY "Sellers can update own orders" 
ON public.orders FOR UPDATE 
USING (seller_id IN (SELECT id FROM public.sellers WHERE user_id = auth.uid()));
```

---

## File Structure

```text
src/
├── pages/
│   └── seller/
│       ├── SellerDashboard.tsx        # Overview page
│       ├── SellerProducts.tsx         # Product gallery
│       ├── SellerAddProduct.tsx       # Multi-step product form
│       ├── SellerEditProduct.tsx      # Edit existing product
│       ├── SellerInventory.tsx        # Stock management
│       ├── SellerOrders.tsx           # Order list
│       ├── SellerOrderDetail.tsx      # Single order view
│       ├── SellerPayouts.tsx          # Payout history
│       ├── SellerAnalytics.tsx        # Basic metrics
│       ├── SellerSupport.tsx          # Support tickets
│       ├── SellerSettings.tsx         # Profile & bank details
│       └── SellerOnboarding.tsx       # New seller setup
│
├── components/
│   └── seller/
│       ├── SellerLayout.tsx           # Sidebar + main content wrapper
│       ├── SellerSidebar.tsx          # Navigation sidebar
│       ├── SellerHeader.tsx           # Top header with user info
│       ├── DashboardStats.tsx         # Stats cards
│       ├── LowStockAlert.tsx          # Inventory warnings
│       ├── ProductForm/
│       │   ├── MediaUploadStep.tsx    # Step 1: Images
│       │   ├── ProductDetailsStep.tsx # Step 2: Details
│       │   ├── CategoryTagsStep.tsx   # Step 3: Categories
│       │   ├── PricingVariantsStep.tsx# Step 4: Pricing
│       │   ├── DispatchPoliciesStep.tsx# Step 5: Shipping
│       │   └── PreviewSubmitStep.tsx  # Step 6: Review
│       ├── ProductGalleryCard.tsx     # Product card in gallery
│       ├── ProductStatusBadge.tsx     # Status indicator
│       ├── OrderCard.tsx              # Order list item
│       ├── OrderTimeline.tsx          # Order status timeline
│       ├── PayoutCard.tsx             # Payout summary card
│       └── SupportTicketCard.tsx      # Ticket list item
│
├── contexts/
│   └── SellerContext.tsx              # Seller state & permissions
│
├── hooks/
│   └── seller/
│       ├── useSellerProfile.ts        # Fetch seller data
│       ├── useSellerProducts.ts       # Product CRUD
│       ├── useSellerOrders.ts         # Order management
│       ├── useSellerPayouts.ts        # Payout data
│       └── useSellerAnalytics.ts      # Metrics
│
└── types/
    └── seller.ts                      # Seller-specific types
```

---

## Routing Structure

```text
/seller                    → Seller Dashboard (overview)
/seller/products           → Product Gallery
/seller/products/add       → Add Product (multi-step)
/seller/products/:id/edit  → Edit Product
/seller/inventory          → Inventory Management
/seller/orders             → Order List
/seller/orders/:id         → Order Detail
/seller/payouts            → Payout History
/seller/analytics          → Basic Analytics
/seller/support            → Support Tickets
/seller/support/new        → Create Ticket
/seller/settings           → Profile & Settings
/seller/onboarding         → New Seller Setup

/join                      → Seller Application (existing, enhance)
```

---

## Component Specifications

### 1. Seller Layout

```text
┌─────────────────────────────────────────────────────────────────┐
│  ┌──────────┐  ┌─────────────────────────────────────────────┐  │
│  │          │  │  Header (Brand Name + User Menu)            │  │
│  │          │  └─────────────────────────────────────────────┘  │
│  │ Sidebar  │  ┌─────────────────────────────────────────────┐  │
│  │          │  │                                             │  │
│  │ Dashboard│  │                                             │  │
│  │ Products │  │              Main Content                   │  │
│  │ Inventory│  │                                             │  │
│  │ Orders   │  │                                             │  │
│  │ Payouts  │  │                                             │  │
│  │ Analytics│  │                                             │  │
│  │ Support  │  │                                             │  │
│  │ Settings │  │                                             │  │
│  │          │  └─────────────────────────────────────────────┘  │
│  └──────────┘                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### 2. Dashboard (Overview)

Stats cards showing:
- Total Products (count)
- Live Products (count)
- Today's Orders (count)
- Pending Orders (count)
- Revenue This Month (sum)
- Low Stock Alerts (list)

Constraints: Read-only, no charts, clickable cards link to detail pages.

### 3. Add Product (Multi-Step Form)

```text
Step 1: Media Upload
├── Drag-and-drop zone
├── Minimum 3 images required
├── Image reordering
└── Cover image selection

Step 2: Product Details
├── Product name (required)
├── Short description (required)
├── Detailed description
├── Fabric/material
└── Care instructions

Step 3: Category & Tags
├── Primary category (dropdown, required)
├── Occasion tags (multi-select)
└── Style tags (multi-select)

Step 4: Pricing & Variants
├── MRP (required)
├── Selling price (required)
├── Size variants (add/remove)
├── Color variants (add/remove)
└── Stock per variant

Step 5: Dispatch & Policies
├── Dispatch timeline (days)
├── Made-to-order toggle
└── Return eligibility

Step 6: Preview & Submit
├── Full product preview
└── Submit button → status = 'submitted'
```

### 4. Order Management

Order flow:
```text
new → accepted → packed → shipped → delivered
new → cancelled (before shipment only)
```

Seller actions:
- Accept Order (new → accepted)
- Mark Packed (accepted → packed)
- Mark Shipped + Add Tracking ID (packed → shipped)

Restrictions:
- Cannot edit price
- Cannot edit customer details
- Cannot cancel after shipment

---

## Protected Route Enhancement

Create a role-based route guard:

```typescript
// SellerProtectedRoute.tsx
export const SellerProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { isSeller, isSellerLoading } = useSeller();
  
  if (isLoading || isSellerLoading) return <Loading />;
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!isSeller) return <Navigate to="/join" />;  // Redirect to application
  
  return <SellerLayout>{children}</SellerLayout>;
};
```

---

## Implementation Phases

### Phase 1: Foundation (Database + Auth)
1. Create database migrations for all new tables
2. Set up RLS policies
3. Create role-checking functions
4. Add SellerContext and useSeller hook
5. Create SellerProtectedRoute component

### Phase 2: Core Layout & Navigation
1. Create SellerLayout component
2. Create SellerSidebar with navigation
3. Create SellerHeader
4. Set up routing in App.tsx

### Phase 3: Dashboard
1. Create SellerDashboard page
2. Create DashboardStats component
3. Create LowStockAlert component

### Phase 4: Product Management
1. Create SellerProducts (gallery view)
2. Create ProductGalleryCard
3. Create multi-step Add Product form
4. Create Edit Product flow
5. Implement draft auto-save

### Phase 5: Inventory
1. Create SellerInventory page
2. Variant-level stock management
3. Out-of-stock automation

### Phase 6: Orders
1. Create SellerOrders list
2. Create SellerOrderDetail page
3. Implement order state transitions
4. Add tracking ID functionality

### Phase 7: Payouts & Analytics
1. Create SellerPayouts (read-only)
2. Create SellerAnalytics with basic metrics

### Phase 8: Support & Settings
1. Create SellerSupport ticket system
2. Create SellerSettings (profile, bank details)

### Phase 9: Seller Onboarding
1. Enhance /join page with application form
2. Create SellerOnboarding for post-approval setup

---

## Technical Constraints

| Constraint | Implementation |
|------------|----------------|
| Page load < 3 seconds | Lazy loading, optimistic updates |
| API response < 500ms | Index key columns, efficient queries |
| Max 20 products per page | Cursor-based pagination |
| Image upload retry | Exponential backoff in upload logic |
| Draft auto-save | Debounced save on input change |
| State transitions server-side | Database functions for validation |
| No real-time dashboards | Pre-aggregated daily data |

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/types/seller.ts` | TypeScript interfaces |
| `src/contexts/SellerContext.tsx` | Seller state management |
| `src/hooks/seller/*.ts` | Data fetching hooks |
| `src/components/seller/*.tsx` | UI components |
| `src/pages/seller/*.tsx` | Page components |
| `supabase/migrations/*.sql` | Database schema |

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/App.tsx` | Add seller routes with SellerProtectedRoute |
| `src/types/index.ts` | Add seller-related interfaces |
| `src/pages/JoinUs.tsx` | Add seller application form |
| `src/components/auth/UserMenu.tsx` | Add "Seller Dashboard" link for sellers |

---

## Security Checklist

1. Roles stored in separate `user_roles` table (not on profiles)
2. RLS policies use security definer functions
3. Sellers can only access their own data
4. State transitions validated server-side
5. Sensitive data (bank details) encrypted
6. Rate limiting on image uploads
7. No hardcoded admin checks in frontend

---

## MVP Completion Criteria

The seller portal MVP is complete when:

- [ ] Seller can apply to join via /join
- [ ] Seller can log in and access /seller dashboard
- [ ] Seller can add a product with all 6 steps
- [ ] Product goes through review workflow (draft → submitted → under_review → live)
- [ ] Seller can view and manage inventory at variant level
- [ ] Seller can view orders and update status
- [ ] Seller can see payout visibility (read-only)
- [ ] All pages load in < 3 seconds
- [ ] Mobile-responsive sidebar navigation

