import { Search, ShoppingBag, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile Menu */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Logo */}
          <a href="/" className="text-2xl font-bold tracking-tight">
            OGURA
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="/collections" className="text-sm font-medium hover:text-accent transition-colors">
              Shop All
            </a>
            <a href="/brands" className="text-sm font-medium hover:text-accent transition-colors">
              Brands
            </a>
            <a href="/occasions" className="text-sm font-medium hover:text-accent transition-colors">
              Occasions
            </a>
            <a href="/new" className="text-sm font-medium hover:text-accent transition-colors">
              New Arrivals
            </a>
            <a href="/stores" className="text-sm font-medium hover:text-accent transition-colors">
              Stores
            </a>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-[10px] font-medium text-accent-foreground flex items-center justify-center">
                0
              </span>
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-3">
            <a href="/collections" className="text-sm font-medium hover:text-accent transition-colors py-2">
              Shop All
            </a>
            <a href="/brands" className="text-sm font-medium hover:text-accent transition-colors py-2">
              Brands
            </a>
            <a href="/occasions" className="text-sm font-medium hover:text-accent transition-colors py-2">
              Occasions
            </a>
            <a href="/new" className="text-sm font-medium hover:text-accent transition-colors py-2">
              New Arrivals
            </a>
            <a href="/stores" className="text-sm font-medium hover:text-accent transition-colors py-2">
              Stores
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};
