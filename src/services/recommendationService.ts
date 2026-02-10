import { Product } from "@/types";

export const recommendationService = {
  async getSimilarProducts(_productId: string): Promise<Product[]> {
    return [];
  },

  async getBrandRecommendations(_brandName: string, _excludeProductId?: string): Promise<Product[]> {
    return [];
  },

  async getSearchRecommendations(_query: string): Promise<Product[]> {
    return [];
  },

  async getCategoryRecommendations(_category: string): Promise<Product[]> {
    return [];
  },

  async getImageRecommendations(_imageBase64: string): Promise<{ products: Product[]; attributes: any }> {
    return { products: [], attributes: null };
  }
};
