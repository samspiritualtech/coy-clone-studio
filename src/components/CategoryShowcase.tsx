import { FullWidthImageSection } from "./FullWidthImageSection";

const categories = [
  {
    id: "new-arrivals",
    label: "Just Arrived",
    title: "New Arrivals",
    subtitle: "Discover the latest pieces fresh from the runway",
    ctaText: "Discover New",
    ctaLink: "/collections?category=new",
    backgroundImage: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1920&q=80",
    height: "60vh" as const,
  },
  {
    id: "dresses",
    label: "Collection",
    title: "Dresses",
    subtitle: "Elegance for every occasion",
    ctaText: "Explore",
    ctaLink: "/collections?category=dresses",
    backgroundImage: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1920&q=80",
    height: "60vh" as const,
  },
  {
    id: "tops",
    label: "Essentials",
    title: "Tops",
    subtitle: "Refined basics to elevated statements",
    ctaText: "Shop Tops",
    ctaLink: "/collections?category=tops",
    backgroundImage: "https://images.unsplash.com/photo-1583391265196-53c5e5e92b0d?w=1920&q=80",
    height: "50vh" as const,
  },
  {
    id: "bottoms",
    label: "Foundation",
    title: "Bottoms",
    subtitle: "Tailored to perfection",
    ctaText: "View Collection",
    ctaLink: "/collections?category=bottoms",
    backgroundImage: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1920&q=80",
    height: "50vh" as const,
  },
  {
    id: "outerwear",
    label: "Layer Up",
    title: "Outerwear",
    subtitle: "Jackets and coats for every season",
    ctaText: "Layer Up",
    ctaLink: "/collections?category=outerwear",
    backgroundImage: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=1920&q=80",
    height: "60vh" as const,
  },
  {
    id: "footwear",
    label: "Step In Style",
    title: "Footwear",
    subtitle: "Complete your look from the ground up",
    ctaText: "Step In",
    ctaLink: "/collections?category=footwear",
    backgroundImage: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=1920&q=80",
    height: "50vh" as const,
  },
  {
    id: "accessories",
    label: "Finishing Touch",
    title: "Accessories",
    subtitle: "The details that make the difference",
    ctaText: "Accessorize",
    ctaLink: "/collections?category=accessories",
    backgroundImage: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=1920&q=80",
    height: "50vh" as const,
  },
  {
    id: "bags",
    label: "Carry in Style",
    title: "Bags",
    subtitle: "Luxury handbags & designer pieces",
    ctaText: "Shop Bags",
    ctaLink: "/category/bags-accessories",
    backgroundImage: "/bags/collection-hero.jpg",
    height: "50vh" as const,
  },
];

export const CategoryShowcase = () => {
  return (
    <div className="flex flex-col">
      {categories.map((category, index) => (
        <FullWidthImageSection
          key={category.id}
          label={category.label}
          title={category.title}
          subtitle={category.subtitle}
          ctaText={category.ctaText}
          ctaLink={category.ctaLink}
          backgroundImage={category.backgroundImage}
          height={category.height}
          contentAlign={index % 2 === 0 ? "center" : "left"}
          overlayOpacity="medium"
        />
      ))}
    </div>
  );
};
