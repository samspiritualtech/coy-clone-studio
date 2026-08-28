# 16 — Design System (OGURA Frontend)

Scope: `src/index.css` (1031 lines), `tailwind.config.ts`, `index.html`, `src/components/ui/**` (shadcn), `src/components/luxury3d/**`, animation packages. [CONFIRMED] unless flagged.

## 1. CSS Custom Properties (`src/index.css`)

### 1.1 `:root` (light) — lines 10–65
| Token | Value (HSL triplet) | Provenance |
|---|---|---|
| `--background` | `0 0% 100%` | custom CSS, consumed via Tailwind `bg-background` |
| `--foreground` | `0 0% 10%` | " |
| `--card` / `--card-foreground` | `0 0% 100%` / `0 0% 10%` | " |
| `--popover` / `--popover-foreground` | `0 0% 100%` / `0 0% 10%` | " |
| `--primary` / `--primary-foreground` | `0 0% 10%` / `0 0% 98%` | " |
| `--secondary` / `--secondary-foreground` | `0 0% 96%` / `0 0% 10%` | " |
| `--muted` / `--muted-foreground` | `0 0% 96%` / `0 0% 45%` | " |
| `--accent` / `--accent-foreground` | `25 95% 53%` (orange) / `0 0% 98%` | " |
| `--destructive` / `--destructive-foreground` | `0 84.2% 60.2%` / `0 0% 98%` | " |
| `--border` | `0 0% 90%` | " |
| `--input` | `0 0% 90%` | " |
| `--ring` | `0 0% 10%` | " |
| `--radius` | `0.75rem` | drives Tailwind `borderRadius.lg/md/sm` |
| `--instagram-purple/pink/orange/yellow` | `276 51% 47%` / `340 75% 54%` / `11 90% 61%` / `35 97% 63%` | custom CSS, used by `.instagram-gradient*` utilities |
| `--ogura-red` | `0 84% 60%` | custom brand token; [OBSERVED] not obviously consumed anywhere audited beyond declaration (grep for usages advised) — **[UNKNOWN]** usage sites |
| `--ogura-pink` | `342 68% 52%` | consumed by Tailwind `colors.brand.DEFAULT`, `.text-brand`, `.border-brand`, `.bg-brand-soft`, `.text-brand-gradient`, `--gradient-ogura`, waitlist `--wl-pink` |
| `--ogura-pink-light` | `342 74% 62%` | Tailwind `colors.brand.light`, `--gradient-ogura` |
| `--gradient-ogura` | `linear-gradient(100deg, hsl(var(--ogura-pink)) 0%, hsl(var(--ogura-pink-light)) 100%)` | custom CSS gradient var |
| `--sidebar-background/foreground/primary/primary-foreground/accent/accent-foreground/border/ring` | shadcn sidebar palette (`0 0% 98%` etc.) | shadcn convention, mapped 1:1 in `tailwind.config.ts` `colors.sidebar` |

### 1.2 `.dark` (dark mode) — lines 67–109
Overrides background/foreground/card/popover/primary/secondary/muted/border/input/ring/sidebar to inverted greyscale (e.g. `--background: 0 0% 10%`, `--foreground: 0 0% 98%`). `--accent` stays `25 95% 53%` (same as light). Instagram gradient vars are re-declared identically ("same in dark mode" per inline comment, line 104). `--destructive` becomes darker (`0 62.8% 30.6%`). No `--ogura-*` or `--gradient-ogura` redeclaration inside `.dark` — **[OBSERVED]** brand pink tokens are not re-themed for dark mode (relies on light-mode values leaking through). **[UNKNOWN]** whether `.dark` class is ever actually toggled anywhere in the app (no `next-themes`/theme toggle found in the audited component list — grep did not surface a theme switcher component). Tag: **[INFERRED]** dark mode is wired at the CSS/Tailwind level (`darkMode: ["class"]` in `tailwind.config.ts`) but there is no confirmed UI control that adds `.dark` to `<html>`; treat dark mode as present-but-possibly-unused. **[MISSING]** confirmation of a theme toggle component.

