# Careers Page — Full Content Rewrite

Replace the placeholder careers content with the real OGURA internship programme copy.

## Page structure (`/careers`)

1. **Hero** — eyebrow "Careers at OGURA", H1 "Build the Future of Fashion with Us", the intro paragraphs about the OGURA ecosystem, what interns actually do, and the line that most openings are internships. CTAs: "View open roles" + `careers@ogura.in` mailto.

2. **Open roles — grouped into 4 sections** (in this order), each with a section heading and short lead-in where provided:
   - **Fashion & Brand** — roles 1-4 (Catalogue & Product Taxonomy, Brand Sourcing, Brand Partnerships & Seller Onboarding, Seller Success & Marketplace Operations)
   - **OGURA Launchpad** — includes the "Build Your Fashion Brand with OGURA" intro paragraph, then roles 5-10 (Founder Lead Gen, Partnerships & Launchpad Sales, Brand Strategy & Research, Sourcing & Product Development, Content & Editorial, Influencer & Creator Partnerships)
   - **Product, Technology & Growth** — roles 11-15 (Product Management, Product Marketing & Growth, AI Product/AI Engineering, Full-Stack Engineering, UI/UX Design)
   - **Operations & Execution** — role 16 (Project Management & Startup Operations)

3. **Role cards (expandable)** — each role renders as a collapsible accordion row so the page stays scannable:
   - Collapsed: number + title, "Internship" tag, "Ideal for" line.
   - Expanded: "About the role", "What you will do" bullet list, the "Example" / "The core question you will help answer" callout where the copy has one, "Who should apply", and an **Apply** button that pre-fills the application form with that role title and scrolls to it.

4. **Who We Look For** — the paragraph on curiosity, ownership, communication, plus the note welcoming NIFT, Pearl Academy and other institutions.

5. **Why Join OGURA?** — 5 cards: Work on a real startup, Work across teams, Build your portfolio, Learn how a startup works, Take ownership.

6. **Who Should Apply?** — the "whether you are…" paragraph closing with "Choose the role that best matches your interests and strengths."

7. **Apply Now — application form** (existing form, kept): Name, Email, Phone, Role of interest (auto-filled from the role card), Portfolio/LinkedIn, Message. Submits via `mailto:careers@ogura.in` with details in the body, same as today. Direct mailto line kept below it.

## Technical notes

- Single file change: `src/pages/Careers.tsx`. Route, header nav tab and footer link already exist — untouched.
- Role data moved into a typed array of groups → roles (`title`, `type`, `idealFor`, `about`, `doList[]`, `callout?`, `calloutLabel?`, `whoShouldApply`), rendered in a loop so future edits are copy-only.
- Expand/collapse uses the existing shadcn `Accordion` component; Apply button uses `onClick` with `stopPropagation` so it doesn't toggle the row.
- Existing design tokens only (no hardcoded colours), current luxury type scale and card styling preserved.
- SEO: update the page title/meta description to reference OGURA internships; keeps the single H1.

## Note

No backend table or resume upload — applications still go out through the visitor's mail client, so CVs are attached by the applicant. Say the word if you'd rather store applications in the backend with file upload.
