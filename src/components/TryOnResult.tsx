import { Button } from "@/components/ui/button";
import { Download, Share2, RotateCcw } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface TryOnResultProps {
  resultImageUrl: string;
  onReset: () => void;
}

export const TryOnResult = ({ resultImageUrl, onReset }: TryOnResultProps) => {
  const handleDownload = async () => {
    try {
      const response = await fetch(resultImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ogura-tryon-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({
        title: "Downloaded!",
        description: "Your try-on image has been saved",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Unable to download the image",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Ogura Virtual Try-On',
          text: 'Check out how this looks on me!',
          url: resultImageUrl,
        });
      } catch (error) {
        console.log('Share cancelled or failed');
      }
    } else {
      navigator.clipboard.writeText(resultImageUrl);
      toast({
        title: "Link copied!",
        description: "Share link has been copied to clipboard",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-muted">
        <img
          src={resultImageUrl}
          alt="Virtual try-on result"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Button onClick={handleDownload} variant="outline" size="sm">
          <Download className="w-4 h-4 mr-1" />
          Save
        </Button>
        <Button onClick={handleShare} variant="outline" size="sm">
          <Share2 className="w-4 h-4 mr-1" />
          Share
        </Button>
        <Button onClick={onReset} variant="outline" size="sm">
          <RotateCcw className="w-4 h-4 mr-1" />
          Try Again
        </Button>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Virtual try-on results are AI-generated and may vary from actual fit
      </p>
    </div>
  );
};
