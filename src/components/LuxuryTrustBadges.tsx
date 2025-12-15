import { Shield, Truck, RefreshCw, Award } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "100% Authentic",
    description: "All products are genuine and certified",
  },
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders above ₹1999",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    description: "15 days return policy",
  },
  {
    icon: Award,
    title: "Premium Quality",
    description: "Curated with excellence",
  },
];

export const LuxuryTrustBadges = () => {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920&q=80)",
        }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <h2 className="text-white text-3xl md:text-4xl font-light uppercase tracking-[0.2em] text-center mb-4">
          The Ogura Promise
        </h2>
        <p className="text-white/70 text-center mb-16 max-w-xl mx-auto">
          Experience fashion with confidence
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center group"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-white/30 mb-6 transition-all duration-300 group-hover:border-white group-hover:bg-white/10">
                <feature.icon className="h-7 w-7 text-white/90" strokeWidth={1.5} />
              </div>
              <h3 className="text-white font-light text-sm uppercase tracking-[0.15em] mb-2">
                {feature.title}
              </h3>
              <p className="text-white/60 text-xs">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
