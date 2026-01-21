import { Search, ShoppingBag, User, Menu, Heart, LogOut, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { ImageSearchDialog } from "@/components/ImageSearchDialog";
import { MegaMenu } from "@/components/MegaMenu";
import { MegaMenuMobile } from "@/components/MegaMenuMobile";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { user, logout } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="h-5 w-5" />
          </Button>

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
            <form onSubmit={handleSearch} className="hidden md:flex items-center gap-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search..." className="pl-10 w-48" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <ImageSearchDialog
                trigger={
                  <Button variant="ghost" size="icon" title="Search by image">
                    <Camera className="h-5 w-5" />
                  </Button>
                }
              />
            </form>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background w-64">
                {user ? (
                  <>
                    {/* User Profile Info */}
                    <div className="px-3 py-3 border-b border-border">
                      <div className="flex items-center gap-3">
                        {user.avatarUrl ? (
                          <img 
                            src={user.avatarUrl} 
                            alt={user.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">{user.name.charAt(0).toUpperCase()}</span>
                          </div>
                        )}
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-medium truncate">
                            {user.name}
                          </span>
                          <span className="text-xs text-muted-foreground truncate">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <DropdownMenuItem onClick={() => navigate('/wishlist')} className="mt-1">
                      <Heart className="mr-2 h-4 w-4" />Wishlist
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem onClick={() => navigate('/auth')}>Login / Sign Up</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

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

        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search products..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </form>
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
