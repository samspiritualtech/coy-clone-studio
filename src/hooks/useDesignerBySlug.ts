import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Designer } from "@/types";

export const useDesignerBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['designer', 'slug', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('designers')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return {
        ...data,
        product_images: Array.isArray(data.product_images) 
          ? data.product_images 
          : []
      } as Designer;
    },
    enabled: !!slug,
  });
};
