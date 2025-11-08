import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, Sparkles } from "lucide-react";
import { ModelPresetSelector } from "./ModelPresetSelector";
import { TryOnResult } from "./TryOnResult";
import { useVirtualTryOn } from "@/hooks/useVirtualTryOn";
import { toast } from "@/hooks/use-toast";

interface VirtualTryOnProps {
  productImageUrl: string;
  productName: string;
  category?: "upper_body" | "lower_body" | "dresses";
}

export const VirtualTryOn = ({ 
  productImageUrl, 
  productName,
  category = "upper_body" 
}: VirtualTryOnProps) => {
  const [selectedModelUrl, setSelectedModelUrl] = useState<string | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const { isGenerating, progress, result, generateTryOn, uploadImage, reset } = useVirtualTryOn();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    setUploadedFile(file);
    setSelectedPresetId(null);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedModelUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handlePresetSelect = (preset: any) => {
    setSelectedPresetId(preset.id);
    setSelectedModelUrl(preset.image);
    setUploadedFile(null);
  };

  const handleGenerate = async () => {
    if (!selectedModelUrl) {
      toast({
        title: "Select a model",
        description: "Please upload your photo or choose a preset model",
        variant: "destructive",
      });
      return;
    }

    let modelUrl = selectedModelUrl;

    // If user uploaded a file, upload it to storage first
    if (uploadedFile) {
      try {
        modelUrl = await uploadImage(uploadedFile);
      } catch (error) {
        toast({
          title: "Upload failed",
          description: error instanceof Error ? error.message : "Failed to upload image",
          variant: "destructive",
        });
        return;
      }
    }

    await generateTryOn({
      humanImageUrl: modelUrl,
      garmentImageUrl: productImageUrl,
      garmentDescription: productName,
      category,
    });
  };

  const handleReset = () => {
    reset();
    setSelectedModelUrl(null);
    setSelectedPresetId(null);
    setUploadedFile(null);
  };

  if (result) {
    return <TryOnResult resultImageUrl={result} onReset={handleReset} />;
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Upload Your Photo</h3>
        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
          <input
            type="file"
            id="model-upload"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileUpload}
            className="hidden"
            disabled={isGenerating}
          />
          <label htmlFor="model-upload" className="cursor-pointer">
            {selectedModelUrl && uploadedFile ? (
              <div className="space-y-2">
                <img
                  src={selectedModelUrl}
                  alt="Uploaded model"
                  className="w-32 h-48 object-cover rounded-md mx-auto"
                />
                <p className="text-sm text-muted-foreground">Click to change</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                <div>
                  <p className="font-medium">Upload your photo</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    JPG, PNG or WEBP (max 10MB)
                  </p>
                </div>
              </div>
            )}
          </label>
        </div>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div>

      {/* Preset Models */}
      <ModelPresetSelector
        selectedPreset={selectedPresetId}
        onSelectPreset={handlePresetSelect}
      />

      {/* Generate Button */}
      <Button
        onClick={handleGenerate}
        disabled={!selectedModelUrl || isGenerating}
        className="w-full"
        size="lg"
      >
        {isGenerating ? (
          <>
            <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
            Generating... {Math.round(progress)}%
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Virtual Try-On
          </>
        )}
      </Button>

      {/* Progress Bar */}
      {isGenerating && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-center text-muted-foreground">
            {progress < 40 && "Uploading images..."}
            {progress >= 40 && progress < 95 && "AI is generating your try-on..."}
            {progress >= 95 && "Almost done!"}
          </p>
        </div>
      )}

      {/* Tips */}
      <div className="bg-muted/50 rounded-lg p-4 space-y-2">
        <p className="text-sm font-medium">Tips for best results:</p>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Use a clear, well-lit photo</li>
          <li>• Stand facing the camera</li>
          <li>• Wear fitted or neutral clothing</li>
          <li>• Clear background works best</li>
        </ul>
      </div>
    </div>
  );
};
