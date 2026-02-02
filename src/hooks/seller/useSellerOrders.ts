import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSeller } from '@/contexts/SellerContext';
import { Order, OrderStatus } from '@/types/seller';
import { toast } from 'sonner';

export const useSellerOrders = (status?: OrderStatus) => {
  const { seller } = useSeller();
  const queryClient = useQueryClient();

  const ordersQuery = useQuery({
    queryKey: ['seller-orders', seller?.id, status],
    queryFn: async () => {
      if (!seller?.id) return [];

      let query = supabase
        .from('orders')
        .select('*')
        .eq('seller_id', seller.id)
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || []) as Order[];
    },
    enabled: !!seller?.id,
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ 
      orderId, 
      status, 
      trackingId,
      shippingCarrier 
    }: { 
      orderId: string; 
      status: OrderStatus;
      trackingId?: string;
      shippingCarrier?: string;
    }) => {
      const updateData: Record<string, unknown> = { status };
      
      // Set appropriate timestamp based on status
      const now = new Date().toISOString();
      switch (status) {
        case 'accepted':
          updateData.accepted_at = now;
          break;
        case 'packed':
          updateData.packed_at = now;
          break;
        case 'shipped':
          updateData.shipped_at = now;
          if (trackingId) updateData.tracking_id = trackingId;
          if (shippingCarrier) updateData.shipping_carrier = shippingCarrier;
          break;
        case 'delivered':
          updateData.delivered_at = now;
          break;
        case 'cancelled':
          updateData.cancelled_at = now;
          break;
      }

      const { data, error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;
      return data as Order;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['seller-orders'] });
      toast.success(`Order ${variables.status}`);
    },
    onError: (error) => {
      console.error('Update order error:', error);
      toast.error('Failed to update order');
    },
  });

  const getOrderWithItems = async (orderId: string) => {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError) throw orderError;

    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select(`
        *,
        product:products(*)
      `)
      .eq('order_id', orderId);

    if (itemsError) throw itemsError;

    return { order: order as Order, items };
  };

  return {
    orders: ordersQuery.data || [],
    isLoading: ordersQuery.isLoading,
    error: ordersQuery.error,
    updateOrderStatus: updateOrderStatusMutation.mutateAsync,
    isUpdating: updateOrderStatusMutation.isPending,
    getOrderWithItems,
  };
};
