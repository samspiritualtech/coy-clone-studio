import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { ChevronDown } from "lucide-react";

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
  return (
    <NavigationMenu className="relative">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={cn(
              "bg-transparent px-0 py-0 h-auto text-xs font-light uppercase tracking-[0.2em] transition-colors hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent",
              isScrolled
                ? "text-foreground hover:text-accent data-[state=open]:text-accent"
                : "text-white/90 hover:text-white data-[state=open]:text-white"
            )}
          >
            Shop
          </NavigationMenuTrigger>
          <NavigationMenuContent className="mega-menu-content">
            <div className="w-screen flex justify-center overflow-x-hidden px-4">
              <div className="w-full max-w-[1400px] bg-white shadow-lg shadow-black/10 border border-border/50 rounded-md px-8 md:px-12 py-8 animate-fade-in">
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
                  >
                    View All Collections
                    <ChevronDown className="ml-2 h-3 w-3 -rotate-90 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