### 1.3 Non-semantic "layer" theme systems (all custom CSS, not shadcn, not Tailwind config)
The file defines several **parallel, hardcoded design languages** layered on top of the shadcn token system, each scoped by a wrapper class:

- **`.museum-*` ("Atelier of Light" museum aesthetic)** — lines ~389–591. Its own local CSS-var palette declared **inline inside the class** (not in `:root`): `--museum-bg:#08070a`, `--museum-espresso:#15110d`, `--museum-gold:#c9a56b`, `--museum-gold-bright:#e9d4a3`, `--museum-ivory:#f4efe6`, `--museum-glass`, `--museum-glass-line`. Utilities: `.museum-surface`, `.museum-gold-glow`, `.museum-vignette-strong`, `.museum-grain-strong` (SVG-noise `feTurbulence` data-URI + `lux-grain` keyframe, disabled under `prefers-reduced-motion: reduce`), `.museum-eyebrow`, `.museum-display` / `.museum-display-sm` (fluid `clamp()` serif display type, font `Cormorant Garamond`), `.museum-lede`, `.museum-glass`, `.museum-card` (hover-lift + border-color transition), `.museum-hairline-gold`, `.museum-spotlight` (cursor-follow radial gradient via `--mx/--my` CSS vars set from JS), `.museum-cta`, `.museum-meta`, `.museum-rule`, `.museum-orbit` (decorative concentric rings). Provenance: 100% custom CSS.
- **`.luxury-*` (earlier "luxury 3D enhancement layer")** — lines ~232–382. `.luxury-tilt-root` / `.luxury-tilt-inner` / `.luxury-tilt-glare` (CSS custom-property-driven 3D tilt: `--rx --ry --s --ty --mx --my`, paired with `Tilt3D.tsx` JS component below), `.luxury-glass`, `.luxury-depth`, `.luxury-spotlight`, `.luxury-sweep` (skewed light-sweep hover), `.luxury-vignette`, `.luxury-grain` (same SVG-noise technique as museum-grain but lower opacity 0.06), `.luxury-hairline-gold`, `.luxury-eyebrow-gold` (Cormorant Garamond italic, color `#c9a56b` hardcoded, not a var), `.luxury-float-idle` (`lux-float` keyframe), `.luxury-cta-glass`.
- **`.waitlist-page` ("atelier paper" theme, BrandWaitlist page only)** — lines ~660+ (per truncated view; confirmed presence via grep). Own local HSL vars: `--wl-paper: 42 33% 97%`, `--wl-paper-deep: 38 26% 93%`, `--wl-ink: 24 12% 12%`, `--wl-pink: var(--ogura-pink)` (reuses brand token), `--wl-gold: 38 70% 58%`. Utilities: `.wl-paper-card`, `.wl-tint`, `.wl-prose` (drop-cap first-letter styling via `::first-letter`, gradient text-clip), `waitlist-marquee` keyframe. Provenance: custom CSS, scoped to one page.
- **`.editorial-*` (Careers / general editorial typography)** — lines ~625–660 approx: `.font-display` / `.font-body` (both map to `'Manrope', system-ui, sans-serif`), `.editorial-eyebrow`, `.editorial-h1`, `.editorial-h2`, `.editorial-h3`, `.editorial-body`, `.editorial-label`. Provenance: custom CSS utility layer, weight/letter-spacing driven, no color set (inherits `currentColor`/Tailwind color utility applied alongside).
- **`.waitlist-serif` / `.waitlist-serif-italic`** — `'Playfair Display', 'Cormorant Garamond', serif` display type for the waitlist landing.

