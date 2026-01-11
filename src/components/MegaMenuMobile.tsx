import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface MegaMenuMobileProps {
  onItemClick?: () => void;
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

export const MegaMenuMobile = ({ onItemClick }: MegaMenuMobileProps) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      {Object.entries(menuCategories).map(([key, category]) => (
        <AccordionItem key={key} value={key} className="border-border">
          <AccordionTrigger className="text-base font-light uppercase tracking-[0.15em] text-foreground hover:text-accent hover:no-underline py-4">
            {category.title}
          </AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-3 pb-4 pl-4">
              {category.items.map((item) => (
                <li key={item}>
                  <Link
                    to={generateCategoryUrl(category.title, item)}
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                    onClick={onItemClick}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}
      
      {/* View All Link */}
      <div className="py-4 border-t border-border mt-2">
        <Link
          to="/collections"
          className="text-sm font-medium uppercase tracking-[0.1em] text-accent"
          onClick={onItemClick}
        >
          View All Collections →
        </Link>
      </div>
    </Accordion>
  );
};
