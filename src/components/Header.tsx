import { ShoppingBag, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { MegaMenu } from "@/components/MegaMenu";
import { MegaMenuMobile } from "@/components/MegaMenuMobile";
import { HeaderLocationIndicator } from "@/components/HeaderLocationIndicator";
import { UserMenu } from "@/components/auth/UserMenu";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="hidden md:block border-b border-border/50 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex h-8 items-center">
            <HeaderLocationIndicator variant="compact" />
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div className="md:hidden">
              <HeaderLocationIndicator variant="compact" />
            </div>
          </div>

          <Link to="/" className="text-2xl font-bold tracking-tight">OGURA</Link>

          <nav className="hidden md:flex items-center gap-6 static">
            <MegaMenu isScrolled={true} />
            <Link to="/brands" className="text-sm font-medium hover:text-accent transition-colors">Brands</Link>
            <Link to="/designers" className="text-sm font-medium hover:text-accent transition-colors">Designer Labels</Link>
            <Link to="/occasions" className="text-sm font-medium hover:text-accent transition-colors">Occasions</Link>
            <Link to="/collections" className="text-sm font-medium hover:text-accent transition-colors">New Arrivals</Link>
            <Link to="/stores" className="text-sm font-medium hover:text-accent transition-colors">Stores</Link>
          </nav>

          <div className="flex items-center gap-2">
            <UserMenu isScrolled={true} />

            <Button variant="ghost" size="icon" className="relative" onClick={() => navigate('/cart')}>
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container mx-auto px-4 py-4">
            <MegaMenuMobile onItemClick={() => setIsMenuOpen(false)} />
            <nav className="flex flex-col gap-3 mt-4 pt-4 border-t border-border">
              <Link to="/brands" className="text-sm font-medium hover:text-accent transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Brands</Link>
              <Link to="/designers" className="text-sm font-medium hover:text-accent transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Designer Labels</Link>
              <Link to="/occasions" className="text-sm font-medium hover:text-accent transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Occasions</Link>
              <Link to="/stores" className="text-sm font-medium hover:text-accent transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Stores</Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};
