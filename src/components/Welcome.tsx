import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export const Welcome = () => {
  const [countdown, setCountdown] = useState(5);
  const [fadingOut, setFadingOut] = useState(false);
  
  const REDIRECT_URL = 'https://lovable.dev/projects/690ffbe9-4d99-4882-8b43-9e291478adf2';
  
  const handleRedirect = () => {
    setFadingOut(true);
    setTimeout(() => {
      window.location.href = REDIRECT_URL;
    }, 500);
  };
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          handleRedirect();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className={`
      min-h-screen bg-white flex items-center justify-center p-4
      ${fadingOut ? 'fade-out' : 'animate-fade-in'}
    `}>
      <div className="text-center max-w-2xl">
        {/* OGURA Logo */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4">
            OGURA
          </h1>
          <div className="w-24 h-1 bg-[hsl(var(--ogura-red))] mx-auto mb-6"></div>
        </div>
        
        {/* Welcome Message */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-800 mb-6">
          Welcome to OGURA
        </h2>
        <p className="text-xl md:text-2xl lg:text-3xl text-gray-600 mb-12">
          Explore New Arrivals
        </p>
        
        {/* CTA Button */}
        <Button 
          onClick={handleRedirect}
          size="lg"
          className="
            bg-[hsl(var(--ogura-red))] hover:bg-[hsl(var(--ogura-red))]/90 text-white
            px-8 py-6 text-base md:text-lg font-semibold
            shadow-lg hover:shadow-xl
            transition-all duration-200
            w-full sm:w-auto
            mb-6
          "
        >
          Go to Launch Page Now
        </Button>
        
        {/* Countdown */}
        <p className="text-gray-500 text-sm">
          Automatically redirecting in {countdown} seconds...
        </p>
      </div>
    </div>
  );
};
