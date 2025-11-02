import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export const Hero = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative py-4 md:py-6 overflow-hidden">
      {/* Floating Orbs with Parallax */}
      <div 
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      >
        <div className="absolute top-20 left-[10%] w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" 
             style={{ animationDuration: '4s' }} />
        <div className="absolute top-40 right-[15%] w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse" 
             style={{ animationDuration: '6s', animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-[20%] w-72 h-72 bg-secondary/20 rounded-full blur-3xl animate-pulse" 
             style={{ animationDuration: '5s', animationDelay: '2s' }} />
        <div className="absolute top-60 right-[25%] w-56 h-56 bg-primary/15 rounded-full blur-3xl animate-pulse" 
             style={{ animationDuration: '7s', animationDelay: '0.5s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Hero Banner */}
          <div 
            className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden group cursor-pointer"
            onClick={() => navigate('/collections')}
          >
            <img
              src="https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=1200&auto=format&fit=crop&q=85"
              alt="New in Midseason Fashion Collection"
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              loading="eager"
            />
            <div className="absolute inset-0 hero-gradient-overlay" />
            <div className="absolute bottom-6 left-6 text-white">
              <p className="text-sm mb-2 font-medium tracking-wide drop-shadow-lg">NEW IN MIDSEASON</p>
              <h2 className="text-3xl md:text-4xl font-bold drop-shadow-lg">Shop Now</h2>
            </div>
          </div>

          {/* Right Hero Banner */}
          <div 
            className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden group cursor-pointer"
            onClick={() => navigate('/collections')}
          >
            <img
              src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=1200&auto=format&fit=crop&q=85"
              alt="Best Fashion Deals and Sales"
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              loading="eager"
            />
            <div className="absolute inset-0 hero-gradient-overlay" />
            <div className="absolute bottom-6 left-6 text-white">
              <p className="text-sm mb-2 font-medium tracking-wide drop-shadow-lg">THE BEST DEALS</p>
              <h2 className="text-3xl md:text-4xl font-bold drop-shadow-lg">Discover More</h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
