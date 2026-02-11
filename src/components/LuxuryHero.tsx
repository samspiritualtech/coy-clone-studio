import { Button } from "@/components/ui/button";

export const LuxuryHero = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        src="https://res.cloudinary.com/dpnosz8im/video/upload/f_auto,q_auto/v1768378220/bfakbydpghrmr0cvqdy99nkqy4_result__udh0fw.mp4"
      />
      
      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
      
      {/* Content - Left Aligned */}
      <div className="relative z-10 h-full flex flex-col items-start justify-center px-8 md:px-16 lg:px-24 max-w-4xl">
        <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 drop-shadow-lg">
          Fashion that defines you.
        </h1>
        <p className="text-white/90 text-lg md:text-xl font-light tracking-[0.15em] uppercase drop-shadow-md mb-8">
          OGURA Fashion – crafted for modern elegance.
        </p>
        
        <Button
          size="lg"
          className="bg-white text-black hover:bg-white/90 transition-all duration-500 tracking-[0.1em] uppercase text-sm px-10 py-6 font-medium"
          onClick={() => document.getElementById("featured-products")?.scrollIntoView({ behavior: "smooth" })}
        >
          Explore Collection
        </Button>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <div className="w-px h-16 bg-gradient-to-b from-white/60 to-transparent animate-pulse" />
      </div>
    </section>
  );
};
