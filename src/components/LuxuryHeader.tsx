import { Search, ShoppingBag, User, Menu, Camera, X, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useLocation } from "@/contexts/LocationContext";
import { ImageSearchDialog } from "@/components/ImageSearchDialog";
import { MegaMenu } from "@/components/MegaMenu";
import { MegaMenuMobile } from "@/components/MegaMenuMobile";
import { NykaaLoginDropdown } from "@/components/auth/NykaaLoginDropdown";
import { AuthModal } from "@/components/auth/AuthModal";
import { cn } from "@/lib/utils";

export const LuxuryHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { location: userLocation, setShowManualSelector, setShowPermissionModal } = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const handleLoginClick = () => {
    setIsPopoverOpen(false);
    setShowAuthModal(true);
  };

  const navItems = [
    { label: "Brands", path: "/brands" },
    { label: "Designers", path: "/designers" },
    { label: "Occasions", path: "/occasions" },
    { label: "New", path: "/collections" },
    { label: "Stores", path: "/stores" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-500",
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      )}
    >
      {/* Location bar */}
      <div className={cn(
        "transition-all duration-300",
        isScrolled ? "bg-muted/50" : "bg-black/20"
      )}>
        <div className="container mx-auto px-4">
          <div className="flex h-8 items-center justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => userLocation ? setShowManualSelector(true) : setShowPermissionModal(true)}
              className={cn(
                "gap-1 text-xs h-7 px-2",
                isScrolled ? "text-foreground hover:bg-accent" : "text-white/90 hover:bg-white/10"
              )}
            >
              <MapPin className="h-3 w-3" />
              {userLocation ? (
                <span>Delivering to {userLocation.city}, {userLocation.pincode}</span>
              ) : (
                <span>Select Location</span>
              )}
            </Button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "md:hidden transition-colors",
              !isScrolled && "text-white hover:bg-white/10"
            )}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          <Link
            to="/"
            className={cn(
              "text-2xl font-light tracking-[0.3em] uppercase transition-colors",
              isScrolled ? "text-foreground" : "text-white"
            )}
          >
            OGURA
          </Link>

          <nav className="hidden md:flex items-center gap-8 static">
            <MegaMenu isScrolled={isScrolled} />
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className={cn(
                  "text-xs font-light uppercase tracking-[0.2em] transition-colors relative group",
                  isScrolled ? "text-foreground hover:text-accent" : "text-white/90 hover:text-white"
                )}
              >
                {item.label}
                <span className={cn(
                  "absolute -bottom-1 left-0 w-0 h-px transition-all duration-300 group-hover:w-full",
                  isScrolled ? "bg-foreground" : "bg-white"
                )} />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <form onSubmit={handleSearch} className="hidden md:flex items-center gap-1">
              <div className="relative">
                <Search className={cn(
                  "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors",
                  isScrolled ? "text-muted-foreground" : "text-white/70"
                )} />
                <Input
                  placeholder="Search..."
                  className={cn(
                    "pl-10 w-48 border transition-all",
                    isScrolled
                      ? "bg-background border-input"
                      : "bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20"
                  )}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <ImageSearchDialog
                trigger={
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "transition-colors",
                      !isScrolled && "text-white hover:bg-white/10"
                    )}
                    title="Search by image"
                  >
                    <Camera className="h-5 w-5" />
                  </Button>
                }
              />
            </form>

            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "transition-colors",
                    !isScrolled && "text-white hover:bg-white/10"
                  )}
                >
                  <User className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="p-0 w-auto border-0 shadow-xl rounded-xl bg-background/95 backdrop-blur-md">
                <NykaaLoginDropdown 
                  onLoginClick={handleLoginClick}
                  onClose={() => setIsPopoverOpen(false)}
                />
              </PopoverContent>
            </Popover>

            <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />

            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "relative transition-colors",
                !isScrolled && "text-white hover:bg-white/10"
              )}
              onClick={() => navigate("/cart")}
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-[10px] font-medium text-accent-foreground flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden fixed inset-0 top-20 bg-background/98 backdrop-blur-md transition-all duration-300 overflow-y-auto",
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        )}
      >
        <div className="container mx-auto px-4 py-6">
          <MegaMenuMobile onItemClick={() => setIsMenuOpen(false)} />
          
          <nav className="flex flex-col gap-4 mt-6 pt-6 border-t border-border">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="text-base font-light uppercase tracking-[0.15em] text-foreground hover:text-accent transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          
          <form onSubmit={handleSearch} className="mt-6 pt-6 border-t border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        </div>
      </div>
    </header>
  );
};
