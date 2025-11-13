import { Gift } from "lucide-react";

export const RewardCard = () => {
  return (
    <div className="relative rounded-2xl bg-gradient-to-br from-primary/10 via-background to-primary/5 p-6 sm:p-8 shadow-2xl border border-primary/20 animate-in fade-in zoom-in duration-500">
      {/* Confetti decoration */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl opacity-20 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
        <div className="absolute top-4 right-1/4 w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
        <div className="absolute top-8 left-1/2 w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
      </div>
      
      <div className="relative z-10 text-center">
        <div className="text-5xl sm:text-6xl mb-4">🎉</div>
        <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Congratulations!
        </h3>
        <p className="text-lg sm:text-xl text-muted-foreground mb-6">
          You won a special reward!
        </p>
        
        {/* Reward Badge */}
        <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 sm:px-8 py-3 sm:py-4 rounded-full text-xl sm:text-2xl font-bold mb-6 shadow-lg">
          <Gift className="h-6 w-6" />
          FREE DRESS OFFER
        </div>
        
        {/* Dress Preview */}
        <div className="w-48 h-48 sm:w-64 sm:h-64 mx-auto mb-6 rounded-lg overflow-hidden shadow-lg bg-muted">
          <img 
            src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80" 
            alt="Free Dress Reward"
            className="w-full h-full object-cover"
          />
        </div>
        
        <p className="text-sm sm:text-base text-muted-foreground">
          Complete the steps below to claim your reward!
        </p>
      </div>
    </div>
  );
};
