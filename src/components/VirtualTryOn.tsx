import { useState } from "react";
import { useVirtualTryOn } from "@/hooks/useVirtualTryOn";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ImageUploadZone } from "./ImageUploadZone";
import { ModelGallery } from "./ModelGallery";
import { TryOnResult } from "./TryOnResult";
import { ModelPreset } from "@/data/modelPresets";
import { Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface VirtualTryOnProps {
  productImageUrl: string;
  productName: string;
  category?: "upper_body" | "lower_body" | "dresses";
}

export const VirtualTryOn = ({
  productImageUrl,
  productName,
  category,
}: VirtualTryOnProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [selectedModel, setSelectedModel] = useState<ModelPreset | null>(null);
  const [showCustomUpload, setShowCustomUpload] = useState(false);
  const [batchResults, setBatchResults] = useState<string[]>([]);
  const [currentBatchIndex, setCurrentBatchIndex] = useState(0);

  const { isGenerating, progress, result, generateTryOn, uploadImage, reset } =
    useVirtualTryOn();

  const handleModelSelect = (model: ModelPreset) => {
    setSelectedModel(model);
    setUploadedFiles([]);
    setShowCustomUpload(false);
  };

  const handleCreateCustom = () => {
    setShowCustomUpload(true);
    setSelectedModel(null);
  };

  const handleGenerate = async () => {
    if (!selectedModel && uploadedFiles.length === 0) {
      toast({
        title: "Selection required",
        description: "Please upload your photo or select a model",
        variant: "destructive",
      });
      return;
    }

    // Batch generation for multiple uploads
    if (uploadedFiles.length > 0) {
      setBatchResults([]);
      for (let i = 0; i < uploadedFiles.length; i++) {
        setCurrentBatchIndex(i + 1);
        try {
          const humanImageUrl = await uploadImage(uploadedFiles[i]);
          const result = await generateTryOn({
            humanImageUrl,
            garmentImageUrl: productImageUrl,
            garmentDescription: productName,
            category: category || "upper_body",
          });

          if (result) {
            // Save to history
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              await supabase.from("tryon_history").insert({
                user_id: user.id,
                model_image_url: humanImageUrl,
                product_image_url: productImageUrl,
                result_image_url: result,
                model_name: "Custom Upload",
                product_name: productName,
              });
            }
            setBatchResults((prev) => [...prev, result]);
          }
        } catch (error) {
          console.error("Batch generation error:", error);
        }
      }
      setCurrentBatchIndex(0);
    } else if (selectedModel) {
      // Single generation with preset model
      const result = await generateTryOn({
        humanImageUrl: selectedModel.image,
        garmentImageUrl: productImageUrl,
        garmentDescription: productName,
        category: category || "upper_body",
      });

      if (result) {
        // Save to history
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from("tryon_history").insert({
            user_id: user.id,
            model_image_url: selectedModel.image,
            product_image_url: productImageUrl,
            result_image_url: result,
            model_name: selectedModel.name,
            product_name: productName,
          });
        }
      }
    }
  };

  const handleReset = () => {
    reset();
    setUploadedFiles([]);
    setSelectedModel(null);
    setShowCustomUpload(false);
    setBatchResults([]);
    setCurrentBatchIndex(0);
  };

  if (result || batchResults.length > 0) {
    return (
      <div className="space-y-4">
        {batchResults.length > 1 ? (
          <div className="grid grid-cols-2 gap-4">
            {batchResults.map((resultUrl, index) => (
              <TryOnResult
                key={index}
                resultImageUrl={resultUrl}
                onReset={handleReset}
              />
            ))}
          </div>
        ) : (
          <TryOnResult
            resultImageUrl={result || batchResults[0]}
            onReset={handleReset}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Upload Your Photo</h3>
        <ImageUploadZone
          onFilesSelected={setUploadedFiles}
          maxFiles={9}
          maxSizeMB={20}
        />
      </div>

      {uploadedFiles.length === 0 && (
        <>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or choose a model
              </span>
            </div>
          </div>

          {/* Model Gallery */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Select a Model</h3>
            <ModelGallery
              selectedModelId={selectedModel?.id || null}
              onSelectModel={handleModelSelect}
              onCreateCustom={handleCreateCustom}
            />
          </div>
        </>
      )}

      {/* Generate Button */}
      <div className="space-y-4">
        <Button
          onClick={handleGenerate}
          disabled={
            isGenerating || (!selectedModel && uploadedFiles.length === 0)
          }
          className="w-full h-12 text-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
        >
          {isGenerating ? (
            <>
              Generating
              {currentBatchIndex > 0 && ` (${currentBatchIndex}/${uploadedFiles.length})`}
              ...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Generate Virtual Try-On
            </>
          )}
        </Button>

        {isGenerating && (
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-center text-muted-foreground">
              {progress < 20 && "Preparing your try-on..."}
              {progress >= 20 && progress < 40 && "Uploading images..."}
              {progress >= 40 && progress < 100 && "AI is working its magic..."}
              {progress === 100 && "Almost ready!"}
            </p>
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="bg-muted/50 rounded-lg p-4">
        <p className="text-sm font-semibold mb-2">💡 Tips for best results:</p>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li>Use well-lit photos with clear visibility</li>
          <li>Full body shots work best for dresses and full outfits</li>
          <li>Stand straight facing the camera</li>
          <li>Avoid busy backgrounds</li>
          <li>Upload multiple photos to see different angles</li>
        </ul>
      </div>
    </div>
  );
};
