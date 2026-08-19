import { useEffect, useState } from "react";
import { z } from "zod";
import { Mail, Sparkles, Users, Gem, Rocket, Layers } from "lucide-react";
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
  n: string;
  title: string;
  department: string;
  experience?: string;
  preferred?: string;
  about: string;
  doList: string[];
  needList: string[];
  needLabel?: string;
  qualifications?: string;
  note?: string;
  extraLabel?: string;
  extra?: string;
};

type Group = {
  heading: string;
  roles: Role[];
};

const groups: Group[] = [
  {
    heading: "Fashion & Marketplace",
    roles: [
      {
        n: "01",
        title: "Fashion Catalogue & Product Taxonomy Intern",
        department: "Fashion & Product",
        experience: "0–1 year / students welcome",
        preferred: "NIFT, Pearl Academy, or other fashion/design institutions",
        about:
          "You will help build the fashion knowledge layer that powers product discovery on OGURA. Working closely with the Product and Technology teams, you will make sure every product is correctly categorised, tagged, and structured so customers can find it through search, filters, and recommendations.",
        doList: [
          "Analyse fashion brand catalogues and product assortments",
          "Identify the right product categories and subcategories",
          "Classify garments, accessories, and fashion products",
          "Identify fabrics, materials, techniques, and construction details",
          "Identify silhouettes, fits, patterns, colours, and styles",
          "Create and maintain product attributes and tags",
          "Help develop and refine OGURA's fashion taxonomy",
          "Review catalogue information submitted by brands and flag anything missing, inconsistent, or incorrect",
          "Help define search and filter attributes",
          "Provide fashion-domain input for recommendation and discovery systems",
        ],
        needList: [
          "Strong understanding of fashion products and categories",
          "Knowledge of fabrics, silhouettes, and garment terminology",
          "Understanding of fashion merchandising or product classification",
          "Strong research, analytical, and organisational skills",
          "Excellent attention to detail",
          "Good written communication",
          "Basic knowledge of Google Sheets or Excel",
          "Interest in fashion technology and e-commerce",
        ],
        qualifications:
          "Fashion Management, Fashion Design, Fashion Communication, Textile Design, Fashion Technology, or a related programme",
        note:
          "You're a great fit if you can look at any fashion product and instantly understand what it is, which category it belongs to, what attributes describe it, and how a customer would search for it.",
      },
      {
        n: "02",
        title: "Fashion Brand Sourcing Intern",
        department: "Brand Partnerships",
        experience: "0–1 year / students welcome",
        preferred: "Fashion, Marketing, Business, or a related field",
        about:
          "You will help OGURA discover the emerging brands, independent designers, boutique stores, and homegrown labels that could become part of our ecosystem.",
        doList: [
          "Research emerging fashion brands, designers, and Instagram-first businesses",
          "Identify boutique stores and independent labels",
          "Build and maintain qualified brand databases",
          "Research brand positioning, product assortment, and pricing",
          "Identify brands that align with OGURA's marketplace, and spot gaps in our category and brand portfolio",
          "Verify brand information before outreach",
          "Maintain structured sourcing records",
          "Work with the Partnerships team to prioritise leads",
        ],
        needList: [
          "Strong internet and social media research skills",
          "Understanding of the fashion ecosystem",
          "Good working knowledge of Instagram and LinkedIn",
          "Strong attention to detail and an eye for promising brands",
          "Good communication skills",
          "Google Sheets or Excel proficiency",
          "An analytical, organised approach",
        ],
        qualifications:
          "Fashion Management, Fashion Communication, Fashion Marketing, BBA/MBA (Marketing), Business Development, or Entrepreneurship",
      },
      {
        n: "03",
        title: "Brand Partnerships & Seller Onboarding Intern",
        department: "Brand Partnerships",
        experience: "0–1 year / students welcome",
        about:
          "You will help onboard fashion brands, boutique stores, and independent designers onto OGURA Marketplace, guiding them from first conversation to a live storefront.",
        doList: [
          "Connect with fashion founders and boutique owners and introduce OGURA's proposition",
          "Understand each brand's requirements and business model, and qualify potential sellers",
          "Coordinate the onboarding process end to end",
          "Collect brand, business, and catalogue information, and coordinate catalogue submission",
          "Follow up with sellers throughout onboarding",
          "Maintain seller records and CRM information",
          "Surface seller challenges to the internal team",
          "Support seller activation after onboarding",
        ],
        needList: [
          "Excellent verbal and written communication",
          "Confidence speaking with founders and business owners",
          "Relationship-building skills and basic sales or negotiation ability",
          "Strong follow-up discipline",
          "Good organisation and time management",
          "Basic CRM or Google Sheets knowledge",
          "Interest in fashion and e-commerce",
        ],
        qualifications:
          "Fashion Management, Fashion Communication, BBA, Marketing, Business Development, or a related field",
      },
      {
        n: "04",
        title: "Seller Success & Marketplace Operations Intern",
        department: "Marketplace Operations",
        about:
          "You will help brands operate successfully on OGURA after onboarding, keeping their catalogues, inventory, and day-to-day processes running smoothly.",
        doList: [
          "Track seller onboarding completion and activation",
          "Help sellers complete and update their catalogues",
          "Coordinate product information and updates",
          "Support sellers with marketplace processes and handle routine communication",
          "Track catalogue and inventory issues",
          "Collect seller feedback and identify recurring operational problems",
          "Coordinate with the Product and Operations teams",
        ],
        needList: [
          "Strong organisational skills and attention to detail",
          "Excellent communication and a seller-service mindset",
          "Problem-solving ability and good follow-up skills",
          "Google Sheets or Excel",
          "Basic understanding of e-commerce",
        ],
      },
    ],
  },
  {
    heading: "OGURA Launchpad",
    roles: [
      {
        n: "05",
        title: "Fashion Founder Lead Generation & Outreach Intern",
        department: "OGURA Launchpad",
        about:
          "OGURA Launchpad helps aspiring and early-stage founders build, launch, and grow fashion businesses. You will build the top of the Launchpad funnel by finding people who want to start or scale a fashion business.",
        extraLabel: "Who you'll be looking for",
        extra:
          "Aspiring fashion founders, students planning fashion businesses, emerging designers, early-stage entrepreneurs, Instagram-first brands, boutique owners, and existing small fashion businesses looking for support.",
        doList: [
          "Research potential fashion founders and businesses and build qualified lead lists",
          "Conduct Instagram, LinkedIn, and web research to find contact information",
          "Segment leads by business stage and requirements",
          "Run personalised outreach across email, Instagram, and WhatsApp",
          "Qualify leads and track follow-ups",
          "Maintain CRM records",
          "Identify potential Launchpad opportunities and pass qualified leads to the sales team",
        ],
        needList: [
          "Excellent online research skills",
          "Strong communication and the ability to write personalised messages",
          "Basic sales and outreach skills",
          "Understanding of social media",
          "Good organisation and CRM discipline",
          "Persistence, strong follow-up ability, and an eye for high-intent prospects",
          "Interest in entrepreneurship and fashion",
        ],
        qualifications:
          "Fashion Management, Fashion Communication, Marketing, BBA, Business Development, or Entrepreneurship",
      },
      {
        n: "06",
        title: "Fashion Partnerships & Launchpad Sales Intern",
        department: "OGURA Launchpad",
        about:
          "You will help OGURA build partnerships and convert qualified prospects into Launchpad customers and ecosystem partners.",
        doList: [
          "Run founder and partner outreach, and speak with aspiring founders and existing businesses",
          "Understand founder requirements and challenges, and present relevant Launchpad solutions",
          "Schedule and support discovery calls",
          "Prepare partnership proposals and follow up with prospects",
          "Handle initial objections and questions",
          "Coordinate with internal teams on proposals",
          "Build relationships with fashion coaches, consultants, and industry partners",
          "Support lead conversion and partnership development",
        ],
        needList: [
          "Strong communication and presentation skills",
          "Confidence speaking with founders and a genuine sales mindset",
          "Relationship management, persuasion, and negotiation ability",
          "Strong follow-up discipline",
          "Understanding of fashion and entrepreneurship",
          "Good CRM and documentation habits",
          "Ability to work independently",
        ],
      },
      {
        n: "07",
        title: "Fashion Brand Strategy & Research Intern",
        department: "OGURA Launchpad",
        preferred: "NIFT / Pearl Academy — Fashion Management / Fashion Marketing",
        about:
          "You will help aspiring founders decide what brand to build, who to build it for, and how to position it in the market.",
        doList: [
          "Conduct fashion market and customer segment research",
          "Analyse competitors, categories, and trends",
          "Identify market gaps and analyse pricing and positioning",
          "Research product assortments",
          "Support brand positioning exercises and founder strategy sessions",
          "Develop competitor and category reports",
          "Translate research into clear, actionable recommendations",
        ],
        needList: [
          "Fashion market knowledge and understanding of consumer behaviour",
          "Strong research, competitive analysis, and strategic thinking skills",
          "Presentation and written communication skills",
          "Excel, Google Sheets, and PowerPoint",
        ],
      },
      {
        n: "08",
        title: "Fashion Sourcing & Product Development Intern",
        department: "OGURA Launchpad",
        preferred:
          "NIFT / Pearl Academy — Fashion Design / Fashion Management / Textile Design",
        about: "You will help founders move from a product idea to a manufacturable fashion product.",
        doList: [
          "Research fabrics and materials",
          "Identify suppliers, manufacturers, sampling units, and production partners",
          "Build and maintain supplier databases",
          "Research MOQ and production requirements",
          "Compare supplier capabilities, timelines, and estimated costs",
          "Assist with product development coordination",
          "Support quality and production research",
        ],
        needList: [
          "Knowledge of fabrics, materials, and garment production",
          "Understanding of fashion product development",
          "Strong research and supplier-research skills",
          "Attention to detail",
          "Communication and coordination skills",
          "Excel or Google Sheets",
        ],
      },
    ],
  },
  {
    heading: "Content & Editorial",
    roles: [
      {
        n: "09",
        title: "Fashion Content & Editorial Intern",
        department: "Content & Editorial",
        about:
          "You will help build a strong editorial and storytelling ecosystem around OGURA's brands, founders, and products.",
        doList: [
          "Write brand stories, founder profiles, and product stories",
          "Research and write fashion articles",
          "Develop editorial concepts, website content, and social media content",
          "Support OGURA editorial features",
          "Coordinate with brands and founders for stories",
          "Research fashion trends and topics",
          "Support launch campaigns and editorial calendars",
        ],
        needList: [
          "Excellent writing and storytelling",
          "Fashion awareness and editorial judgement",
          "Research ability and creative thinking",
          "Understanding of social media",
          "Strong attention to detail",
        ],
        qualifications:
          "Fashion Communication, Journalism, English, Marketing, Fashion Design, or a related field",
      },
      {
        n: "10",
        title: "Influencer & Creator Partnerships Intern",
        department: "Marketing & Partnerships",
        about:
          "You will help OGURA and Launchpad brands discover and collaborate with the right fashion creators.",
        doList: [
          "Research fashion influencers and creators, including micro and niche creators",
          "Build and maintain creator databases",
          "Research UGC creators, stylists, and photographers",
          "Run partnership outreach and coordinate collaborations",
          "Support campaign execution and track partnerships",
          "Maintain creator relationships",
        ],
        needList: [
          "Strong social media knowledge and understanding of influencer marketing",
          "Research, communication, and negotiation skills",
          "Relationship management and organisation",
          "Creative thinking",
        ],
      },
    ],
  },
  {
    heading: "Product & Growth",
    roles: [
      {
        n: "11",
        title: "Product Management Intern",
        department: "Product",
        about: "You will work with the Product team to improve OGURA Marketplace and Launchpad.",
        doList: [
          "Conduct user and seller research and understand customer and founder problems",
          "Help write PRDs and define user journeys",
          "Conduct competitor research",
          "Translate problems into product requirements",
          "Analyse product data and support experiments",
          "Work with Design and Engineering",
          "Help improve marketplace search, discovery, and recommendations",
          "Document product decisions",
        ],
        needList: [
          "Product thinking and problem-solving",
          "User research and analytical skills",
          "Good written communication",
          "Basic understanding of product development",
          "Google Sheets or Excel",
          "Familiarity with Notion, Jira, or Linear is a plus",
          "Ability to work cross-functionally",
        ],
        qualifications:
          "Product Management, B.Tech, BBA, MBA, Entrepreneurship, or a related field",
      },
      {
        n: "12",
        title: "Product Marketing & Growth Intern",
        department: "Growth & Marketing",
        about: "You will help OGURA acquire customers, fashion brands, and aspiring founders.",
        doList: [
          "Support go-to-market strategy and product positioning",
          "Create acquisition campaigns and growth experiments",
          "Conduct market research",
          "Analyse acquisition funnels and campaign performance",
          "Support landing-page optimisation",
          "Develop marketing messaging",
          "Support seller and Launchpad founder acquisition",
        ],
        needList: [
          "Marketing fundamentals and a growth mindset",
          "Data analysis and market research skills",
          "Copywriting and communication skills",
          "Creative thinking",
          "Google Sheets or Excel",
          "Familiarity with analytics tools is a plus",
        ],
      },
    ],
  },
  {
    heading: "Technology",
    roles: [
      {
        n: "13",
        title: "AI Product / AI Engineering Intern",
        department: "Technology / AI",
        about:
          "You will help build AI-powered capabilities for fashion discovery, product understanding, and business automation.",
        doList: [
          "Assist with AI-based product tagging and catalogue enrichment workflows",
          "Work on fashion attribute extraction",
          "Support recommendation systems and search intelligence",
          "Assist with AI agents and automation",
          "Build internal AI tools and experiment with LLM-based workflows",
          "Collaborate with Product and Engineering",
        ],
        needList: [
          "Python and/or other relevant languages",
          "Fundamentals of AI/ML and LLM concepts",
          "APIs and data handling",
          "Basic database knowledge",
          "Problem-solving and the ability to experiment and learn quickly",
          "Genuine interest in AI applications",
        ],
        qualifications:
          "B.Tech/B.E. in Computer Science, AI, Data Science, IT, or a related field",
      },
      {
        n: "14",
        title: "Full-Stack Software Engineering Intern",
        department: "Engineering",
        about:
          "You will work with the engineering team to build and improve OGURA's Marketplace and Launchpad platforms.",
        doList: [
          "Develop frontend and backend features",
          "Build and integrate APIs",
          "Work with databases",
          "Improve seller dashboards and build Launchpad workflows",
          "Implement marketplace functionality",
          "Fix bugs, write and maintain code, and test features",
          "Improve application performance",
        ],
        needLabel: "What you'll need (depending on the project)",
        needList: [
          "HTML/CSS, JavaScript/TypeScript, React, Node.js",
          "REST APIs and databases",
          "Git/GitHub",
          "Debugging and problem-solving",
          "Experience with Supabase, Lovable, Shopify, or similar platforms is a plus",
        ],
      },
      {
        n: "15",
        title: "UI/UX Design Intern",
        department: "Design",
        about:
          "You will help design intuitive experiences for OGURA's customers, sellers, and fashion founders.",
        doList: [
          "Create user flows and wireframes",
          "Design interfaces and improve product discovery",
          "Design search and filtering experiences and improve product pages",
          "Design seller onboarding and Launchpad workflows",
          "Create founder dashboards",
          "Conduct usability research",
          "Maintain design consistency",
        ],
        needList: [
          "Figma and strong UI/UX fundamentals",
          "User-centred design, wireframing, and prototyping",
          "Visual design and design systems knowledge",
          "Strong attention to detail",
          "Ability to explain your design decisions",
        ],
      },
    ],
  },
  {
    heading: "Operations",
    roles: [
      {
        n: "16",
        title: "Project Management & Startup Operations Intern",
        department: "Operations",
        about:
          "You will help OGURA execute projects across Product, Engineering, Design, Marketing, Brand Partnerships, and Launchpad. This role is ideal for someone who enjoys organising people, tracking tasks, and making sure work actually gets done.",
        doList: [
          "Maintain project plans and task boards",
          "Coordinate tasks across teams and track deadlines and deliverables",
          "Assign and follow up on tasks where appropriate",
          "Run project check-ins and track blockers and dependencies",
          "Coordinate Product, Engineering, and Design",
          "Track brand onboarding and Launchpad projects",
          "Maintain project documentation and prepare weekly status reports",
          "Escalate delays and make sure agreed actions are completed",
        ],
        needList: [
          "Excellent organisation and strong communication",
          "Follow-up discipline, time management, and an ownership mindset",
          "Problem-solving and the ability to coordinate multiple people",
          "Attention to detail",
          "Proficiency with Notion, Jira, Trello, Asana, or similar tools",
          "Google Sheets or Excel",
        ],
        note:
          "You're a great fit if you naturally think: What needs to happen, who owns it, what's the deadline, and what's blocking it? Prior experience managing college projects, hackathons, student organisations, or startup teams is a strong advantage.",
      },
    ],
  },
];

