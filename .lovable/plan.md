

# Shopify-Style Seller Dashboard on Join Us Page

## Overview

Transform the `/join` page to keep the hero section at the top and render a full Shopify-style functional seller dashboard below it. The dashboard will use sidebar navigation with tabbed content areas, all within a single page component structure. When authenticated with a seller role, it shows real data; otherwise it shows the dashboard UI with empty/sample states.

## Architecture

The dashboard will be built as a self-contained section below the hero, using React state for internal navigation (not React Router) since this lives within the existing `/join` route.

```text
┌──────────────────────────────────────────┐
│           HERO SECTION (existing)        │
├──────────────────────────────────────────┤
│ ┌──────────┬─────────────────────────────┤
│ │          │  TOP HEADER BAR             │
│ │  LEFT    ├─────────────────────────────┤
│ │ SIDEBAR  │                             │
│ │          │   MAIN CONTENT AREA         │
│ │  - Home  │   (switches based on        │
│ │  - Orders│    sidebar selection)        │
│ │  - Prods │                             │
│ │  - Custs │                             │
│ │  - etc.  │                             │
│ └──────────┴─────────────────────────────┘
```

## New Files

### 1. `src/components/seller-dashboard/SellerDashboardShowcase.tsx`
Main wrapper. Renders sidebar + header + content. Uses `useState` for active page. Shopify-style light grey sidebar (`bg-[#F6F6F7]`), white content area.

### 2. `src/components/seller-dashboard/DashboardSidebar.tsx`
Shopify-style sidebar with collapsible menu groups:
- Home, Orders, Products (with sub-items: Collections, Inventory, Purchase orders, Transfers, Gift cards), Customers, Marketing, Discounts, Content, Markets, Analytics, Settings
- Icons from lucide-react, active state highlighting, collapsible sub-menus

### 3. `src/components/seller-dashboard/DashboardHeader.tsx`
Top bar with search input, notification bell, profile avatar, and store name.

### 4. `src/components/seller-dashboard/pages/DashboardHome.tsx`
KPI cards (Total Sales, Orders, Products, Pending Orders) + mini charts using recharts + recent orders table with sample data.

### 5. `src/components/seller-dashboard/pages/DashboardProducts.tsx`
Product table with columns (Image, Name, Status, Inventory, Category, Sales Channels). Top actions: Add Product, Import, Export.

### 6. `src/components/seller-dashboard/pages/DashboardAddProduct.tsx`
Shopify-style add product form: Title, Description (textarea), Media upload zone, Product Organization (Category, Vendor, Collections, Tags), Inventory (SKU, Barcode, Quantity, Track toggle), Shipping (Physical product toggle, Weight, Dimensions, Country, HS Code), Variants (Size/Color/Material options), SEO (Title, Meta, URL Handle).

### 7. `src/components/seller-dashboard/pages/DashboardOrders.tsx`
Orders table: Order ID, Customer, Product, Price, Status badges.

### 8. `src/components/seller-dashboard/pages/DashboardCustomers.tsx`
Customers table: Name, Email, Orders count, Total Spent.

### 9. `src/components/seller-dashboard/pages/DashboardCollections.tsx`
Collections list with Manual/Smart collection types. Create collection button.

### 10. `src/components/seller-dashboard/pages/DashboardInventory.tsx`
Inventory table: Product, SKU, Unavailable, Committed, Available, On Hand. Editable quantities.

### 11. `src/components/seller-dashboard/pages/DashboardDiscounts.tsx`
Discount types: Amount off products, Buy X Get Y, Amount off order, Free shipping. Code generation.

### 12. `src/components/seller-dashboard/pages/DashboardAnalytics.tsx`
Charts: Revenue, Orders, Conversion rate, Best selling products using recharts.

### 13. `src/components/seller-dashboard/pages/DashboardGiftCards.tsx`
Gift cards list + create buttons.

### 14. `src/components/seller-dashboard/pages/DashboardTransfers.tsx`
Transfers list + create transfer button.

### 15. `src/components/seller-dashboard/pages/DashboardMarketing.tsx`
Marketing campaigns overview.

### 16. `src/components/seller-dashboard/pages/DashboardContent.tsx`
Content management placeholder.

### 17. `src/components/seller-dashboard/pages/DashboardMarkets.tsx`
Markets management placeholder.

### 18. `src/components/seller-dashboard/pages/DashboardSettings.tsx`
Store settings form.

## Modified Files

### `src/pages/JoinUs.tsx`
- Keep hero section (lines 44-83)
- Remove everything below the hero (video, timeline, journey cards, value props, final CTA, footer)
- Import and render `<SellerDashboardShowcase />` below the hero
- Remove LuxuryHeader and LuxuryFooter since the dashboard is the main content

## Design System
- Sidebar: `bg-[#F6F6F7]` with `#202223` text, Shopify green `#008060` for active states
- Cards: white bg, `rounded-lg`, subtle `border` and `shadow-sm`
- Header: white bg, bottom border, search with `bg-gray-100 rounded-lg`
- Typography: system font stack, `text-sm` for most UI
- Status badges: green (active/fulfilled), yellow (pending), red (unfulfilled)
- Tables: clean borders, hover rows

## Data Approach
- When user is authenticated with seller role: fetch real products, orders from database
- Otherwise: display sample/mock data to showcase the dashboard capability
- All database queries use existing tables (products, orders, sellers)

