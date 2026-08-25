import { Button } from "@/components/ui/button";
import { WaitlistSection } from "@/components/waitlist/WaitlistSection";
import { WaitlistForm } from "@/components/waitlist/WaitlistForm";
import oguraLogo from "@/assets/ogura-logo.png.asset.json";
import brand1Asset from "@/assets/waitlist/wl-brand-1.png.asset.json";
import brand2Asset from "@/assets/waitlist/wl-brand-2.png.asset.json";
import aiStudioAsset from "@/assets/waitlist/wl-ai-studio.png.asset.json";

const brand1 = brand1Asset.url;
const brand2 = brand2Asset.url;
const aiStudio = aiStudioAsset.url;
import { Check, Sparkles, ArrowRight, MessageCircle } from "lucide-react";
import { useEffect } from "react";

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const STRIP = [
  "Original design only",
  "No mass production",
  "No white-labelling",
  "Designer and celebrity-led labels",
  "Boutiques and independent brands",
];

const BENEFITS = [
  {
    n: "01",
    title: "Real visibility",
    body: "Your designs are placed in front of fashion-conscious buyers who came looking for exactly this, not lost in a sea of mass-market products.",
  },
  {
    n: "02",
    title: "Buyer trust, built in",
    body: "Because Ogura is curated, buyers extend it the same confidence they extend Myntra or Amazon. New buyers complete their purchase instead of abandoning it.",
  },
  {
    n: "03",
    title: "Test before you produce",
    body: "Open a design for pre-booking and gauge real demand before committing to production. Never manufacture stock on a guess.",
  },
  {
    n: "04",
    title: "Delivery managed end to end",
    body: "Fast, hyperlocal and quick-commerce delivery from your own fulfilment point, alongside returns and failed-delivery support, all handled for you.",
  },
  {
    n: "05",
    title: "A dedicated view into your buyer",
    body: "See which designs draw the most attention, how often a buyer returns to a product, who your buyers are, even the device they use, and which images convert best.",
  },
  {
    n: "06",
    title: "A position that stays premium",
    body: "Your brand appears only alongside other original work, never beside mass-produced or white-labelled products. Distinct, deliberate, and entirely your own.",
  },
];

const FIT = [
  "You make original designs, not mass-produced or copied ones.",
  "You sell on Instagram, from a boutique, or you are just starting out.",
  "Your work is strong, but too few people see it, and buyers slip away.",
  "You want real visibility, real buyers, and support you cannot build alone.",
];

const FOUNDING = [
  "Early access, ahead of general availability.",
  "No listing fees during the founding period.",
  "Priority placement on the homepage and in our launch campaign.",
  "A direct line to our team, not a support queue.",
  "A genuine voice in what we build next.",
];

const STEPS = [
  { n: "1", title: "Apply", body: "Complete a short form. It takes about two minutes." },
  { n: "2", title: "We review", body: "We assess fit and respond within 48 hours." },
  { n: "3", title: "We prepare your store", body: "We help get your designs and storefront ready." },
  { n: "4", title: "You go live", body: "Buyers discover you, orders arrive, and we manage delivery and the rest." },
];

