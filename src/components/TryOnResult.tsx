import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Download, Share2, RotateCcw, Columns2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface TryOnResultProps {
  resultImageUrl: string;
  productImageUrl?: string;
  onReset: () => void;
}

export const TryOnResult = ({ resultImageUrl, productImageUrl, onReset }: TryOnResultProps) => {
  const [compareOpen, setCompareOpen] = useState(false);

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
      toast({ title: "Downloaded!", description: "Your try-on image has been saved" });
    } catch {
      toast({ title: "Download failed", description: "Unable to download the image", variant: "destructive" });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'My Ogura Virtual Try-On', text: 'Check out how this looks on me!', url: resultImageUrl });
      } catch { /* cancelled */ }
    } else {
      navigator.clipboard.writeText(resultImageUrl);
      toast({ title: "Link copied!", description: "Share link has been copied to clipboard" });
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-muted">
        <img src={resultImageUrl} alt="Virtual try-on result" className="w-full h-full object-cover" />
      </div>

      <div className={`grid gap-2 ${productImageUrl ? 'grid-cols-4' : 'grid-cols-3'}`}>
        <Button onClick={handleDownload} variant="outline" size="sm">
          <Download className="w-4 h-4 mr-1" /> Save
        </Button>
        <Button onClick={handleShare} variant="outline" size="sm">
          <Share2 className="w-4 h-4 mr-1" /> Share
        </Button>
        {productImageUrl && (
          <Dialog open={compareOpen} onOpenChange={setCompareOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Columns2 className="w-4 h-4 mr-1" /> Compare
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Before vs After</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-center text-muted-foreground">Original Product</p>
                  <div className="aspect-[3/4] rounded-lg overflow-hidden bg-muted">
                    <img src={productImageUrl} alt="Original product" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-center text-muted-foreground">Virtual Try-On</p>
                  <div className="aspect-[3/4] rounded-lg overflow-hidden bg-muted">
                    <img src={resultImageUrl} alt="Try-on result" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
        <Button onClick={onReset} variant="outline" size="sm">
          <RotateCcw className="w-4 h-4 mr-1" /> Retry
        </Button>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Virtual try-on results are AI-generated and may vary from actual fit
      </p>
    </div>
  );
};
