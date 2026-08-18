import { useEffect, useState } from "react";
import { z } from "zod";
import { Mail, Sparkles, Users, TrendingUp, Gem, Rocket, Layers } from "lucide-react";
import { CustomerLayout } from "@/layouts/CustomerLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";

const CAREERS_EMAIL = "careers@ogura.in";

const applicationSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }).max(100),
  email: z.string().trim().email({ message: "Please enter a valid email" }).max(255),
  phone: z
    .string()
    .trim()
    .max(20)
    .regex(/^[0-9+\-\s()]*$/, { message: "Invalid phone number" })
    .optional()
    .or(z.literal("")),
  role: z.string().trim().min(1, { message: "Please tell us the role you want" }).max(160),
  portfolio: z.string().trim().max(300).optional().or(z.literal("")),
  message: z.string().trim().min(1, { message: "A short note is required" }).max(1500),
});

type Role = {
  n: number;
  title: string;
  type: string;
  idealFor: string;
  about: string;
  doList: string[];
  calloutLabel?: string;
  callout?: string;
  whoShouldApply: string;
};

type Group = {
  heading: string;
  lead?: string;
  leadTitle?: string;
  roles: Role[];
};

const groups: Group[] = [
  {
    heading: "Fashion & Brand",
    roles: [
      {
        n: 1,
        title: "Fashion Catalogue & Product Taxonomy Intern",
        type: "Internship",
        idealFor:
          "NIFT, Pearl Academy, Fashion Management, Fashion Design, Fashion Communication, Textile Design",
        about:
          "You will help OGURA understand, structure, and organise fashion products so customers can discover them easily through search, categories, filters, and recommendations.",
        doList: [
          "Analyse fashion brand catalogues",
          "Identify the correct product categories and subcategories",
          "Classify garments, accessories, and fashion products",
          "Identify fabrics, materials, and techniques",
          "Identify silhouettes, fits, patterns, colours, and styles",
          "Define product attributes and tags",
          "Help build OGURA's fashion taxonomy",
          "Review product information submitted by brands and flag anything missing or incorrect",
          "Work with the Product and Technology teams on search and discovery",
          "Improve product tagging for recommendations and personalised discovery",
        ],
        calloutLabel: "Example",
        callout:
          "Instead of simply tagging a product as Dress, you might classify it as: Women → Clothing → Dresses → Midi Dress with attributes: Cotton | Floral | A-Line | Casual | Summer | Short Sleeve",
        whoShouldApply:
          "Someone who understands fashion products and enjoys analysing, categorising, and organising information.",
      },
      {
        n: 2,
        title: "Fashion Brand Sourcing Intern",
        type: "Internship",
        idealFor:
          "NIFT, Pearl Academy, Fashion Management, Fashion Communication, Marketing",
        about:
          "You will help OGURA discover promising fashion brands, designers, and boutique businesses.",
        doList: [
          "Research Instagram fashion brands",
          "Discover independent designers and homegrown labels",
          "Find boutique stores and emerging fashion businesses",
          "Build qualified brand databases",
          "Analyse brand positioning and product assortment",
          "Identify brands suited to OGURA Marketplace",
          "Spot gaps in OGURA's brand and category portfolio",
          "Maintain structured sourcing records",
        ],
        whoShouldApply:
          "Someone who loves discovering new brands and understands the fashion ecosystem.",
      },
      {
        n: 3,
        title: "Brand Partnerships & Seller Onboarding Intern",
        type: "Internship",
        idealFor:
          "Fashion Management, Fashion Communication, BBA, Marketing, Business Development",
        about:
          "You will help bring fashion brands and boutique stores onto OGURA Marketplace.",
        doList: [
          "Reach out to fashion founders and boutique owners",
          "Introduce OGURA and explain our marketplace proposition",
          "Understand each brand's business and catalogue",
          "Qualify potential sellers",
          "Coordinate seller onboarding and catalogue submission",
          "Collect brand and business information",
          "Follow up until the seller is active",
          "Build and maintain long-term seller relationships",
          "Share seller feedback with the product team",
        ],
        whoShouldApply:
          "A strong communicator who enjoys talking to founders and building relationships.",
      },
      {
        n: 4,
        title: "Seller Success & Marketplace Operations Intern",
        type: "Internship",
        idealFor: "Fashion Management, BBA, Operations, E-commerce",
        about:
          "You will help existing OGURA sellers operate successfully on the marketplace.",
        doList: [
          "Track seller onboarding completion",
          "Help sellers complete their catalogues and product information",
          "Support sellers through marketplace processes",
          "Track inventory and catalogue issues",
          "Handle seller queries and monitor seller activation",
          "Collect seller feedback and spot recurring problems",
          "Work with the Product and Operations teams to improve the seller experience",
        ],
        whoShouldApply:
          "Someone organised and helpful who enjoys solving problems and supporting others.",
      },
    ],
  },
  {
    heading: "OGURA Launchpad",
    leadTitle: "Build Your Fashion Brand with OGURA",
    lead:
      "OGURA Launchpad is built for aspiring and early-stage fashion founders who want to build, launch, and grow a fashion business. We work across brand strategy, product development, sourcing, branding, e-commerce, content, marketing, launch, and growth.",
    roles: [
      {
        n: 5,
        title: "Fashion Founder Lead Generation & Outreach Intern",
        type: "Internship",
        idealFor:
          "Fashion Management, Fashion Communication, Marketing, BBA, Business Development",
        about:
          "You will find people who want to start, launch, or grow a fashion business. You will look for aspiring fashion founders, people planning their first brand, fashion students interested in entrepreneurship, designers launching their own labels, Instagram-first brands, boutique owners, and small fashion businesses looking for support.",
        doList: [
          "Research potential founders and brands",
          "Build qualified lead lists using Instagram and LinkedIn research",
          "Run outreach over email, Instagram DM, and WhatsApp",
          "Qualify leads and manage the CRM",
          "Follow up consistently",
          "Identify what stage each founder is at and which Launchpad service fits",
        ],
        whoShouldApply:
          "Someone who enjoys research, spotting opportunities, and starting conversations.",
      },
      {
        n: 6,
        title: "Fashion Partnerships & Launchpad Sales Intern",
        type: "Internship",
        idealFor:
          "Fashion Management, Fashion Marketing, BBA, Sales, Business Development",
        about:
          "You will help OGURA Launchpad build partnerships and turn qualified founders into Launchpad customers. You may work with aspiring fashion founders, designers, boutique owners, existing brands, fashion coaches and consultants, fashion schools, industry professionals, and fashion creators.",
        doList: [
          "Run founder and partnership outreach",
          "Hold discovery calls and pitch Launchpad",
          "Understand founder requirements",
          "Prepare partnership proposals",
          "Handle basic objections and schedule meetings",
          "Support lead conversion and follow-ups",
          "Build relationships across the fashion ecosystem",
        ],
        whoShouldApply:
          "Someone confident in communication, interested in fashion, and comfortable with sales and partnerships.",
      },
      {
        n: 7,
        title: "Fashion Brand Strategy & Research Intern",
        type: "Internship",
        idealFor: "NIFT, Pearl Academy, Fashion Management, Fashion Marketing",
        about:
          "You will help aspiring founders understand what brand they should build and where they can compete.",
        doList: [
          "Fashion market, customer, and competitor research",
          "Category and trend research",
          "Brand and price positioning",
          "Target customer definition",
          "Product assortment research",
          "Market gap identification",
        ],
        calloutLabel: "The core question you will help answer",
        callout: "What brand should we build, for whom, and why?",
        whoShouldApply:
          "Someone analytical who enjoys research and thinking about brands and markets.",
      },
      {
        n: 8,
        title: "Fashion Sourcing & Product Development Intern",
        type: "Internship",
        idealFor:
          "NIFT, Pearl Academy, Fashion Design, Fashion Management, Textile Design",
        about: "You will help founders move from a fashion idea to an actual product.",
        doList: [
          "Fabric, supplier, and manufacturer research",
          "Sampling unit, artisan, and production partner research",
          "MOQ, cost, and production timeline research",
          "Product development coordination",
          "Quality requirements",
          "Supplier database development",
        ],
        calloutLabel: "The core question you will help answer",
        callout: "How do we turn this idea into a real product?",
        whoShouldApply: "Someone interested in how fashion products are actually made.",
      },
      {
        n: 9,
        title: "Fashion Content & Editorial Intern",
        type: "Internship",
        idealFor:
          "NIFT Fashion Communication, Pearl Academy, Journalism, Content, Fashion Marketing",
        about:
          "You will build the editorial and storytelling layer of OGURA and Launchpad.",
        doList: [
          "Write brand stories, founder stories, and designer profiles",
          "Create product stories, fashion editorials, and articles",
          "Develop launch stories and OGURA editorial features",
          "Create Instagram, website, and behind-the-scenes content",
          "Coordinate with creators and photographers",
        ],
        whoShouldApply:
          "Someone who loves fashion and can tell a good story in writing.",
      },
      {
        n: 10,
        title: "Influencer & Creator Partnerships Intern",
        type: "Internship",
        idealFor: "Fashion Communication, Marketing, Social Media",
        about:
          "You will help OGURA and Launchpad brands collaborate with the right creators.",
        doList: [
          "Research fashion creators, influencers, and UGC creators",
          "Find stylists and photographers",
          "Build creator databases",
          "Run outreach and coordinate partnerships",
          "Coordinate campaigns and product collaborations",
          "Support launch campaigns and track creator partnerships",
        ],
        whoShouldApply:
          "Someone who follows fashion creators closely and enjoys building relationships.",
      },
    ],
  },
  {
    heading: "Product, Technology & Growth",
    roles: [
      {
        n: 11,
        title: "Product Management Intern",
        type: "Internship",
        idealFor: "Product Management, B.Tech, BBA, MBA, Entrepreneurship",
        about:
          "You will work with the product team to improve OGURA Marketplace and Launchpad.",
        doList: [
          "User, seller, and founder research",
          "Write PRDs and map user journeys",
          "Define feature requirements",
          "Competitor analysis and product analytics",
          "Work on search, discovery, and recommendations",
          "Support marketplace features, Launchpad workflows, and product experiments",
        ],
        whoShouldApply:
          "Someone who likes understanding problems, breaking them down, and figuring out what should be built.",
      },
      {
        n: 12,
        title: "Product Marketing & Growth Intern",
        type: "Internship",
        idealFor: "Marketing, Product Marketing, BBA, MBA, Growth",
        about:
          "You will help OGURA acquire customers, brands, and fashion founders.",
        doList: [
          "Go-to-market strategy and product positioning",
          "Campaign planning and growth experiments",
          "Acquisition funnels and landing pages",
          "Messaging and conversion optimisation",
          "Seller and founder acquisition",
          "Marketing analytics and campaign analysis",
        ],
        whoShouldApply:
          "Someone creative and data-minded who enjoys growth and marketing.",
      },
      {
        n: 13,
        title: "AI Product / AI Engineering Intern",
        type: "Internship",
        idealFor: "B.Tech CSE, AI, Data Science, ML",
        about:
          "You will help build AI-powered fashion discovery and business tools.",
        doList: [
          "AI product tagging and catalogue enrichment",
          "Fashion attribute extraction",
          "AI recommendations and personalisation",
          "Build AI agents and search intelligence",
          "Automation and AI-powered workflows",
          "Seller and founder tools",
        ],
        whoShouldApply:
          "Someone excited to apply AI to real fashion and commerce problems.",
      },
      {
        n: 14,
        title: "Full-Stack Software Engineering Intern",
        type: "Internship",
        idealFor: "B.Tech CSE, IT, Software Engineering",
        about: "You will help build and improve OGURA's technology platform.",
        doList: [
          "Frontend and backend development",
          "APIs and database systems",
          "Marketplace features and seller dashboards",
          "Launchpad systems and integrations",
          "Performance optimisation, testing, and bug fixing",
        ],
        whoShouldApply: "Someone who loves building and wants to ship real products.",
      },
      {
        n: 15,
        title: "UI/UX Design Intern",
        type: "Internship",
        idealFor:
          "NIFT Fashion Communication, Design, UI/UX, Interaction Design",
        about:
          "You will create better experiences for OGURA customers, sellers, and founders.",
        doList: [
          "Map user journeys and build wireframes",
          "UI design and design systems",
          "Marketplace experience, search, and product pages",
          "Seller and Launchpad onboarding flows",
          "Founder dashboards and mobile experiences",
          "Usability research",
        ],
        whoShouldApply:
          "Someone with an eye for design who cares about how things feel to use.",
      },
    ],
  },
  {
    heading: "Operations & Execution",
    roles: [
      {
        n: 16,
        title: "Project Management & Startup Operations Intern",
        type: "Internship",
        idealFor:
          "BBA, MBA, B.Tech, Product Management, Operations, Entrepreneurship",
        about:
          "You will become the execution layer that connects OGURA's different teams.",
        doList: [
          "Task planning, project tracking, and sprint planning",
          "Team coordination, task assignment, and deadline tracking",
          "Follow-ups, dependency tracking, and identifying blockers",
          "Coordinate between Product, Engineering, Marketing, and Brand",
          "Track Launchpad projects and brand onboarding",
          "Prepare weekly progress reports and documentation",
        ],
        calloutLabel: "The core question you will help answer",
        callout: "Who is doing what, by when, and is it getting done?",
        whoShouldApply:
          "Someone organised, reliable, and good at keeping things moving.",
      },
    ],
  },
];

