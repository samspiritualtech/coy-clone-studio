import { FullWidthImageSection } from "./FullWidthImageSection";
import { Link } from "react-router-dom";
import topsHero from "@/assets/tops-hero.jpg";
import bottomsHero from "@/assets/bottoms-hero.jpg";
import outerwearHero from "@/assets/outerwear-hero.jpg";
import dressesHero from "@/assets/dresses-hero.jpg";
import footwearHero from "@/assets/footwear-hero.jpg";
import bagsHero from "@/assets/bags-hero.jpg";

const categories = [
  {
    id: "instagram-brands",
    label: "OGURA SOCIAL",
    title: "INSTAGRAM BRANDS",
    subtitle: "Discover trending fashion labels from Instagram creators",
    ctaText: "Explore Instagram Brands",
    ctaLink: "/collections?category=instagram",
    backgroundImage: "/instagram-brands-hero.png",
    height: "60vh" as const,
  },
  {
    id: "dresses",
    label: "Collection",
    title: "Dresses",
    subtitle: "Elegance for every occasion",
    ctaText: "Explore",
    ctaLink: "/collections?category=dresses",
    backgroundImage: dressesHero,
    height: "60vh" as const,
  },
  {
    id: "tops",
    label: "Essentials",
    title: "Tops",
    subtitle: "Refined basics to elevated statements",
    ctaText: "Shop Tops",
    ctaLink: "/collections?category=tops",
    backgroundImage: topsHero,
    height: "50vh" as const,
  },
  {
    id: "bottoms",
    label: "Foundation",
    title: "Bottoms",
    subtitle: "Tailored to perfection",
    ctaText: "View Collection",
    ctaLink: "/collections/bottoms",
    backgroundImage: bottomsHero,
    height: "50vh" as const,
  },
  {
    id: "outerwear",
    label: "Layer Up",
    title: "Outerwear",
    subtitle: "Jackets and coats for every season",
    ctaText: "Layer Up",
    ctaLink: "/collections/outerwear",
    backgroundImage: outerwearHero,
    height: "60vh" as const,
  },
  {
    id: "footwear",
    label: "Step In Style",
    title: "Footwear",
    subtitle: "Complete your look from the ground up",
    ctaText: "Step In",
    ctaLink: "/collections?category=footwear",
    backgroundImage: footwearHero,
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
    backgroundImage: bagsHero,
    height: "50vh" as const,
  },
];

export const CategoryShowcase = () => {
  return (
    <div className="flex flex-col">
      {categories.map((category, index) => {
        const section = (
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
        );

        if (index === 0) {
          return (
            <Link
              key={category.id}
              to={category.ctaLink}
              className="block rounded-2xl overflow-hidden mx-4 md:mx-8 my-6 shadow-lg hover:shadow-2xl transition-shadow duration-500 group"
            >
              <div className="relative w-full h-[60vh] overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[8000ms] ease-out group-hover:scale-105"
                  style={{ backgroundImage: `url(${category.backgroundImage})` }}
                />
                <span className="absolute top-5 left-5 text-white/70 text-xs uppercase tracking-[0.3em] z-10">
                  OGURA SOCIAL
                </span>
              </div>
            </Link>
          );
        }

        return section;
      })}
    </div>
  );
};