const expectations = [
  {
    icon: Rocket,
    title: "Real ownership",
    copy: "You'll work on real projects, not simulated internship assignments.",
  },
  {
    icon: Users,
    title: "Cross-functional exposure",
    copy: "Depending on your role, you may collaborate across Fashion, Product, Technology, Marketing, Brands, Founders, and Creators.",
  },
  {
    icon: Layers,
    title: "A true startup environment",
    copy: "OGURA is early-stage, so responsibilities evolve as the company grows. Interns who show strong ownership are given more.",
  },
  {
    icon: Gem,
    title: "A portfolio worth showing",
    copy: "Your work can contribute to real products, brand launches, marketplace operations, research, and growth initiatives.",
  },
];

const eligibility = [
  "Be pursuing a relevant degree or diploma, or be a recent graduate",
  "Show genuine interest in the role they're applying for",
  "Have strong communication and collaboration skills",
  "Be comfortable working remotely and managing their work independently",
  "Be willing to learn new tools and processes",
  "Demonstrate ownership and accountability",
];

const workMode = [
  "Reliable internet access",
  "A laptop suitable for your role",
  "Availability for scheduled team meetings",
  "Comfort with online collaboration tools",
  "The ability to manage your assigned work independently",
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
      "Remote OGURA internships across fashion, marketplace, Launchpad, content, product, technology and operations. 16 open roles — apply at careers@ogura.in.";
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
          <p className="text-xs uppercase tracking-[0.35em] text-brand mb-6">
            Careers at OGURA
          </p>
          <h1 className="text-4xl md:text-6xl font-light tracking-tight leading-[1.1] mb-8">
            Build the Future of{" "}
            <span className="text-brand-gradient font-normal">Fashion Commerce</span>
          </h1>
          <div className="mx-auto mb-8 h-px w-24 brand-rule" />
          <div className="space-y-5 text-muted-foreground md:text-lg text-left">
            <p>
              OGURA is building a fashion-tech ecosystem that connects independent brands, boutique
              stores, designers, consumers, and aspiring fashion entrepreneurs in one place.
            </p>
            <p>
              We run two platforms. OGURA Marketplace powers fashion discovery and commerce. OGURA
              Launchpad helps aspiring and early-stage founders build, launch, and grow their fashion
              businesses.
            </p>
            <p>
              We are looking for ambitious students and early-career professionals who want to work on
              real products, real brands, and real business problems.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mt-10">
            {["Remote", "Internship", "Flexible hours"].map((chip) => (
              <span
                key={chip}
                className="text-[11px] uppercase tracking-[0.2em] px-4 py-2 rounded-full border border-brand/40 bg-brand-soft text-brand"
              >
                {chip}
              </span>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-6 max-w-xl mx-auto">
            <span className="text-foreground">Who can apply:</span> Students, recent graduates, and
            early-career candidates with relevant skills and a genuine interest in their chosen
            function.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
            <Button
              onClick={() => document.getElementById("roles")?.scrollIntoView({ behavior: "smooth" })}
              className="rounded-full h-12 px-8"
            >
              Explore roles
            </Button>
            <a
              href={`mailto:${CAREERS_EMAIL}`}
              className="inline-flex items-center gap-2 text-sm underline underline-offset-4 hover:text-brand transition-colors"
            >
              <Mail className="h-4 w-4" />
              {CAREERS_EMAIL}
            </a>
          </div>
        </div>
      </section>

      {/* Open roles */}
      <section id="roles" className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
        <h2 className="text-2xl md:text-3xl font-light tracking-tight text-brand-gradient mb-3">Open roles</h2>
        <p className="text-sm text-muted-foreground mb-14">
          Explore a role → read the job description → apply.
        </p>

        {groups.map((group) => (
          <div key={group.heading} className="mb-16 last:mb-0">
            <p className="text-xs uppercase tracking-[0.3em] text-brand mb-4">{group.heading}</p>

            <Accordion type="single" collapsible className="border-t border-border">
              {group.roles.map((role) => (
                <AccordionItem key={role.n} value={`role-${role.n}`}>
                  <AccordionTrigger className="text-left py-6 hover:no-underline">
                    <div>
                      <span className="text-lg font-light">
                        {role.n} — {role.title}
                      </span>
                      <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground mt-2">
                        {role.department} · Remote · Internship
                        {role.experience ? ` · ${role.experience}` : ""}
                      </p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-6 pb-4 pr-2">
                      {role.preferred && (
                        <p className="text-xs text-muted-foreground">
                          <span className="uppercase tracking-[0.15em]">Preferred background:</span>{" "}
                          {role.preferred}
                        </p>
                      )}
                      <div>
                        <h4 className="text-sm font-medium mb-2">About the role</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{role.about}</p>
                      </div>
                      {role.extra && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">{role.extraLabel}</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {role.extra}
                          </p>
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-medium mb-2">What you'll do</h4>
                        <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
                          {role.doList.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-2">
                          {role.needLabel ?? "What you'll need"}
                        </h4>
                        <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
                          {role.needList.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      {role.qualifications && (
                        <p className="text-sm text-muted-foreground">
                          <span className="text-foreground">Preferred qualifications:</span>{" "}
                          {role.qualifications}
                        </p>
                      )}
                      {role.note && (
                        <div className="border-l-2 border-brand pl-4 py-1">
                          <p className="text-sm italic text-muted-foreground">{role.note}</p>
                        </div>
                      )}
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

      {/* What you can expect */}
      <section className="border-y border-border bg-muted/30">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <h2 className="text-2xl md:text-3xl font-light tracking-tight text-brand-gradient text-center mb-12">
            What You Can Expect at OGURA
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {expectations.map((v) => (
              <div
                key={v.title}
                className="p-7 rounded-lg border border-border bg-card hover:border-foreground/40 transition-colors"
              >
                <v.icon className="h-5 w-5 mb-5 text-brand" />
                <h3 className="text-base font-medium mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility + work mode */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div>
            <h2 className="text-2xl md:text-3xl font-light tracking-tight text-brand-gradient mb-6">
              General Eligibility
            </h2>
            <p className="text-sm text-muted-foreground mb-4">Candidates should:</p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
              {eligibility.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground mt-5">
              Prior internship or startup experience is an advantage but not mandatory, unless stated
              in the role.
            </p>
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-light tracking-tight text-brand-gradient mb-6">
              Work Mode: 100% Remote
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              All OGURA internships are fully remote. You'll need:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
              {workMode.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Hiring philosophy */}
      <section className="border-t border-border">
        <div className="container mx-auto px-4 py-16 md:py-20 max-w-3xl text-center">
          <Sparkles className="h-5 w-5 mx-auto mb-6 text-brand" />
          <h2 className="text-2xl md:text-3xl font-light tracking-tight text-brand-gradient mb-6">
            Our Hiring Philosophy
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            We don't hire on the basis of college, grades, or company names alone. We look for
            curiosity, ownership, execution, communication, and the ability to learn.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-4">
            If you can solve problems, take responsibility, and learn quickly, we want to hear from
            you.
          </p>
        </div>
      </section>

      {/* Application form */}
      <section id="apply" className="container mx-auto px-4 pb-16 md:pb-24">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-light tracking-tight text-brand-gradient mb-3">Apply Now</h2>
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
