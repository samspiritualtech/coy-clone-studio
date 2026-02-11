import { Link } from "react-router-dom";
import type { CatalogProduct } from "@/data/productCatalog";

interface CatalogProductCardProps {
  product: CatalogProduct;
}

export const CatalogProductCard = ({ product }: CatalogProductCardProps) => {
  return (
    <Link
      to={`/product/${product.id}`}
      className="group block rounded-2xl overflow-hidden bg-card shadow-sm hover:shadow-lg transition-shadow duration-300"
    >
      <div className="aspect-[3/4] overflow-hidden bg-muted">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          loading="lazy"
          onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
        />
      </div>
      <div className="p-4">
        <h3 className="text-sm font-medium text-foreground truncate">
          {product.title}
        </h3>
        <p className="text-base font-semibold text-foreground mt-1">
          ₹{product.price.toLocaleString("en-IN")}
        </p>
      </div>
    </Link>
  );
};
