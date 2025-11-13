import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { GameSpot } from "./GameSpot";
import { RewardCard } from "./RewardCard";
import { SocialShareButtons } from "./SocialShareButtons";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";
import { Share2, ShoppingCart, CheckCircle, Gift, Sparkles } from "lucide-react";
import { Product } from "@/types";

interface SpotState {
  id: number;
  isCorrect: boolean;
  isClicked: boolean;
}

export const RewardGame = () => {
  const [spots, setSpots] = useState<SpotState[]>([]);
  const [correctClicksCount, setCorrectClicksCount] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [showSocialIcons, setShowSocialIcons] = useState(false);
  const [hasShared, setHasShared] = useState(false);
  const [hasAddedToCart, setHasAddedToCart] = useState(false);
  const [showFinalReward, setShowFinalReward] = useState(false);
  const { addItem } = useCart();

  // Initialize game on mount
  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    // Create array of 10 spots
    const newSpots: SpotState[] = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      isCorrect: false,
      isClicked: false,
    }));
    
    // Randomly select 3 correct spots
    const correctIndices = new Set<number>();
    while (correctIndices.size < 3) {
      correctIndices.add(Math.floor(Math.random() * 10));
    }
    
    correctIndices.forEach(index => {
      newSpots[index].isCorrect = true;
    });
    
    setSpots(newSpots);
    setCorrectClicksCount(0);
    setGameWon(false);
    setHasShared(false);
    setHasAddedToCart(false);
    setShowFinalReward(false);
  };

  const handleSpotClick = (spotId: number) => {
    const spot = spots.find(s => s.id === spotId);
    if (!spot || spot.isClicked || gameWon) return;
    
    // Update spot state
    const updatedSpots = spots.map(s => 
      s.id === spotId ? { ...s, isClicked: true } : s
    );
    setSpots(updatedSpots);
    
    // Count correct clicks
    if (spot.isCorrect) {
      const newCount = correctClicksCount + 1;
      setCorrectClicksCount(newCount);
      
      toast({
        title: "Correct! ✨",
        description: `Found ${newCount} of 3 lucky spots!`,
      });
      
      // Check if game won
      if (newCount === 3) {
        setGameWon(true);
        toast({
          title: "🎉 You Won!",
          description: "Congratulations! You found all 3 lucky spots!",
          duration: 5000,
        });
      }
    } else {
      toast({
        title: "Try again!",
        description: "That wasn't a lucky spot. Keep trying!",
        variant: "destructive",
      });
    }
  };

  const freeDressReward: Product = {
    id: 'reward-free-dress',
    name: 'Lucky Winner Free Dress',
    brand: 'OGURA',
    price: 0,
    category: 'dresses',
    images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Red', hex: '#ef4444' }],
    description: 'Congratulations! This is your free dress reward.',
    material: '100% Cotton',
    inStock: true,
    tags: ['reward', 'free', 'winner'],
    rating: 5,
    reviews: 100
  };

  const handleAddToCart = () => {
    addItem(freeDressReward, 'M', 'Red', 1);
    setHasAddedToCart(true);
    
    toast({
      title: "Added to Cart! 🎉",
      description: "Your free dress has been added to the cart.",
    });
  };

  const handleClaimReward = () => {
    setShowFinalReward(true);
    
    toast({
      title: "🎊 Reward Claimed!",
      description: "Your free dress is in your cart. Proceed to checkout!",
      duration: 5000,
    });
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-5xl mx-auto">
        {/* Game Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 mb-4 text-primary">
            <Sparkles className="h-6 w-6 animate-pulse" />
            <span className="text-sm font-semibold uppercase tracking-wider">Play & Win</span>
            <Sparkles className="h-6 w-6 animate-pulse" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Lucky Spot Game
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Find all 3 lucky spots to win a FREE dress! Click on the circles below.
          </p>
        </div>

        {/* Game Box */}
        <div className="bg-card rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xl border border-border mb-8">
          {/* Progress Indicator */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-6 py-3 rounded-full font-semibold">
              <Gift className="h-5 w-5" />
              Found: {correctClicksCount}/3 Lucky Spots
            </div>
          </div>

          {/* Game Grid */}
          <div className="grid grid-cols-5 sm:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 justify-items-center mb-6">
            {spots.map(spot => (
              <GameSpot
                key={spot.id}
                id={spot.id}
                isClicked={spot.isClicked}
                isCorrect={spot.isCorrect}
                onClick={() => handleSpotClick(spot.id)}
                disabled={gameWon}
              />
            ))}
          </div>

          {/* Instructions */}
          {!gameWon && (
            <p className="text-center text-sm text-muted-foreground">
              Click on any spot to reveal if it's lucky! Find all 3 to win your reward.
            </p>
          )}
        </div>

        {/* Reward Section */}
        {gameWon && (
          <div className="space-y-6 sm:space-y-8">
            <RewardCard />

            {/* Social Sharing Section */}
            <div className="bg-card rounded-xl p-6 sm:p-8 shadow-lg border border-border">
              <h4 className="text-xl sm:text-2xl font-bold text-foreground mb-4 text-center">
                Step 1: Share with Friends
              </h4>
              
              <Button 
                onClick={() => setShowSocialIcons(!showSocialIcons)}
                className="w-full mb-4"
                variant="outline"
                size="lg"
              >
                <Share2 className="mr-2 h-5 w-5" />
                Share this website to 10 friends
              </Button>
              
              {showSocialIcons && (
                <div className="mb-4">
                  <SocialShareButtons show={showSocialIcons} />
                </div>
              )}
              
              {/* Confirmation Checkbox */}
              <div className="flex items-start gap-3 bg-muted/50 p-4 rounded-lg">
                <Checkbox
                  id="share-confirm"
                  checked={hasShared}
                  onCheckedChange={(checked) => setHasShared(checked as boolean)}
                />
                <label 
                  htmlFor="share-confirm"
                  className="text-sm font-medium leading-relaxed cursor-pointer flex-1"
                >
                  ✔ I have shared this website with 10 friends
                </label>
              </div>
            </div>

            {/* Add to Cart Section */}
            <div className="bg-card rounded-xl p-6 sm:p-8 shadow-lg border border-border">
              <h4 className="text-xl sm:text-2xl font-bold text-foreground mb-4 text-center">
                Step 2: Add Dress to Cart
              </h4>
              
              <Button
                onClick={handleAddToCart}
                disabled={hasAddedToCart}
                className="w-full"
                size="lg"
              >
                {hasAddedToCart ? (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add Free Dress to Cart
                  </>
                )}
              </Button>
            </div>

            {/* Final Claim Button */}
            {hasShared && hasAddedToCart && !showFinalReward && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Button
                  onClick={handleClaimReward}
                  className="w-full bg-gradient-to-r from-primary via-primary/90 to-primary hover:from-primary/90 hover:via-primary hover:to-primary/90 text-primary-foreground font-bold text-lg py-6 shadow-2xl"
                  size="lg"
                >
                  <Gift className="mr-2 h-6 w-6" />
                  🎉 Claim Your Free Dress Reward 🎉
                </Button>
              </div>
            )}

            {/* Final Success State */}
            {showFinalReward && (
              <div className="p-6 sm:p-8 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-xl border-2 border-green-500 animate-in fade-in zoom-in duration-500">
                <div className="text-center">
                  <div className="text-5xl mb-3">🏆</div>
                  <h4 className="text-2xl font-bold text-green-900 dark:text-green-100 mb-2">
                    Reward Successfully Claimed!
                  </h4>
                  <p className="text-green-700 dark:text-green-300 mb-4">
                    Your free dress is waiting in your cart.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
