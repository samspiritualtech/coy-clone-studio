import { useState, useEffect } from "react";
import { MODEL_PRESETS, ModelPreset } from "@/data/modelPresets";
import { ModelSearchFilter } from "./ModelSearchFilter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Star, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { OptimizedImage } from "./OptimizedImage";

interface ModelGalleryProps {
  selectedModelId: string | null;
  onSelectModel: (model: ModelPreset) => void;
  onCreateCustom: () => void;
}

export const ModelGallery = ({
  selectedModelId,
  onSelectModel,
  onCreateCustom,
}: ModelGalleryProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGender, setSelectedGender] = useState<"all" | "female" | "male">("all");
  const [showNewOnly, setShowNewOnly] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Load favorites from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("modelFavorites");
    if (stored) {
      setFavorites(new Set(JSON.parse(stored)));
    }
  }, []);

  const toggleFavorite = (modelId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(modelId)) {
      newFavorites.delete(modelId);
    } else {
      newFavorites.add(modelId);
    }
    setFavorites(newFavorites);
    localStorage.setItem("modelFavorites", JSON.stringify([...newFavorites]));
  };

  const filteredModels = MODEL_PRESETS.filter((model) => {
    const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGender = selectedGender === "all" || model.gender === selectedGender;
    const matchesNew = !showNewOnly || model.isNew;
    const matchesFavorite = !showFavoritesOnly || favorites.has(model.id);

    return matchesSearch && matchesGender && matchesNew && matchesFavorite;
  });

  return (
    <div className="space-y-6">
      <ModelSearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedGender={selectedGender}
        onGenderChange={setSelectedGender}
        showNewOnly={showNewOnly}
        onNewOnlyChange={setShowNewOnly}
        showFavoritesOnly={showFavoritesOnly}
        onFavoritesOnlyChange={setShowFavoritesOnly}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {/* Create Your Own Model Card */}
        <Card
          onClick={onCreateCustom}
          className="relative aspect-[3/4] cursor-pointer border-2 border-dashed hover:border-primary hover:shadow-lg transition-all duration-200 flex flex-col items-center justify-center gap-3 group"
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Plus className="w-8 h-8 text-primary" />
          </div>
          <div className="text-center px-4">
            <p className="font-semibold text-sm text-foreground">Create Your Own</p>
            <p className="text-xs text-muted-foreground">Upload custom model</p>
          </div>
        </Card>

        {/* Model Cards */}
        {filteredModels.map((model) => (
          <Card
            key={model.id}
            onClick={() => onSelectModel(model)}
            className={cn(
              "relative aspect-[3/4] cursor-pointer overflow-hidden group hover:shadow-xl transition-all duration-200",
              selectedModelId === model.id
                ? "ring-2 ring-primary shadow-lg scale-105"
                : "hover:scale-105"
            )}
          >
            <OptimizedImage
              src={model.image}
              alt={model.name}
              className="w-full h-full object-cover"
            />

            {/* Usage Badge - Top Left */}
            <Badge
              variant="secondary"
              className="absolute top-2 left-2 bg-background/90 backdrop-blur-sm text-xs flex items-center gap-1"
            >
              <Eye className="w-3 h-3" />
              {model.usageCount}
            </Badge>

            {/* NEW Badge - Top Right */}
            {model.isNew && (
              <Badge
                variant="destructive"
                className="absolute top-2 right-2 text-xs"
              >
                NEW
              </Badge>
            )}

            {/* Favorite Star - Bottom Right */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(model.id);
              }}
              className="absolute bottom-12 right-2 w-8 h-8 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
            >
              <Star
                className={cn(
                  "w-4 h-4",
                  favorites.has(model.id)
                    ? "fill-primary text-primary"
                    : "text-muted-foreground"
                )}
              />
            </button>

            {/* Name Overlay - Bottom */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/95 via-background/80 to-transparent p-3">
              <p className="font-semibold text-sm text-foreground">{model.name}</p>
            </div>

            {/* Selection Checkmark */}
            {selectedModelId === model.id && (
              <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-primary-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {filteredModels.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No models found matching your criteria</p>
        </div>
      )}
    </div>
  );
};
