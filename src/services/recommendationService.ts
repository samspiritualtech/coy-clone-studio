import { supabase } from "@/integrations/supabase/client";
import { products } from "@/data/products";
import { Product } from "@/types";

// Prepare minimal product data for AI
const getProductsForAI = () => {
  return products.map(p => ({
    id: p.id,
    name: p.name,
    brand: p.brand,
    category: p.category,
    price: p.price,
    description: p.description,
    tags: p.tags,
    colors: p.colors,
    material: p.material
  }));
};

// Get product by ID
const getProductById = (id: string): Product | undefined => {
  return products.find(p => p.id === id);
};

// Fallback: filter products locally
const getFallbackSimilar = (productId: string, limit = 8): Product[] => {
  const product = getProductById(productId);
  if (!product) return products.slice(0, limit);
  
  return products
    .filter(p => p.id !== productId && p.category === product.category)
    .slice(0, limit);
};

const getFallbackBrand = (brandName: string, excludeId?: string, limit = 8): Product[] => {
  return products
    .filter(p => p.brand === brandName && p.id !== excludeId)
    .slice(0, limit);
};

const getFallbackSearch = (query: string, limit = 8): Product[] => {
  const search = query.toLowerCase();
  return products
    .filter(p => 
      p.name.toLowerCase().includes(search) ||
      p.brand.toLowerCase().includes(search) ||
      p.category.toLowerCase().includes(search) ||
      p.description.toLowerCase().includes(search)
    )
    .slice(0, limit);
};

const getFallbackCategory = (category: string, limit = 8): Product[] => {
  return products
    .filter(p => p.category === category.toLowerCase())
    .sort((a, b) => {
      const aScore = (a.tags.includes('trending') ? 2 : 0) + (a.tags.includes('new-arrivals') ? 1 : 0);
      const bScore = (b.tags.includes('trending') ? 2 : 0) + (b.tags.includes('new-arrivals') ? 1 : 0);
      return bScore - aScore;
    })
    .slice(0, limit);
};

export const recommendationService = {
  async getSimilarProducts(productId: string): Promise<Product[]> {
    try {
      const product = getProductById(productId);
      if (!product) return getFallbackSimilar(productId);

      const { data, error } = await supabase.functions.invoke('ai-recommendations', {
        body: {
          type: 'similar',
          productId,
          productData: {
            name: product.name,
            brand: product.brand,
            category: product.category,
            price: product.price,
            description: product.description,
            material: product.material,
            colors: product.colors.map(c => c.name)
          },
          allProducts: getProductsForAI()
        }
      });

      if (error) {
        console.error('AI recommendation error:', error);
        return getFallbackSimilar(productId);
      }

      const productIds: string[] = data?.productIds || [];
      if (productIds.length === 0) return getFallbackSimilar(productId);

      const recommendedProducts = productIds
        .map(id => getProductById(id))
        .filter((p): p is Product => p !== undefined);

      return recommendedProducts.length > 0 ? recommendedProducts : getFallbackSimilar(productId);
    } catch (error) {
      console.error('getSimilarProducts error:', error);
      return getFallbackSimilar(productId);
    }
  },

  async getBrandRecommendations(brandName: string, excludeProductId?: string): Promise<Product[]> {
    try {
      const { data, error } = await supabase.functions.invoke('ai-recommendations', {
        body: {
          type: 'brand',
          productId: excludeProductId,
          brandName,
          allProducts: getProductsForAI()
        }
      });

      if (error) {
        console.error('AI recommendation error:', error);
        return getFallbackBrand(brandName, excludeProductId);
      }

      const productIds: string[] = data?.productIds || [];
      if (productIds.length === 0) return getFallbackBrand(brandName, excludeProductId);

      const recommendedProducts = productIds
        .map(id => getProductById(id))
        .filter((p): p is Product => p !== undefined);

      return recommendedProducts.length > 0 ? recommendedProducts : getFallbackBrand(brandName, excludeProductId);
    } catch (error) {
      console.error('getBrandRecommendations error:', error);
      return getFallbackBrand(brandName, excludeProductId);
    }
  },

  async getSearchRecommendations(query: string): Promise<Product[]> {
    try {
      const { data, error } = await supabase.functions.invoke('ai-recommendations', {
        body: {
          type: 'search',
          query,
          allProducts: getProductsForAI()
        }
      });

      if (error) {
        console.error('AI recommendation error:', error);
        return getFallbackSearch(query);
      }

      const productIds: string[] = data?.productIds || [];
      if (productIds.length === 0) return getFallbackSearch(query);

      const recommendedProducts = productIds
        .map(id => getProductById(id))
        .filter((p): p is Product => p !== undefined);

      return recommendedProducts.length > 0 ? recommendedProducts : getFallbackSearch(query);
    } catch (error) {
      console.error('getSearchRecommendations error:', error);
      return getFallbackSearch(query);
    }
  },

  async getCategoryRecommendations(category: string): Promise<Product[]> {
    try {
      const { data, error } = await supabase.functions.invoke('ai-recommendations', {
        body: {
          type: 'category',
          category,
          allProducts: getProductsForAI()
        }
      });

      if (error) {
        console.error('AI recommendation error:', error);
        return getFallbackCategory(category);
      }

      const productIds: string[] = data?.productIds || [];
      if (productIds.length === 0) return getFallbackCategory(category);

      const recommendedProducts = productIds
        .map(id => getProductById(id))
        .filter((p): p is Product => p !== undefined);

      return recommendedProducts.length > 0 ? recommendedProducts : getFallbackCategory(category);
    } catch (error) {
      console.error('getCategoryRecommendations error:', error);
      return getFallbackCategory(category);
    }
  },

  async getImageRecommendations(imageBase64: string): Promise<{ products: Product[]; attributes: any }> {
    try {
      const { data, error } = await supabase.functions.invoke('image-analysis', {
        body: {
          imageBase64,
          allProducts: getProductsForAI()
        }
      });

      if (error) {
        console.error('Image analysis error:', error);
        return { products: products.slice(0, 8), attributes: null };
      }

      const productIds: string[] = data?.productIds || [];
      const attributes = data?.attributes;

      if (productIds.length === 0) {
        // Fallback: filter by detected category
        const category = attributes?.category || 'dresses';
        return { 
          products: products.filter(p => p.category === category).slice(0, 8),
          attributes 
        };
      }

      const recommendedProducts = productIds
        .map(id => getProductById(id))
        .filter((p): p is Product => p !== undefined);

      return { 
        products: recommendedProducts.length > 0 ? recommendedProducts : products.slice(0, 8),
        attributes 
      };
    } catch (error) {
      console.error('getImageRecommendations error:', error);
      return { products: products.slice(0, 8), attributes: null };
    }
  }
};
