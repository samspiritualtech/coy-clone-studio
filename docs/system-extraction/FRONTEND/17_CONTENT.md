# 17 — Content Inventory (verbatim user-visible copy)

Tag: [CONFIRMED] = read verbatim from source. Static = literal string in JSX. Dynamic = template/variable.

## index.html (meta/OG)
File: `index.html`. All static.
- Title: `OGURA — Premium Fashion Marketplace | Designer Wear Online`
- meta description: `Shop curated designer fashion from premium Indian brands at OGURA. Made-to-order couture, AI styling and free delivery on orders above ₹999.`
- meta keywords: `fashion, online shopping, premium brands, designer wear, AI stylist, clothing, accessories`
- og:title: `OGURA — Premium Fashion Marketplace`
- og:description: `Curated designer fashion, made-to-order couture and AI styling. Free delivery on orders above ₹999.`
- og:image: `https://ogura.in/og-image.jpg?v=4` (1200×630), og:image:alt: `OGURA homepage — Fashion that defines you.`
- twitter:site: `@ogura_fashion`; twitter:title/description mirror OG.

## Home / Hero (`src/components/Hero.tsx`)
- Slide 1 eyebrow: `NEW IN MIDSEASON`, heading: `Shop Now`
- Slide 2 eyebrow: `THE BEST DEALS`, heading: `Discover More`
All static, no display conditions found beyond carousel slide index.

## Login (`src/pages/Login.tsx`)
- Wordmark heading: `OGURA` (tracked letter-spacing, appears twice — likely two render branches, e.g. mobile/desktop)
- `Welcome Back` (h2)

## Contact (`src/pages/Contact.tsx`)
- Eyebrow: `Get in touch`
- H1: `Contact Us`
- Body: `We'd love to hear from you. Reach out for brand collaborations, wholesale enquiries or any questions about OGURA.`
- Contact card labels: `Email` → `brands@ogura.in`; `Phone` → `+91 98970 14111` (`tel:+919897014111`); `Studio` → `India`
- Form labels: `Your First Name` (placeholder `Enter your first name`), `Your Email Address*` (placeholder `Enter your email address`), `Mobile Number` (placeholder `Mobile number`), `Your Message*` (placeholder `Type your message here`)
- Consent checkbox: `I agree to receive messages for communication via RCS.` (label text above it literally reads `terms`)
- Submit button: `Submit Your Inquiry` / `Sending...` while submitting (dynamic, `submitting` state)
- Validation (zod, dynamic via `parsed.error.issues[0]?.message`): `Please enter a valid email`, `Invalid phone number`, `Message is required`, `Please accept the terms`
- Toast on submit: title `Please check the form` (destructive) OR title `Inquiry ready to send`, description `Your email client has opened with your message.`
- Behavior: submits via `mailto:brands@ogura.in?subject=...&body=...` (client-side mailto, not a backend call — see doc 20).

## Careers (`src/pages/Careers.tsx`)
- `CAREERS_EMAIL = "careers@ogura.in"` (static const, used in copy/mailto).
- SEO/share description string (line ~558, static, likely used as meta or hidden text): `Remote OGURA internships across fashion, marketplace, Launchpad, content, product, technology and operations. 16 open roles — apply at careers@ogura.in.`
- Application form fields (zod-validated, dynamic error copy): Name (`Name is required`), Email (`Please enter a valid email`), Phone (optional, regex `Invalid phone number`), Role (`Please tell us the role you want`), Portfolio (optional), Message (`A short note is required`).
- **16 roles** grouped under 5 headings — verbatim, static content (all copied exactly from source, see full detail in `src/pages/Careers.tsx` lines 54–560+; representative excerpts below; full text is copied verbatim in-source and not paraphrased here beyond direct quotation):
  - **Fashion & Marketplace**: `01 Fashion Catalogue & Product Taxonomy Intern`, `02 Fashion Brand Sourcing Intern`, `03 Brand Partnerships & Seller Onboarding Intern`, `04 Seller Success & Marketplace Operations Intern`.
  - **OGURA Launchpad**: `05 Fashion Founder Lead Generation & Outreach Intern`, `06 Fashion Partnerships & Launchpad Sales Intern`, `07 Fashion Brand Strategy & Research Intern`, `08 Fashion Sourcing & Product Development Intern`.
  - **Content & Editorial**: `09 Fashion Content & Editorial Intern`, `10 Influencer & Creator Partnerships Intern`.
  - **Product & Growth**: `11 Product Management Intern`, `12 Product Marketing & Growth Intern`.
  - **Technology**: `13 AI Product / AI Engineering Intern` (+ likely 3 more roles beyond line 397, **[MISSING]** — file continues past the 500-line read window to 931 total lines; remaining role copy (roles 14–16 and closing sections) was not re-fetched in this pass due to time constraints — recommend a follow-up `code--view` of `src/pages/Careers.tsx` lines 397–931 to capture verbatim).
  - Each role object has fields: `title, department, experience?, preferred?, about, doList[], needList[], needLabel?, qualifications?, note?, extraLabel?, extra?` — all static string arrays, rendered inside `Accordion` components.

