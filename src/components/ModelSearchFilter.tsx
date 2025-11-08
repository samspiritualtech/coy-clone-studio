import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface ModelSearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedGender: "all" | "female" | "male";
  onGenderChange: (gender: "all" | "female" | "male") => void;
  showNewOnly: boolean;
  onNewOnlyChange: (show: boolean) => void;
  showFavoritesOnly: boolean;
  onFavoritesOnlyChange: (show: boolean) => void;
}

export const ModelSearchFilter = ({
  searchQuery,
  onSearchChange,
  selectedGender,
  onGenderChange,
  showNewOnly,
  onNewOnlyChange,
  showFavoritesOnly,
  onFavoritesOnlyChange,
}: ModelSearchFilterProps) => {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search models by name..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedGender === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => onGenderChange("all")}
        >
          All
        </Button>
        <Button
          variant={selectedGender === "female" ? "default" : "outline"}
          size="sm"
          onClick={() => onGenderChange("female")}
        >
          Female
        </Button>
        <Button
          variant={selectedGender === "male" ? "default" : "outline"}
          size="sm"
          onClick={() => onGenderChange("male")}
        >
          Male
        </Button>
        <Button
          variant={showNewOnly ? "default" : "outline"}
          size="sm"
          onClick={() => onNewOnlyChange(!showNewOnly)}
        >
          New Only
        </Button>
        <Button
          variant={showFavoritesOnly ? "default" : "outline"}
          size="sm"
          onClick={() => onFavoritesOnlyChange(!showFavoritesOnly)}
        >
          ⭐ Favorites
        </Button>
      </div>
    </div>
  );
};
