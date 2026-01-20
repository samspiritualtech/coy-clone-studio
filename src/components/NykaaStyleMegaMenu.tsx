import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { womenMenu, menMenu, featuredBrands, allBrands, topNavItems, Category } from "@/data/menuData";

interface NykaaStyleMegaMenuProps {
  isScrolled?: boolean;
}

type MenuType = "women" | "men" | "brands" | null;

export const NykaaStyleMegaMenu = ({ isScrolled = true }: NykaaStyleMegaMenuProps) => {
  const [activeMenu, setActiveMenu] = useState<MenuType>(null);
  const [hoveredCategory, setHoveredCategory] = useState<Category | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (menuType: MenuType) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveMenu(menuType);
    // Set default hovered category
    if (menuType === "women") {
      setHoveredCategory(womenMenu.categories[0]);
    } else if (menuType === "men") {
      setHoveredCategory(menMenu.categories[0]);
    } else {
      setHoveredCategory(null);
    }
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
      setHoveredCategory(null);
    }, 300);
  };

  const handleDropdownEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const getCategories = () => {
    if (activeMenu === "women") return womenMenu.categories;
    if (activeMenu === "men") return menMenu.categories;
    return [];
  };

  const getGenderPath = () => {
    return activeMenu === "women" ? "/women" : "/men";
  };

  const renderCategoryMenu = () => {
    const categories = getCategories();
    const genderPath = getGenderPath();

    return (
      <div className="grid grid-cols-12 gap-8 p-8 max-w-7xl mx-auto">
        {/* Column 1 - Categories */}
        <div className="col-span-3 border-r border-border pr-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Categories
          </h3>
          <ul className="space-y-1">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link
                  to={`${genderPath}/${category.slug}`}
                  className={`flex items-center justify-between py-2.5 px-3 rounded-md text-sm transition-all duration-200 group ${
                    hoveredCategory?.slug === category.slug
                      ? "bg-secondary text-foreground font-medium"
                      : "text-foreground/80 hover:bg-secondary/50"
                  }`}
                  onMouseEnter={() => setHoveredCategory(category)}
                >
                  <span>{category.name}</span>
                  <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2 - Sub-Categories */}
        <div className="col-span-4 px-4">
          {hoveredCategory && (
            <>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                {hoveredCategory.name}
              </h3>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
                {hoveredCategory.subCategories.map((sub) => (
                  <li key={sub.slug}>
                    <Link
                      to={`${genderPath}/${hoveredCategory.slug}/${sub.slug}`}
                      className="block py-2 text-sm text-foreground/70 hover:text-foreground transition-colors"
                    >
                      {sub.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                to={`${genderPath}/${hoveredCategory.slug}`}
                className="inline-block mt-6 text-sm font-medium text-primary underline underline-offset-4 hover:text-primary/80"
              >
                View All {hoveredCategory.name}
              </Link>
            </>
          )}
        </div>

        {/* Column 3 - Visual Section */}
        <div className="col-span-5 pl-4">
          {hoveredCategory && (
            <Link
              to={`${genderPath}/${hoveredCategory.slug}`}
              className="block relative h-80 rounded-lg overflow-hidden group"
            >
              {hoveredCategory.video ? (
                <video
                  src={hoveredCategory.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <img
                  src={hoveredCategory.image || "/placeholder.svg"}
                  alt={hoveredCategory.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <h4 className="text-white text-xl font-light tracking-wide mb-3">
                  {hoveredCategory.name}
                </h4>
                <span className="inline-flex items-center gap-2 text-white text-sm font-medium uppercase tracking-wider">
                  Shop Now
                  <ChevronRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          )}
        </div>
      </div>
    );
  };

  const renderBrandsMenu = () => {
    // Group brands alphabetically
    const groupedBrands = allBrands.reduce((acc, brand) => {
      const firstLetter = brand.name[0].toUpperCase();
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(brand);
      return acc;
    }, {} as Record<string, typeof allBrands>);

    const designerBrands = allBrands.filter((b) => b.isDesigner);

    return (
      <div className="p-8 max-w-7xl mx-auto">
        {/* Featured Brands */}
        <div className="mb-8">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Featured Brands
          </h3>
          <div className="grid grid-cols-6 gap-4">
            {featuredBrands.map((brand) => (
              <Link
                key={brand.slug}
                to={`/brand/${brand.slug}`}
                className="flex flex-col items-center justify-center p-4 rounded-lg bg-secondary/30 hover:bg-secondary transition-colors group"
              >
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <span className="text-lg font-semibold text-foreground">
                    {brand.name.charAt(0)}
                  </span>
                </div>
                <span className="text-xs font-medium text-center text-foreground/80 group-hover:text-foreground">
                  {brand.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Designer Brands */}
          <div className="col-span-4 border-r border-border pr-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Designer Brands
            </h3>
            <ul className="space-y-1">
              {designerBrands.slice(0, 8).map((brand) => (
                <li key={brand.slug}>
                  <Link
                    to={`/brand/${brand.slug}`}
                    className="block py-2 text-sm text-foreground/70 hover:text-foreground transition-colors"
                  >
                    {brand.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              to="/brands?type=designer"
              className="inline-block mt-4 text-sm font-medium text-primary underline underline-offset-4 hover:text-primary/80"
            >
              View All Designers
            </Link>
          </div>

          {/* A-Z Brands */}
          <div className="col-span-8 pl-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              All Brands A-Z
            </h3>
            <div className="grid grid-cols-4 gap-x-6 gap-y-2">
              {Object.entries(groupedBrands)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([letter, brands]) => (
                  <div key={letter} className="mb-4">
                    <span className="text-sm font-semibold text-foreground mb-2 block">
                      {letter}
                    </span>
                    <ul className="space-y-1">
                      {brands.map((brand) => (
                        <li key={brand.slug}>
                          <Link
                            to={`/brand/${brand.slug}`}
                            className="text-sm text-foreground/70 hover:text-foreground transition-colors"
                          >
                            {brand.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* View All Link */}
        <div className="mt-6 pt-6 border-t border-border text-center">
          <Link
            to="/brands"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80"
          >
            View All Brands
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  };

  return (
    <nav className="hidden lg:flex items-center gap-1">
      {topNavItems.map((item) => (
        <div
          key={item.label}
          className="relative"
          onMouseEnter={() => item.hasMegaMenu && handleMouseEnter(item.menuType as MenuType)}
          onMouseLeave={handleMouseLeave}
        >
          <Link
            to={item.path}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              isScrolled
                ? "text-foreground hover:text-foreground/70"
                : "text-white hover:text-white/70"
            } ${activeMenu === item.menuType ? "border-b-2 border-primary" : ""}`}
          >
            {item.label}
          </Link>
        </div>
      ))}

      {/* Mega Menu Dropdown */}
      {activeMenu && (
        <>
          {/* Invisible bridge */}
          <div
            className="fixed left-0 right-0 h-4 z-40"
            style={{ top: isScrolled ? "60px" : "76px" }}
            onMouseEnter={handleDropdownEnter}
          />

          {/* Dropdown content */}
          <div
            className="fixed left-0 right-0 z-50 bg-background border-b border-border shadow-xl animate-fade-in"
            style={{ top: isScrolled ? "64px" : "80px" }}
            onMouseEnter={handleDropdownEnter}
            onMouseLeave={handleMouseLeave}
          >
            {activeMenu === "brands" ? renderBrandsMenu() : renderCategoryMenu()}
          </div>
        </>
      )}
    </nav>
  );
};

export default NykaaStyleMegaMenu;
