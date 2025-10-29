import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Designer } from "@/types";

export const useDesigners = (filters?: { search?: string; category?: string }) => {
  return useQuery({
    queryKey: ['designers', filters],
    queryFn: async () => {
      let query = supabase
        .from('designers')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply search filter
      if (filters?.search) {
        query = query.or(`brand_name.ilike.%${filters.search}%,name.ilike.%${filters.search}%,city.ilike.%${filters.search}%,category.ilike.%${filters.search}%`);
      }

      // Apply category filter
      if (filters?.category && filters.category !== 'All') {
        query = query.eq('category', filters.category);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Parse product_images from JSONB to array
      return (data || []).map((designer) => ({
        ...designer,
        product_images: Array.isArray(designer.product_images) 
          ? designer.product_images 
          : []
      })) as Designer[];
    },
  });
};

export const useDesigner = (id: string) => {
  return useQuery({
    queryKey: ['designer', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('designers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return null;

      // Parse product_images from JSONB to array
      return {
        ...data,
        product_images: Array.isArray(data.product_images) 
          ? data.product_images 
          : []
      } as Designer;
    },
    enabled: !!id,
  });
};
