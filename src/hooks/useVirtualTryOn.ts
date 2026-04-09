import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface TryOnParams {
  humanImageUrl: string;
  garmentImageUrl: string;
  garmentDescription?: string;
  category?: "upper_body" | "lower_body" | "dresses";
}

export const useVirtualTryOn = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<string | null>(null);

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('tryon-images')
      .upload(fileName, file, { cacheControl: '3600', upsert: false });

    if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

    const { data } = supabase.storage.from('tryon-images').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const generateTryOn = async (params: TryOnParams): Promise<string | null> => {
    setIsGenerating(true);
    setProgress(10);

    try {
      setProgress(30);

      const { data, error } = await supabase.functions.invoke('virtual-tryon', {
        body: {
          humanImageUrl: params.humanImageUrl,
          garmentImageUrl: params.garmentImageUrl,
          garmentDescription: params.garmentDescription,
          category: params.category || "upper_body",
        },
      });

      if (error) throw error;

      setProgress(80);

      // Handle model loading
      if (data?.loading) {
        toast({
          title: "Model is warming up",
          description: "Please try again in a few seconds",
        });
        return null;
      }

      // Direct output (base64 data URL)
      if (data?.output) {
        const imageUrl = typeof data.output === 'string' ? data.output : data.output[0];
        setProgress(100);
        setResult(imageUrl);
        toast({ title: "Try-on complete!", description: "Your virtual try-on is ready" });
        return imageUrl;
      }

      throw new Error(data?.error || 'Unexpected response format');
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

  return { isGenerating, progress, result, generateTryOn, uploadImage, reset };
};
