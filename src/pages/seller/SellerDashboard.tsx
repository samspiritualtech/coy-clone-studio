import { Link } from 'react-router-dom';
import { Plus, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardStats } from '@/components/seller/DashboardStats';
import { useSeller } from '@/contexts/SellerContext';
import { useSellerDashboard } from '@/hooks/seller/useSellerDashboard';

const SellerDashboard = () => {
  const { seller } = useSeller();
  const { data: stats, isLoading } = useSellerDashboard();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome back, {seller?.brand_name || 'Seller'}
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your store today.
          </p>
        </div>
        <Button asChild>
          <Link to="/seller/products/add">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <DashboardStats 
        stats={stats || {
          totalProducts: 0,
          liveProducts: 0,
          todayOrders: 0,
          pendingOrders: 0,
          monthlyRevenue: 0,
          lowStockProducts: [],
        }}
        isLoading={isLoading}
      />

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Low Stock Alert</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.lowStockProducts && stats.lowStockProducts.length > 0 ? (
              <div className="space-y-2">
                {stats.lowStockProducts.slice(0, 3).map((product) => (
                  <div key={product.id} className="flex items-center justify-between text-sm">
                    <span className="truncate max-w-[180px]">{product.title}</span>
                    <span className="text-destructive font-medium">{product.stock} left</span>
                  </div>
                ))}
                <Button variant="link" asChild className="px-0 mt-2">
                  <Link to="/seller/inventory" className="flex items-center gap-1">
                    Manage Inventory <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">All products well stocked!</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Pending Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.pendingOrders ? (
              <div className="space-y-2">
                <p className="text-3xl font-bold">{stats.pendingOrders}</p>
                <p className="text-sm text-muted-foreground">orders need attention</p>
                <Button variant="link" asChild className="px-0">
                  <Link to="/seller/orders" className="flex items-center gap-1">
                    View Orders <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No pending orders</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" asChild className="w-full justify-start">
              <Link to="/seller/products/add">
                <Plus className="h-4 w-4 mr-2" />
                Add New Product
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full justify-start">
              <Link to="/seller/support/new">
                Get Support
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SellerDashboard;
