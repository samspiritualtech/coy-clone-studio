import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface MegaMenuProps {
  isScrolled?: boolean;
}

const menuCategories = {
  men: {
    title: "Men",
    items: [
      "T-Shirts",
      "Shirts",
      "Jeans",
      "Trousers",
      "Jackets & Blazers",
      "Ethnic Wear",
      "Activewear",
      "Footwear",
    ],
  },
  women: {
    title: "Women",
    items: [
      "Tops & T-Shirts",
      "Dresses",
      "Ethnic Wear",
      "Sarees",
      "Kurtis",
      "Co-ord Sets",
      "Innerwear & Loungewear",
      "Footwear",
    ],
  },
  genZ: {
    title: "Gen Z",
    items: [
      "Oversized Tees",
      "Streetwear",
      "Cargo Pants",
      "Co-ord Sets",
      "Crop Tops",
      "Party Wear",
      "Sneakers",
    ],
  },
  accessories: {
    title: "Accessories",
    items: [
      "Bags & Backpacks",
      "Wallets",
      "Sunglasses",
      "Watches",
      "Jewellery",
      "Caps & Hats",
      "Belts",
    ],
  },
};

const generateCategoryUrl = (category: string, item: string) => {
  const slug = item.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-");
  return `/collections?category=${category.toLowerCase()}&subcategory=${slug}`;
};

export const MegaMenu = ({ isScrolled = true }: MegaMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    // Cancel any pending close timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    // Delay closing by 300ms to allow cursor movement
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 300);
  };

  return (
    <div 
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={cn(
          "flex items-center gap-1 text-sm font-medium transition-colors",
          isScrolled
            ? "text-foreground hover:text-accent"
            : "text-white/90 hover:text-white"
        )}
      >
        Shop
        <ChevronDown 
          className={cn(
            "h-3 w-3 transition-transform duration-200",
            isOpen && "rotate-180"
          )} 
        />
      </button>

      {isOpen && (
        <>
          {/* Invisible bridge to prevent gap hover loss */}
          <div 
            className="fixed left-0 right-0 h-4 top-[48px] z-40"
            onMouseEnter={handleMouseEnter}
          />
          
          <div 
            className="fixed left-0 right-0 top-[64px] z-50 flex justify-center px-4"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="w-full max-w-[1400px] bg-background shadow-lg shadow-black/10 border border-border/50 rounded-md px-8 md:px-12 py-8 animate-in fade-in-0 zoom-in-95 duration-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                {Object.entries(menuCategories).map(([key, category]) => (
                  <div key={key} className="space-y-4">
                    <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-foreground border-b border-border pb-2">
                      {category.title}
                    </h3>
                    <ul className="space-y-2">
                      {category.items.map((item) => (
                        <li key={item}>
                          <Link
                            to={generateCategoryUrl(category.title, item)}
                            className="group block text-sm font-normal text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            <span className="relative">
                              {item}
                              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full" />
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-border">
                <Link
                  to="/collections"
                  className="inline-flex items-center text-xs font-medium uppercase tracking-[0.15em] text-foreground hover:text-accent transition-colors group"
                  onClick={() => setIsOpen(false)}
                >
                  View All Collections
                  <ChevronDown className="ml-2 h-3 w-3 -rotate-90 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
