import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSeller } from '@/contexts/SellerContext';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface VariantWithProduct {
  id: string;
  product_id: string;
  size: string;
  color_name: string;
  stock_quantity: number;
  product: {
    id: string;
    title: string;
    images: string[];
  };
}

const SellerInventory = () => {
  const { seller } = useSeller();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(0);

  const { data: variants, isLoading } = useQuery({
    queryKey: ['seller-inventory', seller?.id],
    queryFn: async () => {
      if (!seller?.id) return [];

      const { data, error } = await supabase
        .from('product_variants')
        .select(`
          id,
          product_id,
          size,
          color_name,
          stock_quantity,
          product:products!inner(id, title, images, seller_id)
        `)
        .order('stock_quantity', { ascending: true });

      if (error) throw error;

      // Filter for seller's products
      return (data || []).filter(
        (v: { product: { seller_id: string } }) => v.product?.seller_id === seller.id
      ) as VariantWithProduct[];
    },
    enabled: !!seller?.id,
  });

  const updateStockMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      const { error } = await supabase
        .from('product_variants')
        .update({ stock_quantity: quantity })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-inventory'] });
      toast.success('Stock updated');
      setEditingId(null);
    },
    onError: () => {
      toast.error('Failed to update stock');
    },
  });

  const filteredVariants = (variants || []).filter(v =>
    v.product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.size.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.color_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const lowStockCount = (variants || []).filter(v => v.stock_quantity < 5).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Inventory</h1>
        <p className="text-muted-foreground">
          Manage stock levels for your products
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Variants</p>
            <p className="text-2xl font-bold">{variants?.length || 0}</p>
          </CardContent>
        </Card>
        <Card className={lowStockCount > 0 ? 'border-destructive/50' : ''}>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Low Stock</p>
            <p className="text-2xl font-bold text-destructive">{lowStockCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by product, size, or color..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Stock Levels</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : filteredVariants.length > 0 ? (
            <div className="space-y-2">
              {filteredVariants.map((variant) => (
                <div
                  key={variant.id}
                  className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50"
                >
                  <div className="w-12 h-12 rounded overflow-hidden bg-muted flex-shrink-0">
                    {variant.product.images?.[0] ? (
                      <img
                        src={variant.product.images[0] as string}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{variant.product.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {variant.size} / {variant.color_name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {variant.stock_quantity < 5 && (
                      <Badge variant="destructive">Low Stock</Badge>
                    )}
                    {editingId === variant.id ? (
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(Number(e.target.value))}
                          className="w-20"
                          min={0}
                        />
                        <Button
                          size="sm"
                          onClick={() => updateStockMutation.mutate({ id: variant.id, quantity: editValue })}
                          disabled={updateStockMutation.isPending}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingId(variant.id);
                          setEditValue(variant.stock_quantity);
                        }}
                      >
                        {variant.stock_quantity} in stock
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-muted-foreground">
              No variants found. Add products with variants to manage inventory.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SellerInventory;
