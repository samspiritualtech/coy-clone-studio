import { Link } from "react-router-dom";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { LuxuryFooter } from "@/components/LuxuryFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

const JoinUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <LuxuryHeader />
      
      <main>
        {/* Hero Section */}
        <section className="relative py-20 md:py-28 bg-gradient-to-b from-muted/50 to-background">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <ShieldCheck className="w-4 h-4" />
              Limited Onboarding • Quality First
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              Join Ogura as an Independent Fashion Designer or Fashion Studio Owner
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Ogura is a marketplace for custom fashion. Customers come here to find designers, discuss their requirements, and order custom-made outfits. We provide the platform. You provide the craft.
            </p>
            
            <Button size="lg" className="px-8 py-6 text-lg font-semibold">
              Apply to Join Ogura
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            
            <p className="text-sm text-muted-foreground mt-4">
              We review each application individually. Not all applications are accepted.
            </p>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                How It Works
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                A step-by-step process from listing your work to delivering custom outfits.
              </p>
            </div>

            <div className="grid gap-6 md:gap-8">
              {/* Step 1 */}
              <Card className="border-l-4 border-l-primary">
                <CardContent className="p-6 flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Upload className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-primary mb-1">Step 1</div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Create Your Profile & Lookbook
                    </h3>
                    <p className="text-muted-foreground">
                      Set up a structured profile with your specialisation, price range, and location. Upload your lookbook — past work, signature pieces, and design samples. This is not a social feed. It is a professional portfolio.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Step 2 */}
              <Card className="border-l-4 border-l-primary">
                <CardContent className="p-6 flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Eye className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-primary mb-1">Step 2</div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Customers Discover You
                    </h3>
                    <p className="text-muted-foreground">
                      Customers browse by category, occasion, or city. They view your lookbook, read your profile, and understand your style. If interested, they initiate a design discussion.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Step 3 */}
              <Card className="border-l-4 border-l-primary">
                <CardContent className="p-6 flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-primary mb-1">Step 3</div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Design Discussion
                    </h3>
                    <p className="text-muted-foreground">
                      You and the customer discuss requirements — fabric, colour, embroidery, silhouette. This happens through Ogura's messaging system. You clarify scope, share references, and align on expectations.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Step 4 */}
              <Card className="border-l-4 border-l-primary">
                <CardContent className="p-6 flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-primary mb-1">Step 4</div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      AI Visualisation (Optional)
                    </h3>
                    <p className="text-muted-foreground">
                      Ogura offers AI-generated previews to help customers visualise their outfit before production. This is a communication tool, not a design tool. You remain in control of the actual design. The AI shows an approximate representation based on inputs.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Step 5 */}
              <Card className="border-l-4 border-l-primary">
                <CardContent className="p-6 flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Package className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-primary mb-1">Step 5</div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Production & Delivery
                    </h3>
                    <p className="text-muted-foreground">
                      Once the customer confirms, production begins. If you are a studio owner, you stitch and dispatch from your premises. If you are an independent designer, you work with the customer or Ogura's partner production units. Delivery is tracked through Ogura.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Your Journey on Ogura */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Your Journey on Ogura
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Two distinct paths, based on how you operate.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Independent Fashion Designer */}
              <Card className="h-full">
                <CardContent className="p-8">
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                    <Palette className="w-7 h-7 text-primary" />
                  </div>
                  
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
                        <li className="flex items-start gap-2 text-muted-foreground">
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span>Design custom outfits based on customer requirements</span>
                        </li>
                        <li className="flex items-start gap-2 text-muted-foreground">
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span>Provide consultation on fabric, fit, and styling</span>
                        </li>
                        <li className="flex items-start gap-2 text-muted-foreground">
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span>Share design files and specifications</span>
                        </li>
                        <li className="flex items-start gap-2 text-muted-foreground">
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span>Coordinate with production partners if needed</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-foreground mb-3">What Ogura Provides</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2 text-muted-foreground">
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span>A structured profile beyond Instagram</span>
                        </li>
                        <li className="flex items-start gap-2 text-muted-foreground">
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span>Lookbook hosting and discovery</span>
                        </li>
                        <li className="flex items-start gap-2 text-muted-foreground">
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span>Access to production partners (optional)</span>
                        </li>
                        <li className="flex items-start gap-2 text-muted-foreground">
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span>Payment security and order management</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Fashion Studio Owner */}
              <Card className="h-full">
                <CardContent className="p-8">
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                    <Building2 className="w-7 h-7 text-primary" />
                  </div>
                  
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
                        <li className="flex items-start gap-2 text-muted-foreground">
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span>Design and produce outfits end-to-end</span>
                        </li>
                        <li className="flex items-start gap-2 text-muted-foreground">
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span>Handle fabric sourcing and stitching</span>
                        </li>
                        <li className="flex items-start gap-2 text-muted-foreground">
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span>Manage quality control at your studio</span>
                        </li>
                        <li className="flex items-start gap-2 text-muted-foreground">
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span>Dispatch finished outfits to customers</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-foreground mb-3">What Ogura Provides</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2 text-muted-foreground">
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span>Visibility to customers across India</span>
                        </li>
                        <li className="flex items-start gap-2 text-muted-foreground">
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span>Professional lookbook and studio profile</span>
                        </li>
                        <li className="flex items-start gap-2 text-muted-foreground">
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span>Logistics and shipping coordination</span>
                        </li>
                        <li className="flex items-start gap-2 text-muted-foreground">
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span>Trust signals and verified studio badge</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Value Proposition */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Why Designers Choose Ogura
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Structured Profile</h3>
                  <p className="text-sm text-muted-foreground">
                    Not a social feed. A professional portfolio with clear categories, pricing, and specialisation.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Lookbook Showcase</h3>
                  <p className="text-sm text-muted-foreground">
                    Display your best work in a curated gallery. Customers browse by style, not by algorithm.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Trust Beyond Instagram</h3>
                  <p className="text-sm text-muted-foreground">
                    Verified profiles, reviews, and a structured order process build credibility.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Clear Custom-Order Process</h3>
                  <p className="text-sm text-muted-foreground">
                    From discussion to design to delivery — every step is documented and trackable.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 md:py-20 bg-primary/5">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Ready to Join?
            </h2>
            <p className="text-muted-foreground mb-8">
              Submit your application. We review each profile individually and respond within 5 working days.
            </p>
            <Button size="lg" className="px-8 py-6 text-lg font-semibold">
              Apply to Join Ogura
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </section>
      </main>

      <LuxuryFooter />
    </div>
  );
};

export default JoinUs;
