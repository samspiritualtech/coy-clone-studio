import { LuxuryHeader } from "@/components/LuxuryHeader";
import { LuxuryFooter } from "@/components/LuxuryFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { JourneyTimeline } from "@/components/join-us/JourneyTimeline";
import { 
  Users, 
  CheckCircle2,
  Building2,
  Palette,
  Eye,
  ShieldCheck,
  ArrowRight,
  MessageSquare
} from "lucide-react";

const AnimatedSection = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const { ref, isVisible } = useScrollAnimation(0.1);
  return (
    <div 
      ref={ref} 
      className={`transition-all duration-700 ease-out ${className}`}
      style={{ 
        opacity: isVisible ? 1 : 0, 
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
};


const JoinUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <LuxuryHeader />
      
      <main>
        {/* Hero Section with Background Image */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80"
              alt="Fashion Designer at Work"
              className="w-full h-full object-cover animate-kenburns"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/80" />
          </div>
          
          <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
            <div 
              className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in"
              style={{ animationDelay: '200ms' }}
            >
              <ShieldCheck className="w-4 h-4" />
              Limited Onboarding • Quality First
            </div>
            
            <h1 
              className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight animate-fade-in"
              style={{ animationDelay: '400ms' }}
            >
              Join Ogura as an Independent Fashion Designer or Fashion Studio Owner
            </h1>
            
            <p 
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in"
              style={{ animationDelay: '600ms' }}
            >
              Ogura is a marketplace for custom fashion. Customers come here to find designers, discuss their requirements, and order custom-made outfits. We provide the platform. You provide the craft.
            </p>
            
            <div className="animate-fade-in" style={{ animationDelay: '800ms' }}>
              <Button size="lg" className="px-8 py-6 text-lg font-semibold group hover:scale-105 transition-transform duration-300">
                Apply to Join Ogura
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground mt-4 animate-fade-in" style={{ animationDelay: '1000ms' }}>
              We review each application individually. Not all applications are accepted.
            </p>
          </div>
        </section>

        {/* How It Works - Journey Timeline */}
        <JourneyTimeline />

        {/* Your Journey on Ogura */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 max-w-5xl">
            <AnimatedSection className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Your Journey on Ogura
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Two distinct paths, based on how you operate.
              </p>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Independent Fashion Designer */}
              <AnimatedSection delay={0}>
                <Card className="h-full overflow-hidden group hover:shadow-xl transition-all duration-500">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1537832816519-689ad163d933?w=800&q=80"
                      alt="Fashion Designer Sketching"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                    <div className="absolute bottom-4 left-6">
                      <div className="w-14 h-14 bg-primary/90 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <Palette className="w-7 h-7 text-primary-foreground" />
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-8">
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      Independent Fashion Designer
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Digital design & consulting only
                    </p>

                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-foreground mb-3">What You Do</h4>
                        <ul className="space-y-2">
                          {[
                            "Design custom outfits based on customer requirements",
                            "Provide consultation on fabric, fit, and styling",
                            "Share design files and specifications",
                            "Coordinate with production partners if needed"
                          ].map((item, index) => (
                            <li 
                              key={index} 
                              className="flex items-start gap-2 text-muted-foreground group/item"
                            >
                              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform duration-200" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-foreground mb-3">What Ogura Provides</h4>
                        <ul className="space-y-2">
                          {[
                            "A structured profile beyond Instagram",
                            "Lookbook hosting and discovery",
                            "Access to production partners (optional)",
                            "Payment security and order management"
                          ].map((item, index) => (
                            <li 
                              key={index} 
                              className="flex items-start gap-2 text-muted-foreground"
                            >
                              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>

              {/* Fashion Studio Owner */}
              <AnimatedSection delay={200}>
                <Card className="h-full overflow-hidden group hover:shadow-xl transition-all duration-500">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80"
                      alt="Fashion Studio"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                    <div className="absolute bottom-4 left-6">
                      <div className="w-14 h-14 bg-primary/90 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <Building2 className="w-7 h-7 text-primary-foreground" />
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-8">
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      Fashion Studio Owner
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Design + stitch at your own studio
                    </p>

                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-foreground mb-3">What You Do</h4>
                        <ul className="space-y-2">
                          {[
                            "Design and produce outfits end-to-end",
                            "Handle fabric sourcing and stitching",
                            "Manage quality control at your studio",
                            "Dispatch finished outfits to customers"
                          ].map((item, index) => (
                            <li 
                              key={index} 
                              className="flex items-start gap-2 text-muted-foreground"
                            >
                              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-foreground mb-3">What Ogura Provides</h4>
                        <ul className="space-y-2">
                          {[
                            "Visibility to customers across India",
                            "Professional lookbook and studio profile",
                            "Logistics and shipping coordination",
                            "Trust signals and verified studio badge"
                          ].map((item, index) => (
                            <li 
                              key={index} 
                              className="flex items-start gap-2 text-muted-foreground"
                            >
                              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Value Proposition */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 max-w-4xl">
            <AnimatedSection className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Why Designers Choose Ogura
              </h2>
            </AnimatedSection>

            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { icon: Users, title: "Structured Profile", description: "Not a social feed. A professional portfolio with clear categories, pricing, and specialisation." },
                { icon: Eye, title: "Lookbook Showcase", description: "Display your best work in a curated gallery. Customers browse by style, not by algorithm." },
                { icon: ShieldCheck, title: "Trust Beyond Instagram", description: "Verified profiles, reviews, and a structured order process build credibility." },
                { icon: MessageSquare, title: "Clear Custom-Order Process", description: "From discussion to design to delivery — every step is documented and trackable." }
              ].map((item, index) => (
                <AnimatedSection key={index} delay={index * 100}>
                  <div className="flex gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors duration-300 group cursor-default">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors duration-300">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA with Background */}
        <section className="py-16 md:py-20 relative overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920&q=80"
              alt="Fashion Fabric"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-primary/90" />
          </div>
          
          <AnimatedSection className="container mx-auto px-4 max-w-2xl text-center relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
              Ready to Join?
            </h2>
            <p className="text-primary-foreground/80 mb-8">
              Submit your application. We review each profile individually and respond within 5 working days.
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              className="px-8 py-6 text-lg font-semibold group hover:scale-105 transition-transform duration-300"
            >
              Apply to Join Ogura
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </AnimatedSection>
        </section>
      </main>

      <LuxuryFooter />
    </div>
  );
};

export default JoinUs;
