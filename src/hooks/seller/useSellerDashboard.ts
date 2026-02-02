import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSeller } from '@/contexts/SellerContext';
import { SellerDashboardStats } from '@/types/seller';

export const useSellerDashboard = () => {
  const { seller } = useSeller();

  return useQuery({
    queryKey: ['seller-dashboard', seller?.id],
    queryFn: async (): Promise<SellerDashboardStats> => {
      if (!seller?.id) {
        return {
          totalProducts: 0,
          liveProducts: 0,
          todayOrders: 0,
          pendingOrders: 0,
          monthlyRevenue: 0,
          lowStockProducts: [],
        };
      }

      // Get product counts
      const { count: totalProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('seller_id', seller.id);

      const { count: liveProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('seller_id', seller.id)
        .eq('status', 'live');

      // Get today's orders
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { count: todayOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('seller_id', seller.id)
        .gte('created_at', today.toISOString());

      // Get pending orders (new status)
      const { count: pendingOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('seller_id', seller.id)
        .eq('status', 'new');

      // Get monthly revenue
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const { data: monthlyOrdersData } = await supabase
        .from('orders')
        .select('total')
        .eq('seller_id', seller.id)
        .in('status', ['delivered', 'shipped', 'packed', 'accepted'])
        .gte('created_at', firstDayOfMonth.toISOString());

      const monthlyRevenue = (monthlyOrdersData || []).reduce(
        (sum, order) => sum + (order.total || 0),
        0
      );

      // Get low stock products (variants with stock < 5)
      const { data: lowStockData } = await supabase
        .from('product_variants')
        .select(`
          stock_quantity,
          product:products!inner(id, title, seller_id)
        `)
        .lt('stock_quantity', 5);

      const lowStockProducts = (lowStockData || [])
        .filter((v: { product: { seller_id: string } }) => v.product?.seller_id === seller.id)
        .slice(0, 5)
        .map((v: { product: { id: string; title: string }; stock_quantity: number }) => ({
          id: v.product.id,
          title: v.product.title,
          stock: v.stock_quantity,
        }));

      return {
        totalProducts: totalProducts || 0,
        liveProducts: liveProducts || 0,
        todayOrders: todayOrders || 0,
        pendingOrders: pendingOrders || 0,
        monthlyRevenue,
        lowStockProducts,
      };
    },
    enabled: !!seller?.id,
  });
};
