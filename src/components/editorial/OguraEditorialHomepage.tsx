import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingBag, Heart, MapPin } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useLocation } from "@/contexts/LocationContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useDesigners } from "@/hooks/useDesigners";
import { AlgoliaSearchDropdown, AlgoliaMobileSearch } from "@/components/search";
import { UserMenu } from "@/components/auth/UserMenu";
import { LuxuryFooter } from "@/components/LuxuryFooter";
import { oguraCategories } from "@/data/oguraCategories";
import oguraLogo from "@/assets/ogura-logo.png.asset.json";

import topsHero from "@/assets/tops-hero.jpg";
import bottomsHero from "@/assets/bottoms-hero.jpg";
import outerwearHero from "@/assets/outerwear-hero.jpg";
import dressesHero from "@/assets/dresses-hero.jpg";
import hiddenGemsHero from "@/assets/hidden-gems-hero.jpg";
import indieVogue from "@/assets/indie-vogue.jpg";
import urbanLoom from "@/assets/urban-loom.jpg";
import chanderiShine from "@/assets/chanderi-shine.jpg";
import sareeSociety from "@/assets/saree-society.jpg";
import instaLoved from "@/assets/insta-loved.jpg";
import footwearHero from "@/assets/footwear-hero.jpg";
import bagsHero from "@/assets/bags-hero.jpg";

import "./editorial-homepage.css";

/* ------------------------------------------------------------------ */
/* Existing media sources (unchanged URLs)                             */
/* ------------------------------------------------------------------ */

const HERO_VIDEO =
  "https://res.cloudinary.com/dpnosz8im/video/upload/f_auto,q_auto/v1768378220/bfakbydpghrmr0cvqdy99nkqy4_result__udh0fw.mp4";

const catVideo = (slug: string) =>
  oguraCategories.find((c) => c.slug === slug)?.cardVideo ?? "";

const EXPLORE_TILES = [
  { label: "Made to Order", slug: "made-to-order", to: "/category/made-to-order" },
  { label: "Pinterest Finds", slug: "street-casual", to: "/category/street-casual" },
  { label: "Celebrity Fashion", slug: "celebrity-fashion", to: "/category/celebrity-fashion" },
  { label: "Festive Edit", slug: "occasion-wear", to: "/category/occasion-wear" },
  { label: "Designer Curations", slug: "limited-drops", to: "/category/limited-drops" },
  { label: "Instagram Boutiques", slug: "co-ord-sets", to: "/brands" },
];

const FINISHING_TILES = [
  { label: "Customized Footwear", slug: "footwear-edit", to: "/category/footwear-edit", still: footwearHero },
  { label: "Designer Bags", slug: "bags-accessories", to: "/category/bags-accessories", still: bagsHero },
];

const NAV = [
  { label: "SHOP", to: "/collections" },
  { label: "BRANDS", to: "/brands" },
  { label: "DESIGNERS", to: "/designers" },
  { label: "OCCASIONS", to: "/occasions" },
  { label: "MADE TO ORDER", to: "/category/made-to-order" },
];

const PRODUCTS_API = "https://pyesltzkemtranachpne.supabase.co/functions/v1/products";

type RailProduct = {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
};

