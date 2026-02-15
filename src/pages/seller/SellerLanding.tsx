import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  TrendingUp,
  Users,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Store,
  BarChart3,
  Truck,
} from "lucide-react";

const benefits = [
  {
    icon: Users,
    title: "Reach Millions",
    description: "Access Ogura's growing customer base of fashion-forward shoppers across India.",
  },
  {
    icon: BarChart3,
    title: "Seller Dashboard",
    description: "Manage products, track orders, and monitor sales with our intuitive dashboard.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Tools",
    description: "Leverage AI for product photography, descriptions, and customer matching.",
  },
  {
    icon: Truck,
    title: "Logistics Support",
    description: "We handle shipping, returns, and customer support so you can focus on design.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    description: "Get paid reliably with our transparent commission structure and weekly payouts.",
  },
  {
    icon: Store,
    title: "Brand Storefront",
    description: "Get your own branded page on Ogura to showcase your collections.",
  },
];

const testimonials = [
  {
    name: "Priya Sharma",
    brand: "Priya Couture",
    quote: "Ogura helped me reach customers I never could have on my own. My sales grew 3x in the first quarter.",
    avatar: "PS",
  },
  {
    name: "Rajesh Mehra",
    brand: "RM Studios",
    quote: "The seller dashboard is incredibly easy to use. I spend less time on admin and more on designing.",
    avatar: "RM",
  },
  {
    name: "Anita Kapoor",
    brand: "AK Fashion House",
    quote: "The AI tools for product photography saved me thousands. Truly a game-changer for independent designers.",
    avatar: "AK",
  },
];

const SellerLanding = () => {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <TrendingUp className="h-4 w-4" />
              Join India's Fastest Growing Fashion Platform
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Grow Your Fashion Brand
              <br />
              <span className="text-primary">with Ogura</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
              Partner with Ogura to showcase your designs to millions of customers.
              Zero upfront costs. Simple onboarding. Start selling in 48 hours.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="gap-2 text-base px-8">
                <Link to="/seller/login">
                  Apply as Partner
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base px-8">
                <Link to="/seller/login">Seller Login</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Commission */}
      <section className="border-y bg-muted/30">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-3">Transparent Commission</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Simple, fair pricing with no hidden fees.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <Card className="text-center">
              <CardContent className="pt-8 pb-6">
                <p className="text-4xl font-bold text-primary mb-2">15%</p>
                <p className="font-medium text-foreground">Standard</p>
                <p className="text-sm text-muted-foreground mt-1">For new sellers</p>
              </CardContent>
            </Card>
            <Card className="text-center border-primary/50 shadow-md">
              <CardContent className="pt-8 pb-6">
                <p className="text-4xl font-bold text-primary mb-2">12%</p>
                <p className="font-medium text-foreground">Growth</p>
                <p className="text-sm text-muted-foreground mt-1">₹1L+ monthly sales</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-8 pb-6">
                <p className="text-4xl font-bold text-primary mb-2">10%</p>
                <p className="font-medium text-foreground">Premium</p>
                <p className="text-sm text-muted-foreground mt-1">₹5L+ monthly sales</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-3">Why Sell on Ogura?</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Everything you need to grow your fashion business online.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {benefits.map((b) => (
            <Card key={b.title} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                  <b.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{b.title}</h3>
                <p className="text-sm text-muted-foreground">{b.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t bg-muted/20">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-3">Trusted by Sellers</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t) => (
              <Card key={t.name}>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground italic mb-4">"{t.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.brand}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Start Selling?</h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          Join hundreds of fashion brands already growing with Ogura.
        </p>
        <Button asChild size="lg" className="gap-2 text-base px-8">
          <Link to="/seller/login">
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </section>
    </div>
  );
};

export default SellerLanding;
