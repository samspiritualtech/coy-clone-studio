# OGURA synthetic multi-seller catalogue seed — Plan Mode report

Nothing has been changed. Evidence below is read from the live project.

## 0. Conflicts found (need your decision)

1. **Brand pages do not use your database.** `src/lib/brandStores.ts` builds `/brands`, `/store/:slug`, `/brand/:slug` from an external Seller Center API (`https://pyesltzkemtranachpne.supabase.co/functions/v1/products`). Seeded brands will NOT appear there until this file reads live products/sellers. Fix: switch it to the live products+sellers query (data source only, same shapes, no new routes).
2. **Store records are not publicly readable.** `sellers` policies today: admin-manage, own-view, own-update, own-insert. No public read. Customer brand pages need one policy allowing anyone to read `approved` + `is_active` stores (brand name, city, description, images only).
3. **No admin exists.** `user_roles` is empty, so there is no admin JWT to authorise the importer and no one can run the publish step. Fix: grant the `admin` role to one existing owner account you name (e.g. `lovable9057@gmail.com`) through the existing `user_roles` path.
4. **Taxonomy mismatch.** Only 8 active `categories` rows (Sarees, Lehengas, Dresses, Blouses, Dupattas, Kurta Sets, Indo-Western, Bridal Wear). The workbook's 40 folder categories mostly do not match, so `category_id` stays null for those and `products.category` carries the workbook label (e.g. `Wrap Tops`), exactly as the file requires. No taxonomy rows created.
5. **Variant volume.** 7 sizes x 12 colours x 311 products = 26,124 `product_variants` rows. Confirm you want the full grid (see §3/§4).
6. **Shared password.** `123456789` for all 40 accounts contradicts the file's rule; it is used only because you asked. Handling in §18.

## 1. Workbook → database mapping (SEED_PRODUCTS → public.products)

`product_db_id`→id, `seller_id`→seller_id, `title`→title, `description`→description, `short_description`→short_description, `category`→category (verbatim), `price`→price, `original_price`→original_price, `colors_json`→colors, `sizes_json`→sizes, `occasion_tags_json`→occasion_tags, `style_tags_json`→style_tags, `material`→material, `fabric`→fabric, `care_instructions`→care_instructions, `is_available`→is_available, `is_made_to_order`→is_made_to_order, `is_returnable`→is_returnable, `dispatch_days`→dispatch_days (21), `import_status`→status (`submitted`), uploaded public URLs in `image_order`→images. `designer_id`/`vendor_id` null. `brand` set to the workbook brand name. `source_product_id`/`seller_sku` are report-only (no such columns; `seller_sku` is kept on the variant `sku` field).

SEED_SELLERS → public.sellers: `seller_id`→id, auth user→user_id, `brand_name`→brand_name, `city`→city, `seller_type`→`independent_designer` (constraint-checked), `brand_description`→description, `approved`/`true`/`true`→application_status/is_verified/is_active. No PAN, GST, bank, Instagram or founder data.

## 2. Existing tables used (no new product/seller system)

auth users: Supabase `auth.users` via server-side Admin API only. Stores: `public.sellers`. Products: `public.products`. Images: `product-images` storage bucket + `products.images` array. Variants/stock: `public.product_variants` (`stock_quantity`). Taxonomy: `public.categories` (read/match only). Roles: `public.user_roles` + `has_role()`. Audit: one new small table `public.seed_import_runs` (run id, batch key, actor, counts, timestamp) — the only new table; say the word and I log to the report only instead.

## 3. Variants

For each product, the full grid from the workbook: sizes `XS,S,M,L,XL,XXL,Free Size` x the 12 colours (`Black,White,Red,Blue,Green,Pink,Yellow,Beige,Grey,Brown,Maroon,Navy`), upserted on the existing unique key `(product_id, size, color_name)` so re-runs never duplicate. `sku` = `<seller_sku>-<SIZE>-<COLOUR>`, `price_override` null (product price applies).

## 4. Initial stock

Workbook `inventory_quantity` is seed stock for the product. It is spread evenly across that product's variants, minimum 1 each, so every purchasable variant is in stock and the product total stays close to the workbook figure. Alternative if you prefer: flat 10 per variant.

## 5. Free Size vs conventional sizes

Every seeded product carries all 7 values as the workbook explicitly requires, so `Free Size` and XS–XXL both exist for all categories. No per-category size filtering is invented. Bags/accessories therefore also show `Free Size` alongside the standard run.

## 6. Statuses and the approved transition

`products.status` allows `draft, submitted, under_review, live, rejected, disabled`; `sellers.application_status` allows `pending, approved, rejected`. Import inserts `submitted`. A separate admin-authorised step (admin JWT, `has_role(auth.uid(),'admin')`, existing "Admins can manage all products" policy) moves only this batch to `live`. No seller self-approval, no new state.

## 7. Universal visibility conditions per product

`status='live'`, `is_available=true`, non-empty ordered `images`, non-null `seller_id` pointing at an `approved`+`is_active` store, non-empty `category`, price > 0, sizes and colours populated. These match the existing public read policy `status='live' AND is_available=true`.

## 8. Current RLS enforcing seller isolation (verified)

