import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Instagram, Users } from "lucide-react";
import { Designer } from "@/types";
import { useNavigate } from "react-router-dom";

interface DesignerCardProps {
  designer: Designer;
}

export const DesignerCard = ({ designer }: DesignerCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={designer.profile_image}
          alt={designer.brand_name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-bold text-lg mb-1">{designer.brand_name}</h3>
            <p className="text-sm text-muted-foreground">{designer.name}</p>
          </div>
          {designer.instagram_link && (
            <Badge variant="secondary" className="instagram-gradient text-white">
              <Instagram className="w-3 h-3" />
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <span>{designer.city}</span>
          <span>•</span>
          <span>{designer.category}</span>
        </div>

        <div className="flex items-center gap-2 text-sm mb-4">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{designer.followers.toLocaleString()}</span>
          <span className="text-muted-foreground">followers</span>
        </div>

        <Button 
          onClick={() => navigate(`/designers/${designer.id}`)}
          className="w-full"
        >
          View Profile
        </Button>
      </CardContent>
    </Card>
  );
};
