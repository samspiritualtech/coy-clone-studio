import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSeller } from '@/contexts/SellerContext';
import { SellerProduct, ProductFormData, ProductStatus } from '@/types/seller';
import { toast } from 'sonner';

export const useSellerProducts = (status?: ProductStatus) => {
  const { seller } = useSeller();
  const queryClient = useQueryClient();

  const productsQuery = useQuery({
    queryKey: ['seller-products', seller?.id, status],
    queryFn: async () => {
      if (!seller?.id) return [];

      let query = supabase
        .from('products')
        .select('*')
        .eq('seller_id', seller.id)
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map(p => ({
        ...p,
        images: Array.isArray(p.images) ? p.images : [],
        colors: Array.isArray(p.colors) ? p.colors : [],
        sizes: Array.isArray(p.sizes) ? p.sizes : [],
        occasion_tags: Array.isArray(p.occasion_tags) ? p.occasion_tags : [],
        style_tags: Array.isArray(p.style_tags) ? p.style_tags : [],
      })) as SellerProduct[];
    },
    enabled: !!seller?.id,
  });

  const createProductMutation = useMutation({
    mutationFn: async (data: Partial<ProductFormData>) => {
      if (!seller?.id) throw new Error('Seller not found');

      const { data: product, error } = await supabase
        .from('products')
        .insert({
          seller_id: seller.id,
          title: data.title || 'Untitled Product',
          price: data.price || 0,
          category: 'dresses', // Default category
          status: 'draft',
          images: data.images || [],
          colors: [],
          sizes: [],
          short_description: data.short_description,
          description: data.description,
          fabric: data.fabric,
          care_instructions: data.care_instructions,
          category_id: data.category_id,
          occasion_tags: data.occasion_tags || [],
          style_tags: data.style_tags || [],
          dispatch_days: data.dispatch_days || 7,
          is_made_to_order: data.is_made_to_order || false,
          is_returnable: data.is_returnable ?? true,
          is_available: true,
        })
        .select()
        .single();

      if (error) throw error;
      return product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-products'] });
      toast.success('Product created as draft');
    },
    onError: (error) => {
      console.error('Create product error:', error);
      toast.error('Failed to create product');
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<SellerProduct> }) => {
      const { data: product, error } = await supabase
        .from('products')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-products'] });
      toast.success('Product updated');
    },
    onError: (error) => {
      console.error('Update product error:', error);
      toast.error('Failed to update product');
    },
  });

  const submitProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data: product, error } = await supabase
        .from('products')
        .update({ status: 'submitted' })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-products'] });
      toast.success('Product submitted for review');
    },
    onError: (error) => {
      console.error('Submit product error:', error);
      toast.error('Failed to submit product');
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-products'] });
      toast.success('Product deleted');
    },
    onError: (error) => {
      console.error('Delete product error:', error);
      toast.error('Failed to delete product');
    },
  });

  return {
    products: productsQuery.data || [],
    isLoading: productsQuery.isLoading,
    error: productsQuery.error,
    createProduct: createProductMutation.mutateAsync,
    updateProduct: updateProductMutation.mutateAsync,
    submitProduct: submitProductMutation.mutateAsync,
    deleteProduct: deleteProductMutation.mutateAsync,
    isCreating: createProductMutation.isPending,
    isUpdating: updateProductMutation.isPending,
  };
};
