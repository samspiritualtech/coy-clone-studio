import { useState, useEffect, useCallback } from "react";
import { Product } from "@/types";
import { recommendationService } from "@/services/recommendationService";

type RecommendationType = 'similar' | 'brand' | 'search' | 'category' | 'image';

interface UseRecommendationsParams {
  productId?: string;
  brandName?: string;
  query?: string;
  category?: string;
  imageBase64?: string;
}

interface UseRecommendationsResult {
  recommendations: Product[];
  isLoading: boolean;
  error: string | null;
  attributes?: any;
  refetch: () => void;
}

export const useRecommendations = (
  type: RecommendationType,
  params: UseRecommendationsParams,
  enabled = true
): UseRecommendationsResult => {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attributes, setAttributes] = useState<any>(null);

  const fetchRecommendations = useCallback(async () => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);

    try {
      let result: Product[] = [];

      switch (type) {
        case 'similar':
          if (params.productId) {
            result = await recommendationService.getSimilarProducts(params.productId);
          }
          break;

        case 'brand':
          if (params.brandName) {
            result = await recommendationService.getBrandRecommendations(
              params.brandName,
              params.productId
            );
          }
          break;

        case 'search':
          if (params.query) {
            result = await recommendationService.getSearchRecommendations(params.query);
          }
          break;

        case 'category':
          if (params.category) {
            result = await recommendationService.getCategoryRecommendations(params.category);
          }
          break;

        case 'image':
          if (params.imageBase64) {
            const imageResult = await recommendationService.getImageRecommendations(params.imageBase64);
            result = imageResult.products;
            setAttributes(imageResult.attributes);
          }
          break;
      }

      setRecommendations(result);
    } catch (err) {
      console.error('useRecommendations error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load recommendations');
      setRecommendations([]);
    } finally {
      setIsLoading(false);
    }
  }, [type, params.productId, params.brandName, params.query, params.category, params.imageBase64, enabled]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  return {
    recommendations,
    isLoading,
    error,
    attributes,
    refetch: fetchRecommendations
  };
};
