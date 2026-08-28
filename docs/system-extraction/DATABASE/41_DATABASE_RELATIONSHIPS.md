# 41 — Database Relationship Graph

## ASCII ER overview
```text
auth.users (managed)
  ├─1:1─ profiles(id)
  ├─1:1─ sellers(user_id)
  ├─1:N─ user_roles(user_id)
  ├─1:N─ orders(customer_id)
  └─1:N─ tryon_history(user_id, nullable, no FK cascade)

categories(parent_id) ──self-FK──> categories(id)          [tree]
categories(id) <──(category_id, optional)── products

designers(id) <──CASCADE── products(designer_id)
vendors(id)   <──CASCADE── products(vendor_id)
sellers(id)   <──(no cascade)── products(seller_id)
   [products.CHECK product_must_have_owner: designer_id OR vendor_id OR seller_id NOT NULL]

sellers(id) ──CASCADE──> discounts(seller_id)
sellers(id) ────────────> orders(seller_id)
sellers(id) ────────────> payouts(seller_id)
sellers(id) ────────────> support_tickets(seller_id)

products(id) ──CASCADE──> product_variants(product_id)
products(id) ────────────> order_items(product_id)
products(id) ────────────> support_tickets(product_id, nullable)

orders(id) ──CASCADE──> order_items(order_id)
orders(id) ────────────> support_tickets(order_id, nullable)
product_variants(id) ──> order_items(variant_id, nullable)

[UNDECLARED / implicit relationships — not enforced by FK]
products.category (text)        ~~~ categories.slug|name   (string match, not FK)
products.images (jsonb[])       ~~~ storage.objects (product-images bucket URLs)
products.colors/sizes (jsonb)   ~~~ product_variants (color_name/size) — parallel/duplicate data models
products.occasion_tags/style_tags (jsonb) ~~~ free-form tag strings, no taxonomy table
orders.shipping_address (jsonb) ~~~ user_addresses (no FK; snapshot copy, may diverge)
payouts.order_ids (jsonb array) ~~~ orders.id (array of UUIDs, no FK enforcement)
designers.product_images / profile_image / banner_image ~~~ external/unsplash + storage URLs (not scoped to any bucket)
influencer_videos.video_filename ~~~ storage 'influencer-videos' bucket object name
tryon_history.model_image_url / result_image_url ~~~ storage 'tryon-images' bucket object name
seller_applications.sample_images (jsonb) ~~~ storage 'product-images' bucket (per SellerApply.tsx upload path)
sellers <-> seller_applications: NO FK/link at all. Approval is a manual, disconnected admin action
  creating a new `sellers` row; the two tables never reference each other.
razorpay-create-order / razorpay-verify-payment edge functions <-> Razorpay external API "order" objects,
  referenced only by orders.tracking_id/shipping_carrier style free fields (no dedicated payment table found — [MISSING] payments/transactions table)
```

## Explicit FK inventory (`table.column -> table.column`)

| FK | Cardinality | ON DELETE | Notes |
|---|---|---|---|
| categories.parent_id -> categories.id | 1(parent)–N(children) | NO ACTION | self-referencing tree |
| products.category_id -> categories.id | N–1 | NO ACTION | optional, parallel to products.category text |
| products.designer_id -> designers.id | N–1 | CASCADE | deleting a designer deletes all their products |
| products.vendor_id -> vendors.id | N–1 | CASCADE | deleting a vendor deletes all their products |
| products.seller_id -> sellers.id | N–1 | NO ACTION | deleting a seller blocked while products exist (or leaves FK violation risk) |
| product_variants.product_id -> products.id | N–1 | CASCADE | |
| order_items.order_id -> orders.id | N–1 | CASCADE | |
| order_items.product_id -> products.id | N–1 | NO ACTION | |
| order_items.variant_id -> product_variants.id | N–1 (nullable) | NO ACTION | |
| orders.seller_id -> sellers.id | N–1 | NO ACTION | |
| orders.customer_id -> auth.users.id | N–1 | NO ACTION | |
| discounts.seller_id -> sellers.id | N–1 | CASCADE | |
| payouts.seller_id -> sellers.id | N–1 | NO ACTION | |
| support_tickets.seller_id -> sellers.id | N–1 | NO ACTION | |
| support_tickets.order_id -> orders.id | N–1 (nullable) | NO ACTION | |
| support_tickets.product_id -> products.id | N–1 (nullable) | NO ACTION | |
| profiles.id -> auth.users.id | 1–1 | CASCADE | |
| sellers.user_id -> auth.users.id | 1–1 | CASCADE | unique(user_id) |
| user_roles.user_id -> auth.users.id | N–1 (unique per role) | CASCADE | |
| tryon_history.user_id -> auth.users.id | N–1 (nullable) | NO ACTION | |
| orders.customer_id, sellers.user_id, order_items.* etc | — | — | see table above |

`user_addresses.user_id` has **no declared FK** to `auth.users` — relationship is implicit/app-enforced only [OBSERVED gap].

## Orphan-risk relationships

1. **products with multiple owners simultaneously** — the CHECK constraint `product_must_have_owner` only requires *at least one* of `designer_id`/`vendor_id`/`seller_id`; nothing prevents a product having all three set, which every RLS policy and every frontend query must then correctly disambiguate (which owner "wins" for display/permissions is app logic, not DB-enforced). **[SECURITY-SENSITIVE / data-integrity]**: a product with both `seller_id=A` and `designer_id=B` set would pass `Sellers can update own products` for seller A even if conceptually it should be a curated/admin-only designer product.
2. **products.seller_id has no ON DELETE behavior** — deleting a `sellers` row while products reference it will raise a FK violation (blocks seller deletion) unless application deletes/reassigns products first. No CASCADE, no SET NULL.
3. **order_items.product_id / variant_id have NO ACTION** — a product or variant can never be deleted once ordered (protects order history, but also means soft-delete/status flags are the only viable removal path — consistent with `products.status='disabled'`).
4. **orders.shipping_address is a jsonb snapshot, not linked to `user_addresses`** — if a user edits/deletes their address book entry, historical orders are unaffected (good for audit) but there is no way to trace an order back to a specific saved address row.
5. **payouts.order_ids (jsonb array) is unenforced** — IDs referenced there could point to non-existent or already-modified orders; no trigger validates membership, no join possible without app-side parsing.
6. **tryon_history.user_id nullable with no ON DELETE** — rows with NULL user_id are RLS-orphaned (inaccessible to any authenticated user); rows with non-null user_id are not cleaned up if the user is later deleted from auth.users (no CASCADE declared, unlike profiles/sellers/user_roles).
7. **seller_applications ↔ sellers disconnection** — no FK/shared key; an "approved" application and its corresponding `sellers` row are two independent objects correlated only by matching name/email/phone in admin's head — **[SECURITY-SENSITIVE / process-integrity]** duplicate or inconsistent seller records are possible.
8. **user_addresses.user_id unconstrained** — could reference a non-existent user id with no DB-level rejection (though RLS `auth.uid()=user_id` limits practical exploitation to the acting user's own id).