### 1.4 General/base utilities (custom CSS, `@layer utilities`)
`.hover-scale`, `.instagram-gradient`, `.instagram-gradient-overlay`, `.hero-gradient-overlay`, `.luxury-overlay`, `.luxury-heading`, `.luxury-button`, `.fade-out` (+ `fadeOut` keyframe), `@keyframes kenburns` (duplicated: also defined as a Tailwind `animation` in `tailwind.config.ts` — **[CONFLICT]**: `kenburns` keyframe exists both hand-written in `index.css` line 181 (`0%/50%/100%` scale `1/1.05/1`) and in `tailwind.config.ts` (`0%/50%/100%` scale `1/1.08/1`) — the two definitions use **different peak scale values (1.05 vs 1.08)**, meaning whichever cascade wins (Tailwind's generated utility class vs the raw CSS keyframe) determines actual runtime behavior; not reconciled in source. **[CONFLICT]** `.product-tile-3d` / `.product-tile-3d-shimmer` (gradient-border 3D product card treatment, hardcoded `hsl(38 92% 60%/.55)` etc., not tokenized).

### 1.5 Brand-accent utilities (custom CSS, reuse tokens)
`.text-brand`, `.border-brand`, `.bg-brand-soft`, `.brand-rule`, `.text-brand-gradient` — all built on `hsl(var(--ogura-pink))`/`--gradient-ogura`. Provenance: custom CSS layer, properly tokenized (good practice) — contrasts with the hardcoded museum/luxury hex colors below.

## 2. Tailwind Theme Extension (`tailwind.config.ts`)
- `darkMode: ["class"]`, `prefix: ""`.
- `content`: `./pages/**`, `./components/**`, `./app/**`, `./src/**` (note: `./pages` and `./components` at repo root do not exist in this project — only `./src/**` glob is actually effective; **[OBSERVED]** redundant/stale content globs, harmless but imprecise, likely copied from a default Lovable/shadcn template).
- `container`: `center: true`, `padding: "2rem"`, breakpoint override `2xl: "1400px"` (this is the **only breakpoint customization**; all other Tailwind default breakpoints — `sm 640px, md 768px, lg 1024px, xl 1280px` — are untouched defaults, confirmed by widespread use of `md:`/`lg:` in components matching Tailwind defaults).
- `colors`: adds `brand.DEFAULT` / `brand.light` (mapped to `--ogura-pink` / `--ogura-pink-light`) plus the full standard shadcn set (`border, input, ring, background, foreground, primary, secondary, destructive, muted, accent, popover, card, sidebar.*`), all as `hsl(var(--token))` — shadcn convention.
- `borderRadius`: `lg = var(--radius)` (0.75rem), `md = calc(var(--radius) - 2px)`, `sm = calc(var(--radius) - 4px)` — shadcn convention.
- `keyframes`/`animation`: `accordion-down/up` (shadcn/radix accordion, height+opacity), `fade-in` (translateY 20px→0, 0.6s), `fade-in-slow` (opacity only, 1s), `scale-in` (0.95→1 scale, 0.2s), `slide-up` (translateY 40px→0, 0.8s), `kenburns` (scale 1→1.08→1, 20s infinite — see §1.4 conflict).
- `plugins`: `tailwindcss-animate` only.
- No custom `fontFamily` extension in Tailwind config — **[OBSERVED]** all custom font-family declarations (Cormorant Garamond, Playfair Display, Manrope) are applied via raw CSS `font-family:` inside utility classes in `index.css`, NOT via Tailwind `theme.fontFamily`/`font-serif`/`font-sans` tokens. Default Tailwind `font-sans`/`font-serif` stacks remain unmodified.
- No custom `boxShadow`, `spacing`, or `screens` (beyond the `2xl` container override) extensions — all shadow/spacing values used across the "luxury"/"museum" layers are hardcoded inline `box-shadow` strings in `index.css`, not Tailwind tokens.

## 3. Fonts
- **Loaded via `index.html`** (Google Fonts, lines 8–10): `Cormorant Garamond` (weights 300,400,500,600,700 + italics 300,400,600), `Manrope` (300,400,500,600,700,800), `Playfair Display` (400,500,600,700 + italic 400,500,600). Preconnected to `fonts.googleapis.com` and `fonts.gstatic.com`.
- **Usage mapping** (from CSS, [OBSERVED]):
  - `Manrope` → default body/editorial typography (`.font-display`, `.font-body`, `.editorial-*`, `.museum-lede`, `.museum-meta`, `.museum-cta`) — the de facto UI sans-serif.
  - `Cormorant Garamond` → italic gold "eyebrow" labels and museum display headings (`.luxury-eyebrow-gold`, `.museum-eyebrow`, `.museum-display`, `.museum-display-sm`, `.museum-meta .k`), with fallback `'Times New Roman', serif`.
  - `Playfair Display` → waitlist-only serif display (`.waitlist-serif`, `.waitlist-serif-italic`, drop-cap in `.wl-prose`), fallback `'Cormorant Garamond', serif`.
  - No global `body { font-family }` override was found in the `@layer base body` rule (only `@apply bg-background text-foreground`) — **[OBSERVED]** base body font relies on Tailwind's default sans stack (system font) except where the above utility classes are explicitly applied per-component. **[INFERRED]** this produces visually inconsistent typography across the site unless every heading/body element opts into `.font-display`/`.editorial-*`/`.museum-*` classes.
  - Icon font/favicon: `/favicon.png` (PNG, not SVG/ICO), also used as `apple-touch-icon`.

## 4. Component styling conventions (shadcn `cva` variants)
All under `src/components/ui/*.tsx`, using `class-variance-authority` (`cva`) + Radix primitives + `cn()` (from `src/lib/utils`, tailwind-merge/clsx convention). Confirmed for:
- **Button** (`button.tsx`): variants `default | destructive | outline | secondary | ghost | link`; sizes `default | sm | lg | icon`. Fully token-based (`bg-primary`, `bg-destructive`, etc.), no hardcoded colors.
- **Badge, Card, Input, Dialog, Drawer, Tabs, Table, Toast, Skeleton, Alert-Dialog, Accordion, Avatar, Breadcrumb, Calendar, Carousel, Chart, Checkbox, Collapsible, Command, Context-Menu, Dropdown-Menu, Form, Hover-Card, Input-OTP** — present under `src/components/ui/` (confirmed file listing) — [INFERRED same shadcn `cva`+Radix convention, token-based colors] based on Button's pattern and standard shadcn scaffolding conventions; not each individually line-inspected in this pass. **[UNKNOWN]** whether any of these ui/ primitives have been hand-edited to introduce hardcoded colors (would require a full per-file diff against stock shadcn — out of scope here; recommend targeted grep of `src/components/ui/*.tsx` for hex codes if deeper audit needed).
- Custom/product-specific card components (`PLPProductCard`, `DesignerProductCard`, `AzaDesignerCard`, etc.) largely bypass shadcn `Card` variants in favor of bespoke Tailwind classNames plus the `.museum-card`/`.luxury-tilt-*`/`.product-tile-3d` custom-CSS treatments — provenance: custom CSS + inline Tailwind, not shadcn `cva`.

## 5. Animation / interaction system
- **framer-motion** (`^12.40.0`) — used directly in `src/components/luxury3d/Tilt3D.tsx` (`motion.div`, `initial`/`whileInView` scroll-reveal) and other components (grep-confirmed as a project dependency; individual usage sites not exhaustively enumerated here — **[UNKNOWN]** full list of all consuming components beyond Tilt3D).
- **gsap** (`^3.15.0`) — declared dependency; **[UNKNOWN]** exact consuming components not enumerated in this pass (would require a full `import gsap` grep across `src/components` — recommend follow-up if GSAP usage detail is required).
- **lenis** (`^1.3.23`) — smooth-scroll library dependency; **[UNKNOWN]** exact mount point (typically wrapped near app root) not confirmed in this pass.
- **Tilt3D** (`src/components/luxury3d/Tilt3D.tsx`) — custom 3D hover-tilt wrapper: tracks mouse position, sets CSS custom properties `--mx/--my/--rx/--ry/--s` on the wrapped element (consumed by `.luxury-tilt-*` CSS above), combined with a `framer-motion` `whileInView` fade/slide-up entrance (`opacity:0,y:24 → 1,0`). Props: `max` (tilt degrees, default 6), `scale` (default 1.015), `glare` (default true), `perspective` (default 1200).
- **ParallaxLayer** (`src/components/luxury3d/ParallaxLayer.tsx`) — present in file tree; **[UNKNOWN]** exact implementation not read in this pass (recommend follow-up view if parallax mechanics need documenting).
- **Glare/spotlight hover effects**: implemented as CSS radial-gradients following `--mx/--my` (`.luxury-tilt-glare`, `.luxury-spotlight::before`, `.museum-spotlight::before`), all requiring a JS mousemove handler (Tilt3D or per-component equivalent) to update those vars — pure-CSS `:hover` fallback would not position the gradient.
- **Grain/noise textures**: `.luxury-grain` / `.museum-grain-strong` — inline SVG `feTurbulence` filter as a `background-image: url("data:image/svg+xml,...")`, animated via `lux-grain` keyframe (position jitter), explicitly disabled under `prefers-reduced-motion: reduce` for the museum variant only (`.luxury-grain` has no such media-query guard — **[OBSERVED]** inconsistent reduced-motion handling between the two near-duplicate effects).
- Tailwind-native animations (`accordion-down/up`, `fade-in`, `fade-in-slow`, `scale-in`, `slide-up`, `kenburns`) used as utility classes (`animate-fade-in` etc.) across marketing sections.

## 6. Icon library
- **lucide-react** (`^0.462.0`) — confirmed sole icon import source in files read (`Mail, Phone, MapPin` in Contact.tsx; `MessageCircle` in waitlist; `Sparkles, Users, Gem, Rocket, Layers` in Careers.tsx). No other icon package found in dependency grep.

## 7. Image treatments
- `OptimizedImage.tsx` component exists (`src/components/OptimizedImage.tsx`) — **[UNKNOWN]** exact lazy-loading/responsive-srcset implementation not read in this pass; presence confirmed only.
- Ken-Burns slow-zoom effect (`.kenburns`/`kenburns` keyframe) applied to hero imagery (per naming convention and typical usage — **[INFERRED]** consuming components not individually enumerated).
- `.museum-card img` hover-scale (`transform: scale(1.08)` on `.luxury-tilt-root:hover`) for product/editorial cards.
- Vignette/grain overlays (`.luxury-vignette`, `.museum-vignette-strong`) layered on top of hero/banner images via absolutely-positioned pseudo-siblings.

## 8. Provenance summary (rule origin)
| Layer | Origin |
|---|---|
| Semantic color tokens (`--background`, `--primary`, etc.) | Custom CSS `:root`/`.dark`, shadcn convention |
| Tailwind `colors.*` mapping | `tailwind.config.ts`, shadcn convention |
| `brand` color | Custom addition on top of shadcn convention (OGURA-specific) |
| Button/Badge/Dialog/etc. variants | shadcn `cva`, Radix primitives |
| `.museum-*`, `.luxury-*`, `.waitlist-*`, `.editorial-*`, `.product-tile-3d*` | 100% hand-written custom CSS (`@layer utilities`), not generated by any tool |
| Fonts (Cormorant/Manrope/Playfair) | External Google Fonts `<link>` in `index.html`, applied via raw CSS `font-family` (not Tailwind config) |
| Icons | `lucide-react` package, inline React usage |
| 3D tilt/parallax/glare | Custom React components (`Tilt3D`, `ParallaxLayer`) + custom CSS vars, `framer-motion` for entrance animation |
| Inline hardcoded Tailwind color utilities (`text-[#e9d4a3]`, `bg-[#D4AF37]`, etc.) | Ad hoc inline Tailwind arbitrary-value classes, bypassing the token system entirely |

## 9. Hardcoded colors / inconsistencies (evidence)
A `grep -rn "text-\[#\|bg-\[#\|border-\[#"` across `src/components` and `src/pages` returned **150+ raw hex-color occurrences** (152 total hex-literal matches outside `index.css`). This indicates the "museum gold" (`#c9a56b` / `#e9d4a3` / `#f4efe6`) and a **second, unrelated "made-to-order gold"** (`#D4AF37` / `#B8860B`) and a **third luxe-edit palette** (`#4A3728`, `#6B5B4F`, `#C9A962`, `#3A2A1E`) and a **fourth CTA blue** (`#1E9FD9`) are all used as raw arbitrary Tailwind values instead of design tokens. Evidence:

- `src/components/HiddenGemsSection.tsx:87,92,112,147,148,161` — `text-[#e9d4a3]`, `border-[#c9a56b]/10`, etc. (museum gold, duplicated inline instead of reusing `.museum-eyebrow`/CSS vars).
- `src/components/LuxuryBrands.tsx:58,64` — `text-[#e9d4a3]/85`, `text-[#f4efe6]/65` (museum ivory/gold, inline).
- `src/components/LuxuryStoreLocator.tsx:58,59,65` — `text-[#e9d4a3]`, `text-[#c9a56b]`, `text-[#f4efe6]/65`.
- `src/components/LuxuryTrustBadges.tsx:34,35,37,40` — `border-[rgba(233,212,163,0.4)]`, `text-[#e9d4a3]`, `text-[#f4efe6]`.
- `src/components/PinterestInspiredSection.tsx:71,73,90` — `text-[#f4efe6]/85`, `text-[#e9d4a3]`.
- `src/components/category/CategoryHeroBanner.tsx:79,91` — a **third gold**, `#D4AF37`, mixed with `#E8D5B7` — inconsistent with museum gold `#c9a56b`/`#e9d4a3` used elsewhere. **[CONFLICT]**: two different "gold" hex families (`#c9a56b`/`#e9d4a3` museum vs `#D4AF37`/`#B8860B` made-to-order) are used for what appears to be the same conceptual "luxury gold accent," with no shared token.
- `src/components/category/LuxeEditSection.tsx:21,24,27,32` — yet another palette: `#C9A962`, `#4A3728`, `#6B5B4F`, `#4A3728`/`#3A2A1E` (brown/gold "luxe edit" theme, distinct from both golds above).
- `src/components/made-to-order/MTOBaseDesignGallery.tsx:131,152,153,169,187`, `MTOCustomizationPanel.tsx:192,203,278,279,292,298`, `MTODesignerSelector.tsx:72,100,101,117`, `MTOEntryPaths.tsx:66` — pervasive `#D4AF37`/`#B8860B` "made-to-order gold," entirely separate from `--ogura-pink`/museum tokens, used dozens of times as raw arbitrary values rather than a CSS variable.
- `src/pages/Contact.tsx:170` — `bg-[#1E9FD9] hover:bg-[#1a8bbf]` — a one-off blue CTA button color unrelated to any brand/accent token (`--accent` is orange `25 95% 53%`, `--ogura-pink` is pink `342 68% 52%`; this blue matches neither).
- `@keyframes kenburns` duplicate definitions with **different scale peaks** (`index.css` line 181: `1.05`; `tailwind.config.ts`: `1.08`) — see §1.4.
- `--ogura-red` (`0 84% 60%`) declared in `:root` but **no confirmed consumer** found in this pass — possible dead/unused token. **[UNKNOWN]**.
- Dark mode (`.dark` class) does not redeclare `--ogura-pink`/`--gradient-ogura`/museum vars, and no theme-toggle UI was found — dark mode CSS exists but its activation path is unconfirmed. **[MISSING]**.

**Net effect**: the project has at least **four distinct, non-tokenized "gold/luxury accent" color families** in simultaneous use (`#c9a56b`/`#e9d4a3` museum, `#D4AF37`/`#B8860B` made-to-order, `#C9A962`/`#4A3728` luxe-edit, `#E8D5B7`/`#D4AF37` category-hero) plus the token-based `--ogura-pink` brand color, none of which are unified in `tailwind.config.ts` or `:root`.
