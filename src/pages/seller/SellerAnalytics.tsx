import { BarChart3, TrendingUp, Eye, ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSellerDashboard } from '@/hooks/seller/useSellerDashboard';

const SellerAnalytics = () => {
  const { data: stats, isLoading } = useSellerDashboard();

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">
          Track your store performance
        </p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold">{stats?.totalProducts || 0}</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <BarChart3 className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Live Products</p>
                <p className="text-2xl font-bold">{stats?.liveProducts || 0}</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <Eye className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month Orders</p>
                <p className="text-2xl font-bold">{stats?.todayOrders || 0}</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <ShoppingCart className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                <p className="text-2xl font-bold">{formatPrice(stats?.monthlyRevenue || 0)}</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Placeholder for charts */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-muted/50 rounded-lg">
            <div className="text-center text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-4" />
              <p>Charts coming soon</p>
              <p className="text-sm">We're working on detailed analytics for you</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Note */}
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> Analytics data is refreshed daily. Real-time dashboards are coming in a future update.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SellerAnalytics;
