import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { VirtualTryOn } from "./VirtualTryOn";
import { Sparkles } from "lucide-react";

interface VirtualTryOnDialogProps {
  productImageUrl: string;
  productName: string;
  category?: "upper_body" | "lower_body" | "dresses";
}

export const VirtualTryOnDialog = ({
  productImageUrl,
  productName,
  category,
}: VirtualTryOnDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="w-full">
          <Sparkles className="w-5 h-5 mr-2" />
          Virtual Try-On
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Virtual Try-On</DialogTitle>
          <DialogDescription>
            See how {productName} looks on you with AI-powered virtual try-on
          </DialogDescription>
        </DialogHeader>
        <VirtualTryOn
          productImageUrl={productImageUrl}
          productName={productName}
          category={category}
        />
      </DialogContent>
    </Dialog>
  );
};
