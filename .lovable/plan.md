

# Database & Asset Visibility Analysis Report

## Executive Summary

After conducting a comprehensive technical audit of the Ogura fashion platform, I have identified **critical issues** causing assets and products to not appear across various pages. The root causes are a combination of **database configuration problems**, **dual data source architecture**, and **RLS policy restrictions**.

---

## Critical Finding #1: ALL Database Products Have status = 'draft'

**Impact: SEVERE - No database products visible to public users**

```text
Database Query Result:
┌─────────────────┬─────────────┐
│ status          │ total_count │
├─────────────────┼─────────────┤
│ draft           │     34      │
│ live            │      0      │
└─────────────────┴─────────────┘
```

The RLS policy on the `products` table only allows viewing products where `status = 'live' AND is_available = true`:

```sql
-- Current RLS Policy (blocking all products)
Policy: "Anyone can view live products"
USING: ((status = 'live'::text) AND (is_available = true))
```

**Result**: All 34 database products are invisible to non-seller users because none have `status = 'live'`.

---

## Critical Finding #2: Dual Data Source Architecture

The application uses **two completely separate data sources** that are NOT synchronized:

```text
┌─────────────────────────────────────────────────────────────────────┐
│                     DUAL DATA SOURCE MAP                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────┐      ┌──────────────────────┐            │
│  │   STATIC DATA        │      │   DATABASE (Supabase) │            │
│  │   (src/data/*.ts)    │      │   (products table)    │            │
│  ├──────────────────────┤      ├──────────────────────┤            │
│  │ • 691 products       │      │ • 34 products         │            │
│  │ • 7 brands           │      │ • 9 designers         │            │
│  │ • Static occasions   │      │ • 3 vendors           │            │
│  │ • Unsplash images    │      │ • All status='draft'  │            │
│  └──────────────────────┘      └──────────────────────┘            │
│           │                             │                           │
│           ▼                             ▼                           │
│  ┌──────────────────────┐      ┌──────────────────────┐            │
│  │ PAGES USING STATIC   │      │ PAGES USING DATABASE │            │
│  ├──────────────────────┤      ├──────────────────────┤            │
│  │ • /collections       │      │ • /designers         │            │
│  │ • /product/:id       │      │ • /designer/:slug    │            │
│  │ • /brands            │      │ • /designers/:id     │            │
│  │ • /brands/:brandId   │      │ • Designer Products  │            │
│  │ • Home carousels     │      │                      │            │
│  │ • Category pages     │      │                      │            │
│  │ • /search (Algolia)  │      │                      │            │
│  └──────────────────────┘      └──────────────────────┘            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Navigational Flow Analysis

### Pages Using STATIC Data (Working)

| Route | Data Source | Status |
|-------|-------------|--------|
| `/` (Homepage) | Static products + DB designers | Partial - designers load, carousels work |
| `/collections` | `src/data/products.ts` (691 items) | Working |
| `/product/:id` | `src/data/products.ts` | Working |
| `/brands` | `src/data/brands.ts` (7 brands) | Working |
| `/brands/:brandId` | Static brands + static products filtered by brand name | Working (but limited products) |
| `/search` | Algolia index | Working (if synced) |

### Pages Using DATABASE (Issues)

| Route | Data Source | Status |
|-------|-------------|--------|
| `/designers` | `designers` table (9 records) | Working - designers visible |
| `/designer/:slug` | `designers` + `products` table | Broken - products don't appear (all draft) |
| `/designers/:id` | `designers` + `products` table | Broken - products don't appear |

---

## Asset Analysis by Page

### Homepage (`/`)

```text
Component                  │ Data Source            │ Assets Status
───────────────────────────┼────────────────────────┼──────────────────
LuxuryHero                 │ Cloudinary video URL   │ ✅ Working
Premium3DCategorySection   │ Hardcoded images       │ ✅ Working
CategoryShowcase           │ Unsplash URLs          │ ✅ Working
DesignersSpotlight         │ DB: designers table    │ ✅ Working (9 designers)
LuxuryBrands               │ Hardcoded brand logos  │ ✅ Working
LuxuryTrustBadges          │ Icons only             │ ✅ Working
```

### Brands Page (`/brands`)

```text
STATIC BRANDS (src/data/brands.ts):
┌──────────┬─────────────────────────────────────────────────────────┬───────────────┐
│ Brand    │ Logo Image                                              │ Status        │
├──────────┼─────────────────────────────────────────────────────────┼───────────────┤
│ INDIGO   │ /indigo/product-1.jpg                                   │ ✅ Local file │
│ OGURA    │ https://images.unsplash.com/...                         │ ✅ Unsplash   │
│ ELEGANCE │ https://images.unsplash.com/...                         │ ✅ Unsplash   │
│ URBAN    │ https://images.unsplash.com/...                         │ ✅ Unsplash   │
│ CLASSIC  │ https://images.unsplash.com/...                         │ ✅ Unsplash   │
│ LUXE     │ https://images.unsplash.com/...                         │ ✅ Unsplash   │
│ BREEZE   │ https://images.unsplash.com/...                         │ ✅ Unsplash   │
└──────────┴─────────────────────────────────────────────────────────┴───────────────┘

