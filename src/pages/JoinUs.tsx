import { Link } from "react-router-dom";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { LuxuryFooter } from "@/components/LuxuryFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { 
  Users, 
  Upload, 
  MessageSquare, 
  Sparkles, 
  Package, 
  CheckCircle2,
  Building2,
  Palette,
  Eye,
  ShieldCheck,
  ArrowRight
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

const StepCard = ({ step, icon: Icon, title, description, delay }: { step: number; icon: any; title: string; description: string; delay: number }) => {
  const { ref, isVisible } = useScrollAnimation(0.1);
  return (
    <Card 
      ref={ref}
      className="border-l-4 border-l-primary group hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
      style={{ 
        opacity: isVisible ? 1 : 0, 
        transform: isVisible ? 'translateX(0)' : 'translateX(-30px)',
        transitionDelay: `${delay}ms`,
        transitionDuration: '500ms'
      }}
    >
      <CardContent className="p-6 flex gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div>
          <div className="text-sm font-medium text-primary mb-1">Step {step}</div>
          <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
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

        {/* How It Works */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 max-w-5xl">
            <AnimatedSection className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                How It Works
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                A step-by-step process from listing your work to delivering custom outfits.
              </p>
            </AnimatedSection>

            <div className="grid gap-6 md:gap-8">
              <StepCard 
                step={1}
                icon={Upload}
                title="Create Your Profile & Lookbook"
                description="Set up a structured profile with your specialisation, price range, and location. Upload your lookbook — past work, signature pieces, and design samples. This is not a social feed. It is a professional portfolio."
                delay={0}
              />
              <StepCard 
                step={2}
                icon={Eye}
                title="Customers Discover You"
                description="Customers browse by category, occasion, or city. They view your lookbook, read your profile, and understand your style. If interested, they initiate a design discussion."
                delay={100}
              />
              <StepCard 
                step={3}
                icon={MessageSquare}
                title="Design Discussion"
                description="You and the customer discuss requirements — fabric, colour, embroidery, silhouette. This happens through Ogura's messaging system. You clarify scope, share references, and align on expectations."
                delay={200}
              />
              <StepCard 
                step={4}
                icon={Sparkles}
                title="AI Visualisation (Optional)"
                description="Ogura offers AI-generated previews to help customers visualise their outfit before production. This is a communication tool, not a design tool. You remain in control of the actual design. The AI shows an approximate representation based on inputs."
                delay={300}
              />
              <StepCard 
                step={5}
                icon={Package}
                title="Production & Delivery"
                description="Once the customer confirms, production begins. If you are a studio owner, you stitch and dispatch from your premises. If you are an independent designer, you work with the customer or Ogura's partner production units. Delivery is tracked through Ogura."
                delay={400}
              />
            </div>
          </div>
        </section>

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