products: sellers can select/insert/update/delete only where `seller_id IN (select id from sellers where user_id = auth.uid())`; anyone may read live+available; admins manage all. product_variants: sellers manage only variants of their own products; public may read variants of live products. orders: sellers see/update only orders whose `seller_id` is theirs; customers only their own. sellers: own row only (plus admin). profiles: own row only. So one seller cannot reach another's products, variants, orders or store row.

## 9. Isolation test I will run

Sign in as Sanskruti, then from the client: read Seller B's product by UUID (expect 0 rows), update it (expect 0 rows/denied), read Seller B's `sellers` row (expect 0 rows), read Seller B's orders (expect 0 rows). Also confirm `/seller/products` returns only that seller's own folder category. Result reported with evidence; if any check fails I stop.

## 10. Images

Bucket `product-images` (public read; writes by service role during import). Object path = workbook `target_storage_path` verbatim, e.g. `seed/ogura-catalog-seed-v1/naayra/OG-W-BG-000001/01-....png`. Order comes from `image_order`; `is_primary`/`PRIMARY` becomes index 0 of `products.images`, which is what cards and the gallery use. Upload with upsert so re-runs overwrite the same object. Source bytes fetched from the workbook `source_url` (verified: full-resolution downloads, e.g. 748x997), not Drive view links written into the database.

## 11. Image grouping and order

Yes — all 438 rows keep their workbook `product_db_id` grouping and `image_order`; no regrouping or reclassification. The importer reports per-product image counts and fails loudly on any product that ends with zero images.

## 12. Files, functions, migrations that change

- New edge function `supabase/functions/seed-catalog-import/index.ts` (admin-JWT verified; dry_run/execute; batched).
- Migration 1: public read policy for approved+active `sellers`; grant `admin` role to the owner account you name; create `public.seed_import_runs` with grants + RLS (admin only).
- `src/lib/brandStores.ts`: data source switched from the external API to live products+sellers (conflict 1). No route, layout or component redesign.
- Frontend `DEV_SELLER_ID` fallbacks (`SellerProducts.tsx`, `SellerDashboardHome.tsx`, `DashboardProducts/AddProduct/Settings/Discounts.tsx`) removed and replaced with a pending/access-denied state, and `SellerAuthRoute` tightened to require a matching approved+active store — required by §9 of your file so seeded sellers can't see another seller's data.
- Everything else: none. No new routes, no payment/order changes, no schema columns on products, no hardcoded brand or product arrays.

## 13. Importer authentication and authorisation

The function requires an `Authorization: Bearer <user JWT>`, resolves the user server-side, and proceeds only if `has_role(user, 'admin')` is true. No shared-secret-only access, no `verify_jwt=false` bypass, no unauthenticated page can call it. Non-admin callers get 403. (This is why conflict 3 must be resolved first.)

## 14. Service-role credential

Used only inside the edge function from its server environment, after the admin check, for Admin API user creation, storage upload and privileged upserts. It is never in frontend code, never returned in a response, never logged, and never committed.

## 15. Idempotency keys / conflict targets

auth users: `account_email` lookup, create-or-reuse. sellers: `on conflict (id)` using the workbook `seller_id`. products: `on conflict (id)` using `product_db_id`. variants: `on conflict (product_id, size, color_name)`. storage: fixed `target_storage_path` with upsert. Re-running produces zero duplicates.

## 16. Rollback

A single reverse script scoped to this batch only: delete `product_variants` of the 311 workbook product IDs, delete those 311 products by ID, delete storage objects under `product-images/seed/ogura-catalog-seed-v1/`, delete the 40 seller rows by workbook `seller_id`, and disable/delete only the 40 `seed-*@ogura.in` auth users. Nothing outside these deterministic IDs is touched; existing 136 products and 2 sellers are untouched.

## 17. Audit and reconciliation

Every run writes an audit row (actor, mode, counts, failures) and returns a private report: 40 seller results (created vs reused auth users, created vs updated stores), 311 product results (created/updated/skipped/error), 438 image results (uploaded vs reused), category matches and unmatched labels, per-seller product counts checked against CATEGORY_BRAND_MAP, and rollback identifiers. Workbook pre-checks already reconcile: 40 sellers, 40 unique slugs, 311 products, 311 unique IDs, 438 images, 40 categories, all prices 10,000–15,000, all dispatch_days 21.

## 18. Confirmations and the password risk

No second seller/product system, no demo/sample tables, no frontend brand or product arrays, no new routes, no approval bypass, no RLS weakening.

Password `123456789` is applied only through the server-side Admin API, is never written into frontend code, environment files or Git, and is stated only in this internal report. All 40 accounts are internal test brands; before any real seller uses one, a password change is required — I will add that as a documented handover condition, and on request flag the accounts so they must reset on first real use.

## Execution order once approved

1. Migration (sellers public read, admin role, audit table).
2. Deploy importer; run `dry_run=true`; show reconciliation.
3. Run `execute=true` in batches (sellers → products → variants → 438 images).
4. Admin publish step: batch `submitted` → `live`.
5. Frontend data-source + DEV_SELLER_ID/guard changes.
6. Verification: isolation test, brand/store/product/collections checks, re-run idempotency check, final totals.