Local Assets Verified:
• public/indigo/ - 5 product images (product-1.jpg to product-5.jpg) ✅
• public/roshi/  - 10 product images (product-1.jpg to product-10.jpg) ✅
```

### Brand Detail (`/brands/:brandId`)

```text
ISSUE: Product Count Mismatch

The brand detail page filters static products by brand name:
  brandProducts = products.filter(p => p.brand.toLowerCase() === brand.name.toLowerCase())

Static products have brands: OGURA, ELEGANCE, LUXE, URBAN, CLASSIC, BREEZE, DENIM CO, etc.
Static brands file has: INDIGO, OGURA, ELEGANCE, URBAN, CLASSIC, LUXE, BREEZE

Result:
• INDIGO brand page shows 0 products (no static products have brand="INDIGO")
• OGURA brand page shows 45+ products (matching brand name)
• etc.
```

### Designers Page (`/designers`)

```text
DATABASE DESIGNERS (9 records):
┌─────────────────────┬───────────────────────────────┬────────────────────────────────────┐
│ Designer            │ Profile Image                 │ Status                             │
├─────────────────────┼───────────────────────────────┼────────────────────────────────────┤
│ Rajiramniq          │ Unsplash URL                  │ ✅ Working                         │
│ Punit Balana        │ Unsplash URL                  │ ✅ Working                         │
│ Gauri & Nainika     │ Unsplash URL                  │ ✅ Working                         │
│ Aseem Kapoor        │ Unsplash URL                  │ ✅ Working                         │
│ KA-Sha              │ Unsplash URL                  │ ✅ Working                         │
│ Anita Dongre        │ Unsplash URL                  │ ✅ Working                         │
│ Tarun Tahiliani     │ Unsplash URL                  │ ✅ Working                         │
│ Anamika Khanna      │ Unsplash URL                  │ ✅ Working                         │
│ Roshi               │ /roshi/product-1.jpg          │ ✅ Local file exists               │
└─────────────────────┴───────────────────────────────┴────────────────────────────────────┘
```

### Designer Profile (`/designer/:slug`)

```text
CRITICAL ISSUE: Products Not Visible

The page fetches products from database:
  useDesignerProducts(designer?.id, filters, page)

Database products (34 total):
• All have status = 'draft'
• RLS policy blocks: "Anyone can view live products" requires status='live'
• Result: 0 products shown on any designer profile page

Products ARE in database but invisible due to RLS:
• Rajiramniq: 12 products (all draft)
• Punit Balana: 8 products (all draft)
• etc.
```

---

## Menu Navigation Assets

```text
MEGA MENU IMAGE REFERENCES:
┌────────────────────┬─────────────────────┬───────────────┐
│ Menu Item          │ Image Path          │ File Exists   │
├────────────────────┼─────────────────────┼───────────────┤
│ Bollywood Fashion  │ Pexels video URL    │ ✅ External   │
│ Co-ord Sets        │ /roshi/product-1.jpg│ ✅ Yes        │
│ Occasion Wear      │ /roshi/product-2.jpg│ ✅ Yes        │
│ Street & Casual    │ /roshi/product-3.jpg│ ✅ Yes        │
│ Limited Drops      │ /roshi/product-4.jpg│ ✅ Yes        │
│ Made-to-Order      │ /roshi/product-5.jpg│ ✅ Yes        │
│ Footwear Edit      │ /roshi/product-6.jpg│ ✅ Yes        │
│ Bags & Accessories │ /roshi/product-7.jpg│ ✅ Yes        │
│ Men Ethnic Wear    │ /indigo/product-1.jpg│ ✅ Yes       │
│ Men Formal Wear    │ /indigo/product-2.jpg│ ✅ Yes       │
│ Men Casual Wear    │ /indigo/product-3.jpg│ ✅ Yes       │
│ Men Activewear     │ /indigo/product-4.jpg│ ✅ Yes       │
│ Men Footwear       │ /indigo/product-5.jpg│ ✅ Yes       │
│ Men Accessories    │ /roshi/product-8.jpg│ ✅ Yes        │
└────────────────────┴─────────────────────┴───────────────┘
```

---

## Root Cause Summary

| Issue | Severity | Impact |
|-------|----------|--------|
| All DB products have `status='draft'` | Critical | Designer profile pages show 0 products |
| RLS blocks non-live products | Critical | Public users can't see any DB products |
| Static vs DB data not synchronized | High | Inconsistent product availability across pages |
| Brand-product name mismatch | Medium | Some brand detail pages show 0 products |
| Algolia may not have latest data | Medium | Search results may be incomplete |

---

## Recommended Fixes

### Immediate (Fix Product Visibility)

1. **Update product status to 'live'** for all approved products:
```sql
UPDATE products 
SET status = 'live' 
WHERE is_available = true;
```

2. **Add seller/admin workflow** to manage product approval status

### Short-term (Data Consistency)

1. **Synchronize static brands with database** - Either migrate static brands to database OR ensure static product brand names match static brand definitions

2. **Run Algolia sync** to ensure search index has latest products

### Long-term (Architecture)

1. **Migrate all static data to database** for single source of truth
2. **Implement proper product lifecycle** (draft -> pending_review -> live -> archived)
3. **Add admin dashboard** for product/status management

---

## Technical Implementation Notes

The fixes require:
- Database migration to update product statuses
- Optional: Modify RLS policies to allow viewing products in additional states
- Synchronize brand names between static and database sources
- Re-run Algolia sync after product status updates