const BrandWaitlist = () => {
  useEffect(() => {
    document.title = "Apply to join Ogura — for India's original designer brands";
    const desc = document.querySelector('meta[name="description"]');
    if (desc) {
      desc.setAttribute(
        "content",
        "Ogura is a curated designerwear marketplace for independent, designer-led labels. Applications are open for 50 founding brands. Free to apply.",
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-background font-body">
      {/* Nav */}
      <header className="sticky top-0 z-50 bg-background/85 backdrop-blur-md border-b border-border/60">
        <div className="container mx-auto px-6 max-w-6xl h-16 md:h-20 flex items-center justify-between">
          <img src={oguraLogo.url} alt="OGURA" className="h-8 md:h-10 w-auto object-contain" />
          <Button
            onClick={() => scrollTo("apply")}
            className="editorial-label uppercase text-[11px] tracking-[0.14em] h-10 px-5"
          >
            Apply to join
          </Button>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="container mx-auto px-6 max-w-4xl pt-20 pb-14 md:pt-28 md:pb-20 text-center">
            <span className="inline-block editorial-eyebrow text-brand border border-brand/30 bg-brand-soft rounded-full px-4 py-2 mb-8">
              Founding brands. Applications open.
            </span>
            <h1 className="waitlist-serif text-[2.6rem] leading-[1.02] sm:text-6xl md:text-7xl text-foreground mb-7">
              The home for India's original designer brands.
            </h1>
            <p className="editorial-body text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              Ogura is a curated designerwear marketplace for independent, designer-led labels, the
              original work you will not find on Myntra or Nykaa. We give you visibility, buyer trust,
              delivery support, and tools no independent brand can build alone.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" onClick={() => scrollTo("apply")} className="editorial-label uppercase text-xs h-12 px-8">
                Apply to join
              </Button>
              <Button size="lg" variant="outline" onClick={() => scrollTo("what-you-get")} className="editorial-label uppercase text-xs h-12 px-8">
                See what you get
              </Button>
            </div>
            <p className="editorial-body text-sm text-muted-foreground mt-6">
              Free to apply. We are selecting only 50 founding brands to start, and we reply within 48 hours.
            </p>
          </div>

          {/* Brand imagery */}
          <div className="container mx-auto px-6 max-w-5xl pb-6">
            <div className="grid grid-cols-2 gap-3 md:gap-5 max-w-3xl mx-auto">
              {[brand1, brand2].map((src, i) => (
                <div key={i} className="overflow-hidden rounded-xl md:rounded-2xl bg-muted aspect-[3/4]">
                  <img
                    src={src}
                    alt="Original design by an independent Indian designer label"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Scrolling strip */}
        <div className="border-y border-border bg-foreground text-background overflow-hidden py-4">
          <div className="flex gap-10 whitespace-nowrap animate-[waitlist-marquee_28s_linear_infinite] will-change-transform">
            {[...STRIP, ...STRIP, ...STRIP, ...STRIP].map((item, i) => (
              <span key={i} className="editorial-label uppercase text-[11px] tracking-[0.24em] opacity-80">
                {item} <span className="text-brand ml-10">/</span>
              </span>
            ))}
          </div>
        </div>

        {/* The Problem */}
        <WaitlistSection
          kicker="Why Ogura"
          heading="In India, most buyers drop off before checkout. This is why."
          narrow
        >
          <div className="space-y-6 editorial-body text-base md:text-lg text-muted-foreground">
            <p>
              Across India, buyers routinely abandon Shopify stores and Instagram brand pages moments
              before paying. They see a design they want, they add it to cart, they message in DMs, and
              then they stop.
            </p>
            <p>
              The reason is trust, not price and not product. Buyers have learned to feel safe on Myntra
              and Amazon, where a known name, visible reviews, easy returns, and guaranteed delivery
              remove all doubt from the decision to pay. An independent brand, however strong its design,
              does not yet carry that same weight. So the buyer hesitates at the one moment that matters
              most, and walks away.
            </p>
            <p>
              This is not a one-time miss. It is a structural loss, repeated at scale. The brand has
              already done the harder work, it earned genuine interest and brought the buyer to the page.
              It loses her anyway, because no single page can offer the certainty a national platform
              offers by default. This gap, between wanting a product and trusting enough to pay for it,
              is where independent brands in India lose the most revenue today.
            </p>
          </div>
        </WaitlistSection>

        {/* Vision & Mission */}
        <WaitlistSection kicker="What we stand for" className="bg-muted/40">
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="rounded-2xl border border-border bg-card p-8">
              <p className="editorial-eyebrow text-muted-foreground mb-4">Vision</p>
              <p className="waitlist-serif text-2xl md:text-3xl text-foreground leading-snug">
                A fashion industry where original design competes on merit, not on the size of a brand's
                marketing budget or its place on a mass platform.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-8">
              <p className="editorial-eyebrow text-muted-foreground mb-4">Mission</p>
              <p className="waitlist-serif text-2xl md:text-3xl text-foreground leading-snug">
                To give India's independent, designer-led brands the trust, visibility, and infrastructure
                of a national platform, so the strength of their design is what wins the buyer, not the
                size of their following.
              </p>
            </div>
          </div>
          <p className="editorial-body text-base md:text-lg text-muted-foreground max-w-3xl">
            We built Ogura because talent alone does not win in Indian fashion today. Distribution does.
            A designer with real originality can be outsold by a brand with none, simply because the buyer
            trusted one page and not the other. We do not believe that is how a fashion market should
            work, and we built Ogura to correct it.
          </p>
        </WaitlistSection>

        {/* Why Ogura Exists */}
        <WaitlistSection
          kicker="What we are building"
          heading="Ogura exists to give independent brands the trust they cannot build alone."
          narrow
        >
          <p className="editorial-body text-base md:text-lg text-muted-foreground mb-8">
            We do not simply list brands. We extend to each one the credibility that turns a hesitant,
            first-time buyer into a paying customer, the same certainty she already grants Myntra or
            Amazon. That credibility has never been available to an independent brand acting on its own.
            It is the reason Ogura exists.
          </p>
          <div className="border-l-2 border-brand pl-6">
            <p className="waitlist-serif text-2xl md:text-3xl text-foreground leading-snug">
              In one line: Ogura gives independent brands the authority to convert the buyers they have
              already earned, but have been losing at the final step.
            </p>
          </div>
        </WaitlistSection>

        {/* What is Ogura */}
        <WaitlistSection kicker="What is Ogura" className="bg-muted/40">
          <p className="editorial-body text-base md:text-lg text-muted-foreground max-w-3xl mb-14">
            Ogura is a curated designerwear marketplace for original, independent fashion. We list only
            designer-led and celebrity-led brands with unique designs, the kind you will not find on
            Myntra or Nykaa. We choose every brand with care, so fashion-conscious buyers arrive already
            believing in the place, and the new buyers you have been losing finally feel confident enough
            to order.
          </p>
          <h3 className="waitlist-serif text-3xl md:text-5xl text-foreground mb-8 max-w-2xl">
            Ogura is built for you if you fit one of these.
          </h3>
          <ul className="grid md:grid-cols-2 gap-4 max-w-4xl">
            {FIT.map((item) => (
              <li key={item} className="flex gap-3 rounded-xl border border-border bg-card p-5">
                <Check className="w-5 h-5 text-brand shrink-0 mt-0.5" />
                <span className="editorial-body text-sm md:text-base text-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </WaitlistSection>

        {/* What you get */}
        <WaitlistSection
          id="what-you-get"
          kicker="What you get"
          heading="More than a listing. Complete infrastructure behind your brand."
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {BENEFITS.map((b) => (
              <div
                key={b.n}
                className="rounded-2xl border border-border bg-card p-7 hover:border-brand/40 transition-colors duration-300"
              >
                <p className="editorial-label text-brand text-sm mb-4">{b.n}</p>
                <h3 className="editorial-h3 text-lg md:text-xl text-foreground mb-3">{b.title}</h3>
                <p className="editorial-body text-sm text-muted-foreground">{b.body}</p>
              </div>
            ))}
          </div>

          {/* 07 featured */}
          <div className="mt-6 rounded-2xl border border-brand/30 bg-card overflow-hidden grid lg:grid-cols-2">
            <div className="p-8 md:p-12">
              <p className="editorial-label text-brand text-sm mb-4 flex items-center gap-2">
                07 <Sparkles className="w-4 h-4" /> Featured
              </p>
              <h3 className="waitlist-serif text-3xl md:text-4xl text-foreground mb-3">
                Built-in AI Studio
              </h3>
              <p className="editorial-h3 text-base md:text-lg text-foreground/80 mb-5">
                Turn a plain design into a professional photoshoot.
              </p>
              <p className="editorial-body text-sm md:text-base text-muted-foreground">
                Few independent brands can afford a model, a photographer, or a studio. Ogura's built-in
                AI Studio converts a simple image of your design into a professional, lifelike photoshoot,
                at no cost and with no shoot required. Assess how a design will look before a single piece
                is produced, and present your work at the same standard as the country's largest labels.
              </p>
            </div>
            <div className="bg-muted min-h-[260px]">
              <img
                src={aiStudio}
                alt="Ogura Studio interface turning a flat garment image into a lifelike photoshoot"
                loading="lazy"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </WaitlistSection>

        {/* Why join now */}
        <WaitlistSection
          kicker="Why join now"
          heading="The first 50 are treated as founding partners."
          className="bg-muted/40"
        >
          <p className="editorial-body text-base md:text-lg text-muted-foreground max-w-2xl mb-10">
            Not listings. Partners. Founding brands help shape what Ogura becomes, and are rewarded for
            arriving early.
          </p>
          <div className="grid lg:grid-cols-5 gap-6">
            <ul className="lg:col-span-3 space-y-3">
              {FOUNDING.map((item) => (
                <li key={item} className="flex gap-3 rounded-xl border border-border bg-card p-5">
                  <Check className="w-5 h-5 text-brand shrink-0 mt-0.5" />
                  <span className="editorial-body text-sm md:text-base text-foreground">{item}</span>
                </li>
              ))}
            </ul>
            <div className="lg:col-span-2 rounded-2xl bg-foreground text-background p-8 flex flex-col justify-center text-center">
              <p className="waitlist-serif text-6xl md:text-7xl text-brand mb-2">50</p>
              <p className="editorial-label uppercase text-[11px] tracking-[0.2em] mb-5 opacity-80">
                Founding spots only
              </p>
              <p className="editorial-body text-sm opacity-70 mb-7">
                This offer is made once. When the 50 spots are filled, the door closes, and later
                applicants wait.
              </p>
              <Button
                onClick={() => scrollTo("apply")}
                variant="outline"
                className="editorial-label uppercase text-xs h-11 border-background/40 bg-transparent text-background hover:bg-background hover:text-foreground"
              >
                Claim your spot
              </Button>
            </div>
          </div>
        </WaitlistSection>

        {/* How it works */}
        <WaitlistSection kicker="How it works" heading="Joining takes minutes.">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {STEPS.map((s) => (
              <div key={s.n} className="rounded-2xl border border-border bg-card p-7">
                <div className="w-9 h-9 rounded-full bg-brand-soft text-brand editorial-label flex items-center justify-center mb-5 text-sm">
                  {s.n}
                </div>
                <h3 className="editorial-h3 text-lg text-foreground mb-2">{s.title}</h3>
                <p className="editorial-body text-sm text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </WaitlistSection>

        {/* Application form */}
        <WaitlistSection
          id="apply"
          kicker="Apply to join"
          heading="Become one of the first brands on Ogura."
          className="bg-muted/40"
          narrow
        >
          <p className="editorial-body text-base md:text-lg text-muted-foreground mb-10">
            A few essential details. Exact figures are not required, an estimate is sufficient.
          </p>
          <WaitlistForm />
        </WaitlistSection>

        {/* Closing CTA */}
        <section className="relative overflow-hidden bg-foreground text-background">
          <img
            src={brand2}
            alt=""
            aria-hidden
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
          <div className="relative container mx-auto px-6 max-w-3xl py-24 md:py-32 text-center">
            <h2 className="waitlist-serif text-4xl md:text-6xl mb-6">
              Your designs deserve to be seen, trusted, and bought.
            </h2>
            <p className="editorial-body text-base md:text-lg opacity-75 mb-10">
              Apply now, and become one of the first brands on Ogura.
            </p>
            <Button
              size="lg"
              onClick={() => scrollTo("apply")}
              className="editorial-label uppercase text-xs h-12 px-8"
            >
              Apply to join <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-6 max-w-6xl flex flex-col md:flex-row items-center justify-between gap-6">
          <img src={oguraLogo.url} alt="OGURA" className="h-8 w-auto object-contain" />
          <div className="flex flex-col items-center md:items-end gap-3">
            <a
              href={`https://wa.me/917742698970?text=${encodeURIComponent("Hi Ogura, I'd like to apply to the waitlist.")}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 editorial-label uppercase text-xs h-10 px-5 rounded-full border border-brand/40 bg-brand-soft text-brand hover:bg-brand hover:text-background transition-colors"
            >
              <MessageCircle className="w-4 h-4" /> Apply to waitlist
            </a>
            <p className="editorial-body text-sm text-muted-foreground text-center md:text-right">
              Curated designerwear. Original brands only. ogura.in · +91 77426 98970
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BrandWaitlist;
