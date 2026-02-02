import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SellerProduct } from '@/types/seller';
import { ProductStatusBadge } from './ProductStatusBadge';
import { MoreVertical, Edit, Eye, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ProductGalleryCardProps {
  product: SellerProduct;
  onDelete?: (id: string) => void;
}

export const ProductGalleryCard = ({ product, onDelete }: ProductGalleryCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const coverImage = product.images?.[0] || '/placeholder.svg';

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <img
          src={coverImage}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 left-2">
          <ProductStatusBadge status={product.status} />
        </div>
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to={`/seller/products/${product.id}/edit`} className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              {product.status === 'live' && (
                <DropdownMenuItem asChild>
                  <Link to={`/product/${product.id}`} className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    View in Store
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onDelete?.(product.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium text-sm line-clamp-2 mb-1">{product.title}</h3>
        <div className="flex items-center gap-2">
          <span className="font-semibold">{formatPrice(product.price)}</span>
          {product.original_price && product.original_price > product.price && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.original_price)}
            </span>
          )}
        </div>
        {product.rejection_reason && product.status === 'rejected' && (
          <p className="mt-2 text-xs text-destructive line-clamp-2">
            {product.rejection_reason}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
