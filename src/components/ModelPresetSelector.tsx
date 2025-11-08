import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface ModelPreset {
  id: string;
  name: string;
  image: string;
  category: string;
}

const MODEL_PRESETS: ModelPreset[] = [
  {
    id: "model1",
    name: "Casual Style",
    image: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=400&h=600&fit=crop",
    category: "full_body"
  },
  {
    id: "model2",
    name: "Professional",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop",
    category: "upper_body"
  },
  {
    id: "model3",
    name: "Athletic",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop",
    category: "full_body"
  },
  {
    id: "model4",
    name: "Elegant",
    image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=600&fit=crop",
    category: "full_body"
  },
];

interface ModelPresetSelectorProps {
  selectedPreset: string | null;
  onSelectPreset: (preset: ModelPreset) => void;
}

export const ModelPresetSelector = ({ selectedPreset, onSelectPreset }: ModelPresetSelectorProps) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Choose a Model</h3>
      <div className="grid grid-cols-2 gap-3">
        {MODEL_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onSelectPreset(preset)}
            className={`relative aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all ${
              selectedPreset === preset.id
                ? "border-primary ring-2 ring-primary/20"
                : "border-border hover:border-primary/50"
            }`}
          >
            <img
              src={preset.image}
              alt={preset.name}
              className="w-full h-full object-cover"
            />
            {selectedPreset === preset.id && (
              <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                <Check className="w-4 h-4" />
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
              <p className="text-white text-xs font-medium">{preset.name}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
