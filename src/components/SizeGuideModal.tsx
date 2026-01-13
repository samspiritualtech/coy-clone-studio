import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Ruler } from "lucide-react";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: string;
}

const sizeCharts = {
  tops: {
    headers: ["Size", "Bust (in)", "Waist (in)", "Length (in)"],
    rows: [
      ["XS", "32-34", "24-26", "24"],
      ["S", "34-36", "26-28", "25"],
      ["M", "36-38", "28-30", "26"],
      ["L", "38-40", "30-32", "27"],
      ["XL", "40-42", "32-34", "28"],
      ["XXL", "42-44", "34-36", "29"],
    ],
  },
  dresses: {
    headers: ["Size", "Bust (in)", "Waist (in)", "Hip (in)", "Length (in)"],
    rows: [
      ["XS", "32-34", "24-26", "34-36", "48"],
      ["S", "34-36", "26-28", "36-38", "49"],
      ["M", "36-38", "28-30", "38-40", "50"],
      ["L", "38-40", "30-32", "40-42", "51"],
      ["XL", "40-42", "32-34", "42-44", "52"],
      ["XXL", "42-44", "34-36", "44-46", "53"],
    ],
  },
  bottoms: {
    headers: ["Size", "Waist (in)", "Hip (in)", "Inseam (in)"],
    rows: [
      ["XS", "24-26", "34-36", "30"],
      ["S", "26-28", "36-38", "30"],
      ["M", "28-30", "38-40", "31"],
      ["L", "30-32", "40-42", "31"],
      ["XL", "32-34", "42-44", "32"],
      ["XXL", "34-36", "44-46", "32"],
    ],
  },
};

export const SizeGuideModal = ({ isOpen, onClose, category }: SizeGuideModalProps) => {
  const getDefaultTab = () => {
    if (category?.toLowerCase().includes("dress")) return "dresses";
    if (category?.toLowerCase().includes("bottom") || category?.toLowerCase().includes("pant") || category?.toLowerCase().includes("skirt")) return "bottoms";
    return "tops";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Ruler className="h-5 w-5" />
            Size Guide
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue={getDefaultTab()} className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tops">Tops</TabsTrigger>
            <TabsTrigger value="dresses">Dresses</TabsTrigger>
            <TabsTrigger value="bottoms">Bottoms</TabsTrigger>
          </TabsList>

          {Object.entries(sizeCharts).map(([key, chart]) => (
            <TabsContent key={key} value={key} className="mt-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      {chart.headers.map((header) => (
                        <th
                          key={header}
                          className="px-4 py-3 text-left font-medium text-muted-foreground"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {chart.rows.map((row, idx) => (
                      <tr key={idx} className="border-b last:border-0">
                        {row.map((cell, cellIdx) => (
                          <td
                            key={cellIdx}
                            className={`px-4 py-3 ${cellIdx === 0 ? "font-semibold" : ""}`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* How to Measure */}
        <div className="mt-6 space-y-4 border-t pt-6">
          <h4 className="font-semibold">How to Measure</h4>
          <div className="grid gap-4 text-sm text-muted-foreground">
            <div className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                1
              </span>
              <div>
                <p className="font-medium text-foreground">Bust</p>
                <p>Measure around the fullest part of your bust, keeping the tape horizontal.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                2
              </span>
              <div>
                <p className="font-medium text-foreground">Waist</p>
                <p>Measure around your natural waistline, the narrowest part of your torso.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                3
              </span>
              <div>
                <p className="font-medium text-foreground">Hip</p>
                <p>Measure around the fullest part of your hips, about 8 inches below your waist.</p>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Note: Size charts are for reference only. Actual measurements may vary slightly by style.
        </p>
      </DialogContent>
    </Dialog>
  );
};
