import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Package, Truck, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSellerOrders } from '@/hooks/seller/useSellerOrders';
import { OrderStatus } from '@/types/seller';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

const statusConfig: Record<OrderStatus, { label: string; icon: React.ElementType; className: string }> = {
  new: { label: 'New', icon: Clock, className: 'bg-blue-100 text-blue-700' },
  accepted: { label: 'Accepted', icon: Package, className: 'bg-yellow-100 text-yellow-700' },
  packed: { label: 'Packed', icon: Package, className: 'bg-orange-100 text-orange-700' },
  shipped: { label: 'Shipped', icon: Truck, className: 'bg-purple-100 text-purple-700' },
  delivered: { label: 'Delivered', icon: CheckCircle2, className: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Cancelled', icon: XCircle, className: 'bg-red-100 text-red-700' },
};

const SellerOrders = () => {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { orders, isLoading } = useSellerOrders(
    statusFilter === 'all' ? undefined : statusFilter
  );

  const filteredOrders = orders.filter(o =>
    o.order_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-muted-foreground">
          Manage and fulfill customer orders
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by order number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as OrderStatus | 'all')}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
            <TabsTrigger value="accepted">Accepted</TabsTrigger>
            <TabsTrigger value="shipped">Shipped</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const status = statusConfig[order.status];
            const StatusIcon = status.icon;
            
            return (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">#{order.order_number}</span>
                        <Badge className={status.className}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {status.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Placed on {format(new Date(order.created_at), 'MMM d, yyyy')}
                      </p>
                      <p className="text-sm">
                        {order.shipping_address.full_name} • {order.shipping_address.city}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="font-semibold">{formatPrice(order.total)}</p>
                      <Button asChild size="sm">
                        <Link to={`/seller/orders/${order.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No orders found</h3>
          <p className="text-muted-foreground">
            {searchQuery || statusFilter !== 'all' 
              ? 'Try adjusting your filters'
              : 'Orders will appear here when customers purchase your products'}
          </p>
        </div>
      )}
    </div>
  );
};

export default SellerOrders;
