import { LuxeEdit } from "@/data/oguraCategories";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface LuxeEditSectionProps {
  luxeEdit: LuxeEdit;
  categorySlug: string;
}

export const LuxeEditSection = ({
  luxeEdit,
  categorySlug,
}: LuxeEditSectionProps) => {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-r from-[#F5F0E6] to-[#EDE5D8]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            <span className="text-xs md:text-sm uppercase tracking-[0.2em] text-[#C9A962] font-medium">
              Exclusive Collection
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-serif text-[#4A3728] mt-3 mb-4 lg:mb-6 leading-tight">
              {luxeEdit.title}
            </h2>
            <p className="text-sm md:text-base lg:text-lg text-[#6B5B4F] leading-relaxed max-w-lg mx-auto lg:mx-0">
              {luxeEdit.description}
            </p>
            <Link to={`/collections?category=${categorySlug}`}>
              <Button
                className="mt-6 lg:mt-8 bg-[#4A3728] hover:bg-[#3A2A1E] text-white px-6 lg:px-8 py-5 lg:py-6 text-sm font-medium tracking-wide group"
              >
                Explore Collection
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          {/* Images Grid */}
          <div className="order-1 lg:order-2">
            {luxeEdit.images.length === 3 ? (
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div className="col-span-2 md:col-span-1 md:row-span-2">
                  <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-xl">
                    <img
                      src={luxeEdit.images[0]}
                      alt={luxeEdit.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>
                <div className="aspect-[4/3] md:aspect-[3/4] rounded-xl overflow-hidden shadow-lg">
                  <img
                    src={luxeEdit.images[1]}
                    alt={luxeEdit.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="aspect-[4/3] md:aspect-[3/4] rounded-xl overflow-hidden shadow-lg">
                  <img
                    src={luxeEdit.images[2]}
                    alt={luxeEdit.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {luxeEdit.images.map((image, idx) => (
                  <div
                    key={idx}
                    className="aspect-[3/4] rounded-xl overflow-hidden shadow-lg"
                  >
                    <img
                      src={image}
                      alt={`${luxeEdit.title} ${idx + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
