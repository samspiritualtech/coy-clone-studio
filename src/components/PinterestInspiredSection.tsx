import { useNavigate } from "react-router-dom";
import { products } from "@/data/products";
import { SaveToPinterestButton } from "./SaveToPinterestButton";
import { OptimizedImage } from "./OptimizedImage";
import { ConnectPinterestButton } from "./ConnectPinterestButton";
import { UserPinterestBoards } from "./UserPinterestBoards";
import { Tilt3D } from "@/components/luxury3d/Tilt3D";


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
        <div className="flex items-center justify-between mb-10">
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 24 24" className="w-7 h-7 text-destructive fill-current">
              <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
            </svg>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Inspired by Pinterest
            </h2>
          </div>
          <div className="flex-1 flex justify-end">
            <ConnectPinterestButton />
          </div>
        </div>
        <p className="text-center text-muted-foreground mb-12 max-w-lg mx-auto">
          Curated looks from our collection — save your favourites or shop them instantly.
        </p>

        {/* Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {curatedProducts.map((product, i) => {
            const productUrl = `${baseUrl}/product/${product.id}`;
            const imageUrl = product.images[0];
            const aspect = i % 3 === 0 ? "aspect-[3/4]" : i % 3 === 1 ? "aspect-[4/5]" : "aspect-[2/3]";

            const depths = [4, 8, 6, 10, 5, 7];
            const max = depths[i % depths.length];
            return (
              <Tilt3D
                key={product.id}
                max={max}
                scale={1.025}
                className="break-inside-avoid mb-4 block"
              >
                <div
                  className="group relative rounded-xl overflow-hidden cursor-pointer luxury-depth luxury-spotlight luxury-hairline-gold bg-card"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <OptimizedImage
                    src={imageUrl}
                    alt={product.name}
                    className={aspect}
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-end gap-3 p-5 z-10">
                    <span className="luxury-cta-glass luxury-sweep">Shop This Look</span>
                    <span className="text-white/85 text-xs line-clamp-1">{product.name}</span>
                    <span className="text-white font-light text-lg" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* Pinterest save */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                    <SaveToPinterestButton
                      productUrl={productUrl}
                      imageUrl={imageUrl}
                      description={`${product.name} — Shop now on Ogura`}
                    />
                  </div>

                  {/* Brand tag */}
                  <div className="absolute bottom-3 left-3 luxury-glass luxury-hairline-gold rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    {product.brand || "Ogura"}
                  </div>
                </div>
              </Tilt3D>
            );


          })}
        </div>

        {/* User's Pinterest Boards */}
        <UserPinterestBoards />
      </div>
    </section>
  );
};
