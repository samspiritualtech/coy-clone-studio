

# Seller Registration / Application Page

## Overview
Create a new `/join/apply` page with a premium seller application form. Store submissions in a new `seller_applications` database table and upload sample designs to the existing `product-images` storage bucket. Wire up the "Apply to Join Ogura" buttons on the existing `/join` page to link here.

## Database Migration
Create a `seller_applications` table:
- `id` (uuid, PK)
- `full_name` (text, required)
- `brand_name` (text, required)
- `email` (text, required)
- `phone` (text, required)
- `city` (text, required)
- `category` (text, required) -- Fashion Designer / Boutique / Custom Tailor
- `portfolio_link` (text, nullable)
- `sample_images` (jsonb, nullable) -- array of uploaded image URLs
- `status` (text, default 'pending') -- pending / approved / rejected
- `created_at` (timestamptz, default now)

RLS: allow public inserts (no auth required for applications), restrict reads to admin role only.

## New Page: `src/pages/SellerApply.tsx`
- Minimal black-and-white premium layout with `LuxuryHeader` and `LuxuryFooter`
- Clean form using existing UI components (Input, Textarea, Select, Label, Card)
- Fields: Full Name, Brand/Studio Name, Email, Phone, City/Location, Category (Select dropdown), Portfolio/Instagram Link, Upload Sample Designs (reuse `ImageUploadZone`)
- "Submit Application" button
- On submit: upload images to `product-images` bucket under `applications/` prefix, then insert row into `seller_applications`
- Success state: show confirmation message "Your application has been submitted. Our team will review it soon."
- Client-side validation with zod

## Routing
- Add `/join/apply` route in `CustomerApp.tsx`
- Update both "Apply to Join Ogura" buttons in `JoinUs.tsx` to link to `/join/apply`

## Files Changed
1. **Database migration** -- create `seller_applications` table with RLS
2. **`src/pages/SellerApply.tsx`** -- new registration form page
3. **`src/apps/CustomerApp.tsx`** -- add route
4. **`src/pages/JoinUs.tsx`** -- wire CTA buttons to `/join/apply`

