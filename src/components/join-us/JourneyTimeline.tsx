import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { 
  Upload, 
  Eye, 
  MessageSquare, 
  Sparkles, 
  Package,
  ArrowDown
} from "lucide-react";

const steps = [
  {
    step: 1,
    icon: Upload,
    title: "Create Your Profile & Lookbook",
    description: "Set up a structured profile with your specialisation, price range, and location. Upload your lookbook — past work, signature pieces, and design samples.",
    highlight: "This is a professional portfolio, not a social feed.",
    color: "from-rose-500 to-pink-600"
  },
  {
    step: 2,
    icon: Eye,
    title: "Customers Discover You",
    description: "Customers browse by category, occasion, or city. They view your lookbook, read your profile, and understand your style.",
    highlight: "If interested, they initiate a design discussion.",
    color: "from-amber-500 to-orange-600"
  },
  {
    step: 3,
    icon: MessageSquare,
    title: "Design Discussion",
    description: "You and the customer discuss requirements — fabric, colour, embroidery, silhouette. This happens through Ogura's messaging system.",
    highlight: "You clarify scope, share references, and align on expectations.",
    color: "from-emerald-500 to-teal-600"
  },
  {
    step: 4,
    icon: Sparkles,
    title: "AI Visualisation",
    description: "Ogura offers AI-generated previews to help customers visualise their outfit before production. This is a communication tool, not a design tool.",
    highlight: "You remain in control of the actual design.",
    color: "from-violet-500 to-purple-600",
    optional: true
  },
  {
    step: 5,
    icon: Package,
    title: "Production & Delivery",
    description: "Once the customer confirms, production begins. Studio owners stitch and dispatch from their premises. Independent designers work with partners.",
    highlight: "Delivery is tracked through Ogura.",
    color: "from-blue-500 to-indigo-600"
  }
];

const JourneyStep = ({ 
  step, 
  isLast, 
  delay 
}: { 
  step: typeof steps[0]; 
  isLast: boolean;
  delay: number;
}) => {
  const { ref, isVisible } = useScrollAnimation(0.1);
  const Icon = step.icon;

  return (
    <div 
      ref={ref}
      className="relative"
      style={{ 
        opacity: isVisible ? 1 : 0, 
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transitionDelay: `${delay}ms`,
        transitionDuration: '600ms',
        transitionProperty: 'opacity, transform'
      }}
    >
      {/* Main Container */}
      <div className="relative bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-500 group">
        {/* Step Badge */}
        <div className="absolute -top-4 left-6 md:left-8">
          <div className={`bg-gradient-to-r ${step.color} text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2`}>
            <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-xs">
              {step.step}
            </span>
            Step {step.step}
            {step.optional && (
              <span className="bg-white/20 px-2 py-0.5 rounded text-xs">Optional</span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col md:flex-row gap-6 pt-4">
          {/* Icon */}
          <div className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
            <Icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
          </div>

          {/* Text */}
          <div className="flex-1 space-y-3">
            <h3 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
              {step.title}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {step.description}
            </p>
            <p className="text-foreground font-medium bg-muted/50 px-4 py-2 rounded-lg inline-block">
              {step.highlight}
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${step.color} opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity duration-500`} />
      </div>

      {/* Connector Arrow */}
      {!isLast && (
        <div className="flex justify-center py-4">
          <div 
            className="flex flex-col items-center gap-1 text-muted-foreground/50"
            style={{ 
              opacity: isVisible ? 1 : 0,
              transitionDelay: `${delay + 300}ms`,
              transitionDuration: '400ms'
            }}
          >
            <div className="w-0.5 h-6 bg-gradient-to-b from-border to-primary/30" />
            <ArrowDown className="w-5 h-5 text-primary/50 animate-bounce" />
            <div className="w-0.5 h-6 bg-gradient-to-b from-primary/30 to-border" />
          </div>
        </div>
      )}
    </div>
  );
};

export const JourneyTimeline = () => {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section className="py-16 md:py-24 bg-muted/30 overflow-hidden">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div 
          ref={ref}
          className="text-center mb-16"
          style={{ 
            opacity: isVisible ? 1 : 0, 
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transitionDuration: '600ms'
          }}
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Package className="w-4 h-4" />
            Your Journey
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A step-by-step process from listing your work to delivering custom outfits
          </p>
        </div>

        {/* Timeline */}
        <div className="space-y-2">
          {steps.map((step, index) => (
            <JourneyStep 
              key={step.step}
              step={step}
              isLast={index === steps.length - 1}
              delay={index * 150}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div 
          className="mt-12 text-center"
          style={{ 
            opacity: isVisible ? 1 : 0,
            transitionDelay: '800ms',
            transitionDuration: '600ms'
          }}
        >
          <p className="text-muted-foreground mb-2">Ready to start your journey?</p>
          <div className="inline-flex items-center gap-2 text-primary font-semibold">
            <span>Apply below</span>
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
};
