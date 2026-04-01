import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { SellerDashboardShowcase } from "@/components/seller-dashboard/SellerDashboardShowcase";

const JoinUs = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-background via-muted/30 to-background" />

        <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
            <ShieldCheck className="w-4 h-4" />
            Limited Onboarding • Quality First
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight animate-fade-in">
            Join Ogura as an Independent Fashion Designer or Fashion Studio Owner
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in">
            Ogura is a marketplace for custom fashion where designers can manage their store and sell custom outfits.
          </p>

          <div className="animate-fade-in">
            <Link to="/join/apply">
              <Button size="lg" className="px-8 py-6 text-lg font-semibold group hover:scale-105 transition-transform duration-300">
                Apply to Join Ogura
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
          </div>

          <p className="text-sm text-muted-foreground mt-4 animate-fade-in">
            We review each application individually. Not all applications are accepted.
          </p>
        </div>
      </section>

      {/* Seller Dashboard */}
      <section className="pb-8 px-4 md:px-6">
        <div className="container mx-auto max-w-[1400px]">
          <SellerDashboardShowcase />
        </div>
      </section>
    </div>
  );
};

export default JoinUs;