const inr = (n: number) =>
  `₹${Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

/* ------------------------------------------------------------------ */
/* Header                                                              */
/* ------------------------------------------------------------------ */

const EditorialHeader = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { items: wishlistItems } = useWishlist();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-colors duration-300"
      style={{
        background: scrolled ? "#09090BF2" : "transparent",
        backdropFilter: scrolled ? "blur(10px)" : undefined,
        borderBottom: scrolled ? "1px solid var(--og-border)" : "1px solid transparent",
      }}
    >
      <div className="og-wrap og-page">
        {/* Desktop */}
        <div className="hidden md:flex items-center justify-between h-[76px]">
          <Link to="/" aria-label="OGURA home" className="shrink-0">
            <img src={oguraLogo.url} alt="OGURA" className="h-9 w-auto object-contain" />
          </Link>

          <nav className="flex items-center gap-7">
            {NAV.map((n) => (
              <Link
                key={n.label}
                to={n.to}
                className="text-[11px] tracking-[0.16em] uppercase transition-colors"
                style={{ color: "var(--og-text-muted)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--og-text)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--og-text-muted)")}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="w-[360px] xl:w-[420px]">
              <AlgoliaSearchDropdown isScrolled={false} />
            </div>
            <UserMenu isScrolled={false} />
            <button
              aria-label="Wishlist"
              onClick={() => navigate("/wishlist")}
              className="relative h-11 w-11 flex items-center justify-center"
              style={{ color: "var(--og-text)" }}
            >
              <Heart
                className="h-5 w-5"
                style={{ color: wishlistItems?.length ? "var(--og-pink)" : undefined }}
              />
            </button>
            <button
              aria-label="Shopping bag"
              onClick={() => navigate("/cart")}
              className="relative h-11 w-11 flex items-center justify-center"
              style={{ color: "var(--og-text)" }}
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span
                  className="absolute top-1 right-0 h-4 min-w-4 px-1 rounded-full text-[10px] flex items-center justify-center"
                  style={{ background: "var(--og-pink)", color: "#fff" }}
                >
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          <div className="flex items-center justify-between h-[72px]">
            <button
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
              className="h-11 w-11 flex items-center justify-center"
              style={{ color: "var(--og-text)" }}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Link to="/" aria-label="OGURA home">
              <img src={oguraLogo.url} alt="OGURA" className="h-8 w-auto object-contain" />
            </Link>
            <div className="flex items-center">
              <button
                aria-label="Wishlist"
                onClick={() => navigate("/wishlist")}
                className="h-11 w-11 flex items-center justify-center"
                style={{ color: "var(--og-text)" }}
              >
                <Heart className="h-5 w-5" />
              </button>
              <button
                aria-label="Shopping bag"
                onClick={() => navigate("/cart")}
                className="relative h-11 w-11 flex items-center justify-center"
                style={{ color: "var(--og-text)" }}
              >
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <span
                    className="absolute top-1 right-0 h-4 min-w-4 px-1 rounded-full text-[10px] flex items-center justify-center"
                    style={{ background: "var(--og-pink)", color: "#fff" }}
                  >
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
          <div className="pb-3">
            <AlgoliaMobileSearch />
          </div>
          {open && (
            <nav
              className="flex flex-col py-2"
              style={{ borderTop: "1px solid var(--og-border)" }}
            >
              {NAV.map((n) => (
                <Link
                  key={n.label}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className="text-[12px] tracking-[0.16em] uppercase py-3"
                  style={{ color: "var(--og-text)" }}
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

const EditorialHero = () => (
  <section className="relative w-full h-[560px] md:h-[720px] xl:h-[840px] overflow-hidden" style={{ background: "var(--og-bg)" }}>
    <video
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      className="absolute inset-0 w-full h-full object-cover"
      style={{ background: "var(--og-bg)" }}
      src={HERO_VIDEO}
    />
    <div className="og-overlay-hero-left" aria-hidden />
    <div className="og-overlay-hero-bottom" aria-hidden />

    <div className="absolute inset-0 og-wrap">
      <div className="absolute left-[6%] top-[58%] -translate-y-1/2 max-w-[640px] pr-6">
        <p className="og-eyebrow mb-5" style={{ color: "var(--og-text-muted)" }}>
          OGURA FASHION — CRAFTED FOR MODERN ELEGANCE.
        </p>
        <h1 className="og-h1 mb-8">Fashion that defines you.</h1>
        <Link to="/collections" className="og-btn og-btn-primary">
          Designer Collections
        </Link>
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* Section shell                                                       */
/* ------------------------------------------------------------------ */

const SectionHead = ({
  eyebrow,
  title,
  copy,
  action,
}: {
  eyebrow: string;
  title: string;
  copy?: string;
  action?: { label: string; to: string };
}) => (
  <div className="flex items-end justify-between gap-6 mb-8 md:mb-12">
    <div className="max-w-[720px]">
      <p className="og-eyebrow mb-3">{eyebrow}</p>
      <h2 className="og-h2">{title}</h2>
      {copy && (
        <p className="mt-4 text-[14px] leading-relaxed" style={{ color: "var(--og-text-muted)" }}>
          {copy}
        </p>
      )}
    </div>
    {action && (
      <Link to={action.to} className="og-link hidden md:inline-block shrink-0">
        {action.label}
      </Link>
    )}
  </div>
);

const VideoTile = ({
  label,
  src,
  to,
  ratio = "aspect-[3/4]",
}: {
  label: string;
  src: string;
  to: string;
  ratio?: string;
}) => (
  <Link to={to} className="og-group block">
    <div className={`og-media ${ratio}`}>
      <video
        className="og-hover-zoom"
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        tabIndex={-1}
      />
      <div className="og-overlay-tile-bottom" aria-hidden />
      <span className="absolute left-5 bottom-5 text-[12px] tracking-[0.16em] uppercase" style={{ color: "var(--og-text)" }}>
        {label}
      </span>
    </div>
  </Link>
);

const ImageTile = ({
  label,
  caption,
  src,
  to,
  ratio = "aspect-[3/4]",
}: {
  label: string;
  caption?: string;
  src: string;
  to: string;
  ratio?: string;
}) => (
  <Link to={to} className="og-group block">
    <div className={`og-media ${ratio}`}>
      <img className="og-hover-zoom" src={src} alt={label} loading="lazy" />
      <div className="og-overlay-tile-bottom" aria-hidden />
      <div className="absolute left-5 bottom-5 right-5">
        <span className="block text-[12px] tracking-[0.16em] uppercase">{label}</span>
        {caption && (
          <span className="block mt-1 text-[12px]" style={{ color: "var(--og-text-muted)" }}>
            {caption}
          </span>
        )}
      </div>
    </div>
  </Link>
);

/* ------------------------------------------------------------------ */
/* New Arrivals rail (existing products API, existing /product/:id)    */
/* ------------------------------------------------------------------ */

const NewArrivalsRail = () => {
  const [items, setItems] = useState<RailProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(PRODUCTS_API);
        if (!res.ok) throw new Error(`API error ${res.status}`);
        const data = await res.json();
        const raw = Array.isArray(data) ? data : data?.products ?? data?.data ?? [];
        const mapped: RailProduct[] = raw
          .filter((p: any) => p && (p.id ?? p.ID))
          .slice(0, 12)
          .map((p: any) => ({
            id: String(p.id ?? p.ID),
            name: p.name ?? p.title ?? "Untitled",
            brand: p.brand ?? p.brand_name ?? p.store?.name ?? "OGURA",
            price: Number(p.price) || 0,
            image:
              (Array.isArray(p.image_urls) && p.image_urls[0]) ||
              p.image_url ||
              (Array.isArray(p.images) && p.images[0]) ||
              "/placeholder.svg",
          }));
        if (!cancelled) setItems(mapped);
      } catch (e) {
        console.error("[EditorialNewArrivals] fetch failed:", e);
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="og-section og-wrap og-page">
      <SectionHead
        eyebrow="Just Arrived"
        title="New Arrivals"
        copy="The newest pieces from designers and boutiques on OGURA."
        action={{ label: "View All", to: "/collections" }}
      />

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <div className="og-media aspect-[3/4]" style={{ background: "var(--og-surface)" }} />
              <div className="h-3 w-2/3 mt-4" style={{ background: "var(--og-surface-2)" }} />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="text-[14px]" style={{ color: "var(--og-text-muted)" }}>
          New arrivals are being prepared. Please check back shortly.
        </p>
      ) : (
        <div className="og-scroll-x gap-4 md:gap-6 md:grid md:grid-cols-4 md:overflow-visible">
          {items.slice(0, 8).map((p) => (
            <Link
              key={p.id}
              to={`/product/${p.id}`}
              className="og-group block min-w-[62%] sm:min-w-[42%] md:min-w-0"
            >
              <div className="og-media aspect-[3/4]">
                <img className="og-hover-zoom" src={p.image} alt={p.name} loading="lazy" />
              </div>
              <p className="mt-4 text-[11px] tracking-[0.14em] uppercase" style={{ color: "var(--og-text-dim)" }}>
                {p.brand}
              </p>
              <p className="mt-1 text-[14px]" style={{ color: "var(--og-text)" }}>
                {p.name}
              </p>
              <p className="mt-1 text-[13px]" style={{ color: "var(--og-text-muted)" }}>
                {inr(p.price)}
              </p>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8 md:hidden">
        <Link to="/collections" className="og-link">
          View All
        </Link>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Designers to Know                                                   */
/* ------------------------------------------------------------------ */

const DESIGNER_TABS = [
  "ALL",
  "INDEPENDENT DESIGNERS",
  "INSTAGRAM BRANDS",
  "BOUTIQUES",
  "CELEBRITY FASHION LABELS",
];

const DesignersToKnow = () => {
  const [tab, setTab] = useState("ALL");
  const { data: designers, isLoading } = useDesigners();

  const visible = useMemo(() => {
    const list = designers ?? [];
    if (tab === "ALL") return list.slice(0, 8);
    const key = tab.toLowerCase();
    const filtered = list.filter((d) => {
      const c = (d.category || "").toLowerCase();
      if (key.includes("independent")) return c.includes("independent") || c.includes("designer");
      if (key.includes("instagram")) return c.includes("instagram");
      if (key.includes("boutique")) return c.includes("boutique");
      if (key.includes("celebrity")) return c.includes("celebrity");
      return true;
    });
    return filtered.slice(0, 8);
  }, [designers, tab]);

  return (
    <section className="og-section og-wrap og-page">
      <SectionHead
        eyebrow="The Names to Follow"
        title="Designers to Know"
        copy="Independent ateliers, boutique labels and celebrity favourites, curated on OGURA."
        action={{ label: "All Designers", to: "/designers" }}
      />

      <div
        className="og-scroll-x gap-6 mb-8"
        role="tablist"
        aria-label="Designer categories"
      >
        {DESIGNER_TABS.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            data-active={tab === t}
            className="og-tab"
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="og-media aspect-[4/5]" style={{ background: "var(--og-surface)" }} />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <p className="text-[14px]" style={{ color: "var(--og-text-muted)" }}>
          No designers in this category yet.
        </p>
      ) : (
        <div className="og-scroll-x gap-4 md:gap-6 md:grid md:grid-cols-4 md:overflow-visible">
          {visible.map((d) => (
            <Link
              key={d.id}
              to={d.slug ? `/designer/${d.slug}` : `/designers/${d.id}`}
              className="og-group block min-w-[62%] sm:min-w-[42%] md:min-w-0"
            >
              <div className="og-media aspect-[4/5]">
                <img
                  className="og-hover-zoom"
                  src={d.profile_image || "/placeholder.svg"}
                  alt={d.brand_name || d.name}
                  loading="lazy"
                />
              </div>
              <p className="og-serif mt-4 text-[20px]">{d.brand_name || d.name}</p>
              {d.category && (
                <p className="mt-1 text-[11px] tracking-[0.14em] uppercase" style={{ color: "var(--og-text-dim)" }}>
                  {d.category}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Campaign split                                                      */
/* ------------------------------------------------------------------ */

const Campaign = ({
  eyebrow,
  title,
  copy,
  cta,
  image,
  reversed,
}: {
  eyebrow: string;
  title: string;
  copy: string;
  cta: { label: string; to: string };
  image: string;
  reversed?: boolean;
}) => (
  <section className="og-section og-wrap og-page">
    <div className={`flex flex-col gap-8 md:gap-12 md:flex-row md:items-center ${reversed ? "md:flex-row-reverse" : ""}`}>
      <div className="w-full md:w-[60%]">
        <div className="og-group og-media aspect-[4/3] md:aspect-[16/11]">
          <img className="og-hover-zoom" src={image} alt={title} loading="lazy" />
        </div>
      </div>
      <div className="w-full md:w-[40%]">
        <p className="og-eyebrow mb-3">{eyebrow}</p>
        <h2 className="og-h2 mb-5">{title}</h2>
        <p className="text-[14px] leading-relaxed mb-8" style={{ color: "var(--og-text-muted)" }}>
          {copy}
        </p>
        <Link to={cta.to} className="og-btn og-btn-ghost">
          {cta.label}
        </Link>
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const OguraEditorialHomepage = () => {
  const { location: userLocation, setShowManualSelector, setShowPermissionModal } = useLocation();
  const rootRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={rootRef} className="ogura-editorial min-h-screen">
      <EditorialHeader />

      <main>
        <EditorialHero />

        {/* Explore OGURA — six tiles, each existing category video once */}
        <section className="og-section og-wrap og-page">
          <SectionHead
            eyebrow="Where to Begin"
            title="Explore OGURA"
            copy="Six ways into the wardrobe — made-to-order ateliers, boutique labels and festive edits."
          />
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {EXPLORE_TILES.map((t) => (
              <VideoTile key={t.slug} label={t.label} src={catVideo(t.slug)} to={t.to} />
            ))}
          </div>
        </section>

        <NewArrivalsRail />

        {/* Distinctive by Design */}
        <section className="og-section og-wrap og-page">
          <SectionHead
            eyebrow="Silhouettes"
            title="Distinctive by Design"
            copy="Considered cuts across tops, bottoms, layers and dresses."
          />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            <ImageTile label="Tops" src={topsHero} to="/category/street-casual" />
            <ImageTile label="Bottoms" src={bottomsHero} to="/category/co-ord-sets" />
            <ImageTile label="Layers" src={outerwearHero} to="/category/limited-drops" />
            <ImageTile label="Dresses" src={dressesHero} to="/category/occasion-wear" />
          </div>
        </section>

        <DesignersToKnow />

        <Campaign
          eyebrow="New Talent"
          title="OGURA Launchpad"
          copy="Emerging Indian labels making their first appearance — small runs, hand-finished detail, direct from the atelier."
          cta={{ label: "Discover Labels", to: "/brands" }}
          image={hiddenGemsHero}
        />

        {/* Festive New-In */}
        <section className="og-section og-wrap og-page">
          <SectionHead
            eyebrow="Season of Celebration"
            title="Festive New-In"
            copy="Chanderi, silk and handwoven drape for the celebration calendar."
            action={{ label: "Shop Festive", to: "/category/occasion-wear" }}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
            <ImageTile
              label="Chanderi Shine"
              caption="Lightweight festive weaves"
              src={chanderiShine}
              to="/category/occasion-wear"
              ratio="aspect-[4/3]"
            />
            <ImageTile
              label="Saree Society"
              caption="Drapes for every ceremony"
              src={sareeSociety}
              to="/category/occasion-wear"
              ratio="aspect-[4/3]"
            />
          </div>
        </section>

        {/* The Finishing Touch — footwear + bags videos */}
        <section className="og-section og-wrap og-page">
          <SectionHead
            eyebrow="Complete the Look"
            title="Accessories & Designer Footwear"
            copy="Made-to-measure footwear and designer bags, finished by hand."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
            {FINISHING_TILES.map((t) => (
              <VideoTile
                key={t.slug}
                label={t.label}
                src={catVideo(t.slug)}
                to={t.to}
                ratio="aspect-[4/3]"
              />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 md:gap-6 mt-3 md:mt-6">
            <ImageTile label="Footwear Edit" src={footwearHero} to="/category/footwear-edit" ratio="aspect-[16/10]" />
            <ImageTile label="Bags & Accessories" src={bagsHero} to="/category/bags-accessories" ratio="aspect-[16/10]" />
          </div>
        </section>

        {/* Made Around You */}
        <section className="og-section og-wrap og-page">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="max-w-[720px]">
              <p className="og-eyebrow mb-3">Local Ateliers</p>
              <h2 className="og-h2 mb-5">Made Around You</h2>
              <p className="text-[14px] leading-relaxed" style={{ color: "var(--og-text-muted)" }}>
                {userLocation
                  ? `Delivering to ${userLocation.city}, ${userLocation.pincode}. Discover stores and studios you can visit.`
                  : "Set your delivery location to see stores and studios you can visit."}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <button
                className="og-btn og-btn-ghost"
                onClick={() =>
                  userLocation ? setShowManualSelector(true) : setShowPermissionModal(true)
                }
              >
                <MapPin className="h-4 w-4 mr-2" />
                {userLocation ? "Change Location" : "Set Location"}
              </button>
              <Link to="/stores" className="og-btn og-btn-ghost">
                Find Stores
              </Link>
            </div>
          </div>
        </section>

        <Campaign
          eyebrow="Styled Together"
          title="Shop the Look"
          copy="Complete outfits put together by our stylists — every piece shoppable on its own."
          cta={{ label: "Shop the Look", to: "/collections" }}
          image={urbanLoom}
          reversed
        />

        <Campaign
          eyebrow="From Instagram"
          title="Instagram Boutiques on OGURA"
          copy="Independent boutiques you already follow, now with a full storefront, sizing and secure checkout."
          cta={{ label: "Browse Boutiques", to: "/brands" }}
          image={instaLoved}
        />

        <Campaign
          eyebrow="Editorial"
          title="Indie Vogue"
          copy="Handloom reinterpreted for the everyday wardrobe by India's independent design studios."
          cta={{ label: "See the Edit", to: "/collections" }}
          image={indieVogue}
          reversed
        />

        {/* Trust strip — factual only */}
        <section className="og-wrap og-page pb-16 md:pb-24">
          <div
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 py-10 md:py-12 px-6 md:px-10"
            style={{ border: "1px solid var(--og-border)", borderRadius: "2px" }}
          >
            {[
              { t: "Direct from designers", d: "Every order is fulfilled by the label that made it." },
              { t: "Made to order available", d: "Selected pieces are crafted after you place the order." },
              { t: "Secure online payment", d: "Payments are processed through an encrypted gateway." },
            ].map((i) => (
              <div key={i.t}>
                <p className="text-[12px] tracking-[0.14em] uppercase mb-2">{i.t}</p>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--og-text-muted)" }}>
                  {i.d}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <LuxuryFooter />
    </div>
  );
};

export default OguraEditorialHomepage;
