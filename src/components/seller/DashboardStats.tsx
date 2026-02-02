import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Package, ShoppingCart, Wallet, AlertTriangle } from 'lucide-react';
import { SellerDashboardStats } from '@/types/seller';
import { cn } from '@/lib/utils';

interface DashboardStatsProps {
  stats: SellerDashboardStats;
  isLoading?: boolean;
}

export const DashboardStats = ({ stats, isLoading }: DashboardStatsProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      subtitle: `${stats.liveProducts} live`,
      icon: Package,
      href: '/seller/products',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: "Today's Orders",
      value: stats.todayOrders,
      subtitle: `${stats.pendingOrders} pending`,
      icon: ShoppingCart,
      href: '/seller/orders',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'This Month',
      value: formatCurrency(stats.monthlyRevenue),
      subtitle: 'Revenue',
      icon: Wallet,
      href: '/seller/payouts',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Low Stock',
      value: stats.lowStockProducts.length,
      subtitle: 'products need restock',
      icon: AlertTriangle,
      href: '/seller/inventory',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      highlight: stats.lowStockProducts.length > 0,
    },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-24 mb-4" />
              <div className="h-8 bg-muted rounded w-16 mb-2" />
              <div className="h-3 bg-muted rounded w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => (
        <Link key={stat.title} to={stat.href}>
          <Card 
            className={cn(
              'hover:shadow-md transition-shadow cursor-pointer',
              stat.highlight && 'border-red-200 bg-red-50/50'
            )}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </span>
                <div className={cn('p-2 rounded-lg', stat.bgColor)}>
                  <stat.icon className={cn('h-4 w-4', stat.color)} />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};
