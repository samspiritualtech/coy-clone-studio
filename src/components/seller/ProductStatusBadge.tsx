import { Badge } from '@/components/ui/badge';
import { ProductStatus } from '@/types/seller';
import { cn } from '@/lib/utils';

interface ProductStatusBadgeProps {
  status: ProductStatus;
  className?: string;
}

const statusConfig: Record<ProductStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; className: string }> = {
  draft: {
    label: 'Draft',
    variant: 'secondary',
    className: 'bg-gray-100 text-gray-700 hover:bg-gray-100',
  },
  submitted: {
    label: 'Submitted',
    variant: 'outline',
    className: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50',
  },
  under_review: {
    label: 'Under Review',
    variant: 'outline',
    className: 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-50',
  },
  live: {
    label: 'Live',
    variant: 'default',
    className: 'bg-green-100 text-green-700 hover:bg-green-100',
  },
  rejected: {
    label: 'Rejected',
    variant: 'destructive',
    className: 'bg-red-100 text-red-700 hover:bg-red-100',
  },
  disabled: {
    label: 'Disabled',
    variant: 'secondary',
    className: 'bg-gray-100 text-gray-500 hover:bg-gray-100',
  },
};

export const ProductStatusBadge = ({ status, className }: ProductStatusBadgeProps) => {
  const config = statusConfig[status];
  
  return (
    <Badge 
      variant={config.variant}
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  );
};
