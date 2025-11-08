import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { VirtualTryOn } from "./VirtualTryOn";
import { TryOnHistory } from "./TryOnHistory";
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
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Virtual Try-On - {productName}</DialogTitle>
          <DialogDescription>
            See how this looks on you with AI-powered virtual try-on
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload & Select</TabsTrigger>
            <TabsTrigger value="history">My Results</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-6">
            <VirtualTryOn
              productImageUrl={productImageUrl}
              productName={productName}
              category={category}
            />
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <TryOnHistory />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
