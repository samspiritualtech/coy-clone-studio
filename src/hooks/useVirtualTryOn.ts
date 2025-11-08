import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface TryOnParams {
  humanImageUrl: string;
  garmentImageUrl: string;
  garmentDescription?: string;
  category?: "upper_body" | "lower_body" | "dresses";
}

interface TryOnResult {
  output?: string[];
  error?: string;
  status?: string;
}

export const useVirtualTryOn = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<string | null>(null);

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('tryon-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    const { data } = supabase.storage
      .from('tryon-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const generateTryOn = async (params: TryOnParams): Promise<string | null> => {
    setIsGenerating(true);
    setProgress(10);
    setResult(null);

    try {
      setProgress(20);
      
      // Start generation
      const { data: functionData, error: functionError } = await supabase.functions.invoke(
        'virtual-tryon',
        {
          body: {
            humanImageUrl: params.humanImageUrl,
            garmentImageUrl: params.garmentImageUrl,
            garmentDescription: params.garmentDescription,
            category: params.category || "upper_body",
          }
        }
      );

      if (functionError) throw functionError;

      setProgress(40);

      // Handle direct output (non-async models)
      if (functionData?.output) {
        const imageUrl = Array.isArray(functionData.output) 
          ? functionData.output[0] 
          : functionData.output;
        
        setProgress(100);
        setResult(imageUrl);
        toast({
          title: "Try-on complete!",
          description: "Your virtual try-on is ready",
        });
        return imageUrl;
      }

      // Handle async prediction (polling)
      if (functionData?.id) {
        const predictionId = functionData.id;
        let attempts = 0;
        const maxAttempts = 60; // 2 minutes max

        while (attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const { data: statusData, error: statusError } = await supabase.functions.invoke(
            'virtual-tryon',
            {
              body: { predictionId }
            }
          );

          if (statusError) throw statusError;

          setProgress(40 + (attempts / maxAttempts) * 55);

          if (statusData?.status === 'succeeded' && statusData?.output) {
            const imageUrl = Array.isArray(statusData.output) 
              ? statusData.output[0] 
              : statusData.output;
            
            setProgress(100);
            setResult(imageUrl);
            toast({
              title: "Try-on complete!",
              description: "Your virtual try-on is ready",
            });
            return imageUrl;
          }

          if (statusData?.status === 'failed') {
            throw new Error(statusData?.error || 'Generation failed');
          }

          attempts++;
        }

        throw new Error('Generation timed out');
      }

      throw new Error('Unexpected response format');

    } catch (error) {
      console.error("Virtual try-on error:", error);
      toast({
        title: "Try-on failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const reset = () => {
    setIsGenerating(false);
    setProgress(0);
    setResult(null);
  };

  return {
    isGenerating,
    progress,
    result,
    generateTryOn,
    uploadImage,
    reset,
  };
};