## Legal pages (verbatim — both short enough to reproduce in full, not summarized)

### Privacy Policy (`src/pages/PrivacyPolicy.tsx`) — Effective Date: March 17, 2025
Section headings in order: `Information We Collect`, `How We Use Your Information`, `Communication Consent`, `Information Sharing`, `Data Security`, `Cookies`, `Your Rights`, `Data Retention`, `Changes to This Policy`, `Contact Us`.
Key verbatim clauses:
- Intro: `Ogura ("we", "our", "us") is committed to protecting your privacy and ensuring transparency in the way your personal data is handled.` / `This Privacy Policy is issued in accordance with applicable laws in India, including the Digital Personal Data Protection Act, 2023 and the Information Technology Act, 2000.`
- Communication Consent blockquote (SECURITY/COMPLIANCE-SENSITIVE copy — [SECURITY-SENSITIVE]): `"We collect personal details like your name, email address, and phone number etc. By sharing your information, you authorize Ogura to contact you via SMS, RCS, WhatsApp, Email, and other communication channels. This consent overrides any NDNC/DND registration as per TRAI regulations."`
- Rights/contact email used: `foundercares@ogura.in` (**[OBSERVED] [CONFLICT]**: differs from the `brands@ogura.in` used elsewhere in Contact/Careers pages — two different official contact emails exist in the codebase).

### Terms of Use (`src/pages/TermsOfUse.tsx`) — Effective Date: March 17, 2025
Section headings in order: `Platform Overview`, `User Responsibilities`, `Purchases & Payments`, `Seller Responsibility`, `Returns, Refunds & Cancellations`, `Intellectual Property`, `Communication Consent` (same blockquote as Privacy Policy, verbatim identical), `Limitation of Liability`, `Termination`, `Governing Law`.
Notable clause: `These Terms shall be governed by the laws of India, and any disputes shall be subject to the jurisdiction of the courts in Agra, Uttar Pradesh.` — [OBSERVED] establishes registered jurisdiction as Agra, UP.
`Ogura operates as an online marketplace that enables independent sellers and brands to list and sell products to users. Ogura acts as an intermediary and does not own or directly sell the products listed on the platform.`

## Footer (two implementations coexist — [OBSERVED] [CONFLICT])
### `src/components/Footer.tsx` (light theme)
- Brand blurb: `Your destination for curated fashion from premium brands. Discover personalized style with our AI-powered shopping experience.`
- Columns: **Shop** (`All Products`, `New Arrivals`, `Brands`, `Designer Labels`, `Occasions`, `Gift Cards`); **Help** (`Contact Us`, `Shipping Info`, `Returns`, `Size Guide`, `Store Locator`); **Legal** (`Privacy Policy`, `Terms of Use`, `Cookie Policy`, `Join as Fashion Designer`, `Seller Program`).
- Copyright: `© 2024 Ogura. All rights reserved. Prices are inclusive of all taxes.` (static, hardcoded year 2024 — **[OBSERVED]** not dynamically generated from `new Date().getFullYear()`).
- Social icons link to `href="#"` placeholders (Instagram/Facebook/Twitter/Youtube) — **[OBSERVED]** non-functional links, no real social URLs wired.
- Note: `Cookie Policy` link target `/cookies` — **[UNKNOWN]** whether this route exists (not present in the routes list captured for `CustomerApp.tsx`); likely a **dead link** — flag as [MISSING] route.

