import { Button } from "@/components/ui/button";

export const GiftCardSection = () => {
  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-accent p-12 md:p-16 text-center">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }} />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
              OGURA
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-8">GIFT CARD</p>
            <p className="text-white/80 mb-8 max-w-md mx-auto">
              The perfect gift for fashion lovers. Available in multiple denominations.
            </p>
            <Button size="lg" variant="secondary" className="shadow-lg">
              Buy Gift Card
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
