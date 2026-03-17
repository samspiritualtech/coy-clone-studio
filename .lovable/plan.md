

# Add Privacy Policy & Terms of Use Pages + Fix Footer Links

## Changes

### 1. Create `src/pages/PrivacyPolicy.tsx`
Full content page with the provided privacy policy text, wrapped in `CustomerLayout` with header/footer. Clean typography with proper headings and paragraphs.

### 2. Create `src/pages/TermsOfUse.tsx`
Full content page with the provided terms of use text, same layout pattern.

### 3. Update `src/apps/CustomerApp.tsx`
Add two new public routes:
- `/privacy` → `<PrivacyPolicy />`
- `/terms` → `<TermsOfUse />`

### 4. Update `src/components/LuxuryFooter.tsx`
- Add "Privacy Policy" and "Terms of Use" links under the Help section (lines 78-90)
- Fix bottom bar links (lines 129-134) to point to `/privacy` and `/terms` instead of `/`
- Fix Help section links to point to real routes (`/stores` for Store Locator, etc.) instead of `/`

### 5. Update `src/components/Footer.tsx`
- Fix Legal section links: `/privacy`, `/terms` already correct — just ensure they use `Link` from react-router-dom instead of `<a>` tags for SPA navigation
- Fix Help section links similarly

### Files to create
- `src/pages/PrivacyPolicy.tsx`
- `src/pages/TermsOfUse.tsx`

### Files to modify
- `src/apps/CustomerApp.tsx` — add routes
- `src/components/LuxuryFooter.tsx` — add links under Help, fix bottom bar links
- `src/components/Footer.tsx` — convert `<a>` tags to `<Link>` for internal routes

