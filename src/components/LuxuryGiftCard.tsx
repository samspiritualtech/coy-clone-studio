import { Button } from "@/components/ui/button";

export const LuxuryGiftCard = () => {
  return (
    <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=1920&q=80)",
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-start justify-center container mx-auto px-4 md:px-8 lg:px-16">
        <span className="text-white/60 text-xs uppercase tracking-[0.3em] mb-4">
          The Perfect Present
        </span>
        
        <h2 className="text-white text-4xl md:text-6xl lg:text-7xl font-extralight uppercase tracking-[0.2em] mb-2">
          OGURA
        </h2>
        <p className="text-white/80 text-xl md:text-2xl font-light tracking-[0.15em] uppercase mb-6">
          Gift Card
        </p>
        
        <p className="text-white/60 text-sm md:text-base max-w-md mb-8 leading-relaxed">
          The perfect gift for fashion lovers. Available in multiple denominations, 
          delivered instantly via email.
        </p>
        
        <Button
          variant="outline"
          size="lg"
          className="border-white/60 bg-transparent text-white hover:bg-white hover:text-black transition-all duration-500 tracking-[0.2em] uppercase text-sm"
        >
          Buy Gift Card
        </Button>
      </div>
    </section>
  );
};
