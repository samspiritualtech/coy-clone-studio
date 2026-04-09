import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface TryOnParams {
  humanImageUrl: string;
  garmentImageUrl: string;
  garmentDescription?: string;
  category?: "upper_body" | "lower_body" | "dresses";
}

const GENERATION_TIMEOUT_SECONDS = 90;
const RETRY_DELAY_MS = 3000;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const isLoadingMessage = (message?: string | null) =>
  /loading|warming|busy|queue|starting|cold start|503|timeout/i.test(message ?? "");

const normalizeImage = (image: unknown): string | null => {
  if (typeof image === "string") return image;
  if (Array.isArray(image) && typeof image[0] === "string") return image[0];
  return null;
};

const parseInvokeError = async (
  error: unknown,
): Promise<{ loading: boolean; message: string }> => {
  const fallbackMessage =
    error instanceof Error ? error.message : "Unable to generate virtual try-on";
  const ctx = (error as { context?: Response })?.context;

  if (ctx && typeof ctx.clone === "function") {
    try {
      const body = await ctx.clone().json();
      const message =
        typeof body?.error === "string"
          ? body.error
          : typeof body?.message === "string"
            ? body.message
            : fallbackMessage;

      return {
        loading: Boolean(body?.loading) || isLoadingMessage(message),
        message,
      };
    } catch {
      try {
        const text = await ctx.clone().text();
        return {
          loading: isLoadingMessage(text) || isLoadingMessage(fallbackMessage),
          message: text || fallbackMessage,
        };
      } catch {
        return {
          loading: isLoadingMessage(fallbackMessage),
          message: fallbackMessage,
        };
      }
    }
  }

  return {
    loading: isLoadingMessage(fallbackMessage),
    message: fallbackMessage,
  };
};

export const useVirtualTryOn = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(GENERATION_TIMEOUT_SECONDS);

  useEffect(() => {
    if (!isGenerating) return;

    const startedAt = Date.now();
    setProgress(0);
    setTimeLeft(GENERATION_TIMEOUT_SECONDS);

    const interval = window.setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - startedAt) / 1000);
      const remainingSeconds = Math.max(
        GENERATION_TIMEOUT_SECONDS - elapsedSeconds,
        0,
      );

      setTimeLeft(remainingSeconds);
      setProgress(Math.min((elapsedSeconds / GENERATION_TIMEOUT_SECONDS) * 100, 99));

      if (remainingSeconds <= 0) {
        window.clearInterval(interval);
      }
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isGenerating]);

  const uploadImage = async (file: File): Promise<string> => {
    console.log("Uploading try-on image", {
      name: file.name,
      size: file.size,
      type: file.type,
    });

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('tryon-images')
      .upload(fileName, file, { cacheControl: '3600', upsert: false });

    if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

    const { data } = supabase.storage.from('tryon-images').getPublicUrl(fileName);
    console.log("Try-on image uploaded", { fileName, publicUrl: data.publicUrl });
    return data.publicUrl;
  };

  const generateTryOn = async (params: TryOnParams): Promise<string | null> => {
    setIsGenerating(true);
    setResult(null);
    setTimeLeft(GENERATION_TIMEOUT_SECONDS);

    try {
      const deadline = Date.now() + GENERATION_TIMEOUT_SECONDS * 1000;
      let hasShownLoadingToast = false;

      while (Date.now() < deadline) {
        console.log("Calling virtual-tryon edge function...", {
          humanImageUrl: params.humanImageUrl?.substring(0, 80),
          garmentImageUrl: params.garmentImageUrl?.substring(0, 80),
          category: params.category || "upper_body",
        });

        const { data, error } = await supabase.functions.invoke('virtual-tryon', {
          body: {
            humanImageUrl: params.humanImageUrl,
            garmentImageUrl: params.garmentImageUrl,
            garmentDescription: params.garmentDescription,
            category: params.category || "upper_body",
          },
        });

        console.log("Edge function response:", { data, error });

        if (error) {
          const parsedError = await parseInvokeError(error);

          if (parsedError.loading) {
            if (!hasShownLoadingToast) {
              hasShownLoadingToast = true;
              toast({
                title: "Model is starting up",
                description: "Please wait 30-60 seconds and try again",
              });
            }

            const remaining = deadline - Date.now();
            if (remaining <= RETRY_DELAY_MS) break;
            await wait(Math.min(RETRY_DELAY_MS, remaining));
            continue;
          }

          throw new Error(parsedError.message);
        }

        const imageUrl = normalizeImage(data?.image || data?.output);

        if (data?.success && imageUrl) {
          setProgress(100);
          setTimeLeft(0);
          setResult(imageUrl);
          toast({
            title: "Try-on complete!",
            description: "Your virtual try-on is ready",
          });
          return imageUrl;
        }

        if (data?.loading || isLoadingMessage(data?.error)) {
          if (!hasShownLoadingToast) {
            hasShownLoadingToast = true;
            toast({
              title: "Model is starting up",
              description: "Please wait 30-60 seconds and try again",
            });
          }

          const remaining = deadline - Date.now();
          if (remaining <= RETRY_DELAY_MS) break;
          await wait(Math.min(RETRY_DELAY_MS, remaining));
          continue;
        }

        if (imageUrl) {
          setProgress(100);
          setTimeLeft(0);
          setResult(imageUrl);
          toast({
            title: "Try-on complete!",
            description: "Your virtual try-on is ready",
          });
          return imageUrl;
        }

        throw new Error(data?.error || 'Unexpected response format');
      }

      toast({
        title: "Model is still warming up",
        description: "Please wait 30-60 seconds and try again",
      });
      return null;
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
    setTimeLeft(GENERATION_TIMEOUT_SECONDS);
    setResult(null);
  };

  return {
    isGenerating,
    progress,
    result,
    timeLeft,
    generateTryOn,
    uploadImage,
    reset,
  };
};