const whyJoin = [
  {
    icon: Rocket,
    title: "Work on a real startup",
    copy: "You will work on products, brands, and problems that are actually being built and launched.",
  },
  {
    icon: Users,
    title: "Work across teams",
    copy: "Depending on your role, you may collaborate across Fashion, Product, Technology, Marketing, founders, and brands.",
  },
  {
    icon: Gem,
    title: "Build your portfolio",
    copy: "You will work on real projects you can talk about in your portfolio, interviews, and future career.",
  },
  {
    icon: Layers,
    title: "Learn how a startup works",
    copy: "Get exposure to product management, fashion commerce, e-commerce, brand building, AI, marketing, partnerships, and operations.",
  },
  {
    icon: Sparkles,
    title: "Take ownership",
    copy: "We encourage interns to suggest ideas, run experiments, and take responsibility for outcomes rather than simply completing assigned tasks.",
  },
];

const Careers = () => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    portfolio: "",
    message: "",
  });

  useEffect(() => {
    document.title = "Careers & Internships at OGURA | Fashion, Product, Tech";
    const desc =
      "OGURA internships across fashion, brand, Launchpad, product, technology and operations. Explore 16 open roles and apply at careers@ogura.in.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);
  }, []);

  const applyToRole = (role: string) => {
    setForm((f) => ({ ...f, role }));
    document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = applicationSchema.safeParse(form);
    if (!parsed.success) {
      toast({
        title: "Please check the form",
        description: parsed.error.issues[0]?.message ?? "Invalid input",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    const subject = encodeURIComponent(`Application — ${form.role} — ${form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nRole: ${form.role}\nPortfolio / LinkedIn: ${form.portfolio}\n\nAbout me:\n${form.message}\n\n(Please attach your CV before sending.)`
    );
    window.location.href = `mailto:${CAREERS_EMAIL}?subject=${subject}&body=${body}`;
    setTimeout(() => {
      toast({
        title: "Application ready to send",
        description: "Your email client has opened — attach your CV and hit send.",
      });
      setSubmitting(false);
    }, 600);
  };

  return (
    <CustomerLayout>
      {/* Hero */}
      <section className="relative border-b border-border bg-card">
        <div className="container mx-auto px-4 py-20 md:py-28 max-w-3xl text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground mb-6">
            Careers at OGURA
          </p>
          <h1 className="text-4xl md:text-6xl font-light tracking-tight leading-[1.1] mb-8">
            Build the Future of Fashion with Us
          </h1>
          <div className="space-y-5 text-muted-foreground md:text-lg text-left">
            <p>
              OGURA is building a new ecosystem for fashion discovery, independent brands,
              boutique stores, and emerging fashion entrepreneurs. We bring together fashion,
              technology, commerce, content, and brand building to help customers discover unique
              fashion and help new founders build and grow their brands.
            </p>
            <p>
              We are looking for curious and ambitious students and young professionals who want to
              work on real problems, real brands, and real products.
            </p>
            <p>
              At OGURA, interns do more than observe. You will work closely with our founders,
              product team, technology team, fashion brands, and business partners, and you will own
              real work from day one.
            </p>
            <p>
              Most of the openings below are internships. Choose the role that best matches your
              interests and strengths, and apply.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
            <Button
              onClick={() => document.getElementById("roles")?.scrollIntoView({ behavior: "smooth" })}
              className="rounded-full h-12 px-8"
            >
              View open roles
            </Button>
            <a
              href={`mailto:${CAREERS_EMAIL}`}
              className="inline-flex items-center gap-2 text-sm underline underline-offset-4 hover:text-accent transition-colors"
            >
              <Mail className="h-4 w-4" />
              {CAREERS_EMAIL}
            </a>
          </div>
        </div>
      </section>

      {/* Open roles */}
      <section id="roles" className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
        <h2 className="text-2xl md:text-3xl font-light tracking-tight mb-3">Open roles</h2>
        <p className="text-sm text-muted-foreground mb-14">
          Expand a role to read the details, then apply with the form below.
        </p>

        {groups.map((group) => (
          <div key={group.heading} className="mb-16 last:mb-0">
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">{group.heading}</p>
            {group.leadTitle && (
              <h3 className="text-xl md:text-2xl font-light tracking-tight mb-3">
                {group.leadTitle}
              </h3>
            )}
            {group.lead && (
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-2xl">
                {group.lead}
              </p>
            )}

            <Accordion type="single" collapsible className="border-t border-border">
              {group.roles.map((role) => (
                <AccordionItem key={role.n} value={`role-${role.n}`}>
                  <AccordionTrigger className="text-left py-6 hover:no-underline">
                    <div>
                      <span className="text-lg font-light">
                        {role.n}. {role.title}
                      </span>
                      <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground mt-2">
                        {role.type} · Ideal for: {role.idealFor}
                      </p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-6 pb-4 pr-2">
                      <div>
                        <h4 className="text-sm font-medium mb-2">About the role</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {role.about}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-2">What you will do</h4>
                        <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
                          {role.doList.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      {role.callout && (
                        <div className="border-l-2 border-accent pl-4 py-1">
                          <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-1">
                            {role.calloutLabel}
                          </p>
                          <p className="text-sm italic">{role.callout}</p>
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-medium mb-2">Who should apply</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {role.whoShouldApply}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        className="rounded-full px-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          applyToRole(role.title);
                        }}
                      >
                        Apply for this role
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </section>

      {/* Who we look for */}
      <section className="border-y border-border bg-muted/30">
        <div className="container mx-auto px-4 py-16 md:py-24 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-light tracking-tight mb-6">
            Who We Look For
          </h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              You do not need to have worked at a startup before. We value people who are curious,
              proactive, and comfortable taking ownership. We look for good communicators and problem
              solvers who are willing to learn and who enjoy working in a fast-moving environment,
              with a genuine interest in fashion, technology, commerce, or startups.
            </p>
            <p>
              We welcome students from NIFT, Pearl Academy, and other fashion, design, business,
              technology, and management institutions.
            </p>
          </div>
        </div>
      </section>

      {/* Why join */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="text-2xl md:text-3xl font-light tracking-tight text-center mb-12">
          Why Join OGURA?
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {whyJoin.map((v) => (
            <div
              key={v.title}
              className="p-7 rounded-lg border border-border bg-card hover:border-foreground/40 transition-colors"
            >
              <v.icon className="h-5 w-5 mb-5 text-accent" />
              <h3 className="text-base font-medium mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.copy}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Who should apply */}
      <section className="border-t border-border">
        <div className="container mx-auto px-4 py-16 md:py-20 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-light tracking-tight mb-6">
            Who Should Apply?
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Whether you are a fashion student who wants to understand technology, a marketing student
            who wants to work with fashion brands, a product student who wants to build a
            marketplace, a designer who wants to work with startups, an engineer interested in AI and
            fashion, or a student curious about entrepreneurship, there may be a place for you at
            OGURA. Choose the role that best matches your interests and strengths.
          </p>
        </div>
      </section>

      {/* Application form */}
      <section id="apply" className="container mx-auto px-4 pb-16 md:pb-24">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-light tracking-tight mb-3">Apply Now</h2>
          <p className="text-sm text-muted-foreground mb-8">
            Fill this in and we will open your mail client with the details — attach your CV or
            portfolio before sending. You can also email us directly at{" "}
            <a href={`mailto:${CAREERS_EMAIL}`} className="underline underline-offset-4">
              {CAREERS_EMAIL}
            </a>
            .
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-card p-8 rounded-lg border border-border"
          >
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm mb-2">
                  Full Name<span className="text-destructive">*</span>
                </label>
                <Input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your full name"
                  maxLength={100}
                  className="h-12"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">
                  Email<span className="text-destructive">*</span>
                </label>
                <Input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@email.com"
                  maxLength={255}
                  className="h-12"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Phone</label>
                <Input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="Mobile number"
                  maxLength={20}
                  className="h-12"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">
                  Role of interest<span className="text-destructive">*</span>
                </label>
                <Input
                  required
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  placeholder="e.g. Product Management Intern"
                  maxLength={160}
                  className="h-12"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm mb-2">Portfolio / LinkedIn</label>
              <Input
                value={form.portfolio}
                onChange={(e) => setForm({ ...form, portfolio: e.target.value })}
                placeholder="https://"
                maxLength={300}
                className="h-12"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">
                Tell us about you<span className="text-destructive">*</span>
              </label>
              <Textarea
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="What you have worked on, and why OGURA"
                maxLength={1500}
                className="min-h-[150px]"
              />
            </div>
            <Button type="submit" disabled={submitting} className="rounded-full h-12 px-8">
              {submitting ? "Preparing..." : "Submit Application"}
            </Button>
          </form>
        </div>
      </section>
    </CustomerLayout>
  );
};

export default Careers;