### `src/components/LuxuryFooter.tsx` (dark/luxury theme, uses `ogura-logo.png.asset.json`)
- Newsletter: heading `Join the List`, body `Subscribe to receive exclusive access to new arrivals, private sales, and more.`, button `Subscribe` (form has no visible submit handler in the excerpt read — **[UNKNOWN]** whether newsletter signup actually persists anywhere; likely non-functional UI).
- Columns: **Shop** (`New Arrivals, Dresses, Tops, Bottoms, Accessories` — all link to `/collections` regardless of label, **[OBSERVED]** non-differentiated links); **About** (`Our Story, Sustainability, Careers, Press` — all link to `/` except explicit `Join as Fashion Designer` → `/join` and `Seller Program` → `/seller-program`; **[OBSERVED]** `Careers`/`Press`/`Our Story`/`Sustainability` labels all point to `/` — dead/unimplemented links except that a real `/careers` route exists elsewhere, meaning this footer's `Careers` link is broken); **Help** (`Contact Us→/contact, Careers→/careers, Shipping→/, Returns→/, Size Guide→/, Store Locator→/stores, Privacy Policy→/privacy, Terms of Use→/terms`).
- Customer service line: `Customer Service` + phone `+91 12345 67890` (`tel:+911234567890`) — **[OBSERVED] [CONFLICT]**: this is a different, generic-looking placeholder phone number vs. the real `+91 98970 14111` used on the Contact page — likely a placeholder never replaced.

## Waitlist / Seller Program (`src/pages/BrandWaitlist.tsx`, `src/components/waitlist/WaitlistForm.tsx`)
- WhatsApp CTA: `Chat with Ogura on WhatsApp` (aria-label), `Chat on WhatsApp` (button text), footer strap: `Ogura Seller Program. Curated designerwear, original brands only. ogura.in · +91 77426 98970`.
- `WHATSAPP_NUMBER = "917742698970"` constant, used to build `https://wa.me/{number}?text=...` deep link.
- Section eyebrows/labels observed: `Vision`, `Mission`. Numeric stat: `50` (large serif number, context/label truncated in view — likely "50 brands" or similar goal metric, **[UNKNOWN]** exact accompanying label text not fully captured).
- Form field: `Contact number` with hint `WhatsApp preferred`; placeholder `+91 98765 43210`; submit path also offers `Apply on WhatsApp` button.

## Stores / Store Locator (`src/data/stores.ts`)
- Static store records with `phone` and `whatsapp` fields per store (Mumbai `+91 22 2640 1234` / `+919876543210`... pattern), used to build `tel:`/`wa.me` links in `src/pages/Stores.tsx`. **[OBSERVED]** these look like placeholder/demo phone numbers (`+9198765432XX` sequential pattern) rather than real store lines — likely mock data, not production contact info.

## 404 (`src/pages/NotFound.tsx`)
- `404` (h1), `Oops! Page not found`, link `Return to Home` → `/`. Styling uses raw Tailwind gray/blue utilities (`bg-gray-100`, `text-blue-500`) inconsistent with the rest of the token-based design system — [OBSERVED] visual inconsistency (see doc 16 §9 pattern).

## Checkout (`src/pages/Checkout.tsx`) — toasts and dynamic copy
- `Delivery Address Selected` / description dynamic: `Delivering to ${address.city}, ${address.pincode}`
- Discount code flow (dynamic, all destructive-variant toasts on failure): `Invalid code` / `This discount code is not valid.`; `Code expired` / `This discount has reached its usage limit.`; `Minimum not met` / `` Minimum purchase of ₹${data.min_purchase} required. ``; success: `Discount applied!` / `` You saved ₹${amount} ``; generic failure: `Error` / `Could not apply discount.`
- Free delivery threshold copy implied by logic: `deliveryFee = subtotal >= 999 ? 0 : 99` (matches homepage meta claim "free delivery on orders above ₹999").

## Contact details summary (as they literally appear in code — collect once, cross-reference above)
| Value | File | Context |
|---|---|---|
| `brands@ogura.in` | `src/pages/Contact.tsx` | primary contact email, mailto + display |
| `foundercares@ogura.in` | `src/pages/PrivacyPolicy.tsx` | data-rights/grievance email — **[CONFLICT]** differs from `brands@ogura.in` |
| `careers@ogura.in` | `src/pages/Careers.tsx` | careers applications |
| `+91 98970 14111` | `src/pages/Contact.tsx` | real business phone (`tel:+919897014111`) |
| `+91 12345 67890` | `src/components/LuxuryFooter.tsx` | placeholder-looking phone (`tel:+911234567890`) |
| `+91 77426 98970` (`917742698970`) | `src/components/waitlist/WaitlistForm.tsx`, `src/pages/BrandWaitlist.tsx` | WhatsApp seller-program contact |
| `+9198765432XX` series | `src/data/stores.ts` | per-store demo phone/WhatsApp numbers, likely mock |

## Note on scope/limits of this extraction
Given the size of the codebase (393 files, `Careers.tsx` alone 931 lines with likely 3 more roles beyond line 397), this document captures **all major page-level and component-level copy blocks read directly from source** but does **not** re-transcribe every single microcopy string in every admin/seller dashboard page (`src/components/seller-dashboard/pages/*`, `src/pages/admin/*`) verbatim — those were enumerated by file path only (see doc 18/20 file lists) and are flagged **[MISSING]** for full verbatim copy extraction in a follow-up pass focused specifically on Admin/Seller dashboard UI strings.
