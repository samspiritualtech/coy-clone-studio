# Careers Page + Careers Nav Tab

## What changes

1. **Navigation** — In the homepage header nav bar (currently Brands, Designers, Occasions, New, Stores), replace **New** with **Careers** pointing to `/careers`. Same styling, same position.

2. **New `/careers` landing page** — Premium luxury editorial layout consistent with the OGURA aesthetic:
   - Hero band: eyebrow "OGURA CAREERS", headline, short line about building India's luxury fashion marketplace.
   - "Why OGURA" — 3-4 value cards (craft-led culture, ownership, designers & brands, growth).
   - Open roles — a list of role cards (title, location, type) each with an "Apply" action that pre-fills an application to `careers@ogura.in` with the role name.
   - Application form — Name, Email, Phone, Role of interest, Portfolio/LinkedIn URL (optional), Message. On submit it opens the user's mail client to `careers@ogura.in` with the details formatted in the body, matching how the Contact page works today.
   - Direct contact line: `careers@ogura.in` as a clickable mailto for people who prefer to email a CV directly (attachments aren't possible from an in-page form).
   - SEO: page title, meta description, single H1.

3. **Footer link** — add "Careers" alongside the existing Contact link so the page is reachable from every page.

## Technical notes

- New file `src/pages/Careers.tsx`, route registered in `src/apps/CustomerApp.tsx` as `/careers` (public).
- Nav item edited in `src/components/LuxuryHeader.tsx`; also add to the mobile menu if that header renders one.
- Client-side validation with zod (`message` API, `error.issues`), toast feedback via `useToast` — same pattern as `src/pages/Contact.tsx`.
- No database table and no backend function: submissions go out as `mailto:` like Contact. If you'd rather store applications in the backend (with resume file upload) that's a follow-up.
- Uses existing design tokens only — no hardcoded colors.

## Assumption

Open roles will be seeded with a small placeholder set (e.g. Fashion Merchandiser, Growth Marketer, Frontend Engineer, Studio Photographer, Seller Success). Send me your real list and I'll swap it in.
