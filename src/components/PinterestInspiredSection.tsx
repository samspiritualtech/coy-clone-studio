import { useNavigate } from "react-router-dom";
import { products } from "@/data/products";
import { SaveToPinterestButton } from "./SaveToPinterestButton";
import { OptimizedImage } from "./OptimizedImage";
import { ConnectPinterestButton } from "./ConnectPinterestButton";
import { UserPinterestBoards } from "./UserPinterestBoards";

const curatedProducts = products
  .filter((p) => p.images?.[0]?.startsWith("http"))
  .slice(0, 9);

export const PinterestInspiredSection = () => {
  const navigate = useNavigate();
  const baseUrl = window.location.origin;

  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <svg viewBox="0 0 24 24" className="w-7 h-7 text-destructive fill-current">
            <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
          </svg>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Inspired by Pinterest
          </h2>
        </div>
        <p className="text-center text-muted-foreground mb-12 max-w-lg mx-auto">
          Curated looks from our collection — save your favourites or shop them instantly.
        </p>

        {/* Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {curatedProducts.map((product, i) => {
            const productUrl = `${baseUrl}/product/${product.id}`;
            const imageUrl = product.images[0];
            // Alternate aspect ratios for masonry effect
            const aspect = i % 3 === 0 ? "aspect-[3/4]" : i % 3 === 1 ? "aspect-[4/5]" : "aspect-[2/3]";

            return (
              <div
                key={product.id}
                className="break-inside-avoid group relative rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300 bg-card"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <OptimizedImage
                  src={imageUrl}
                  alt={product.name}
                  className={aspect}
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 p-4">
                  <span className="text-white text-sm font-semibold uppercase tracking-widest">
                    Shop This Look
                  </span>
                  <span className="text-white/80 text-xs line-clamp-1">{product.name}</span>
                  <span className="text-white font-bold text-lg">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>
                </div>

                {/* Pinterest save */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <SaveToPinterestButton
                    productUrl={productUrl}
                    imageUrl={imageUrl}
                    description={`${product.name} — Shop now on Ogura`}
                  />
                </div>

                {/* Brand tag */}
                <div className="absolute bottom-3 left-3 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  {product.brand || "Ogura"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
