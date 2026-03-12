import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, FolderOpen } from "lucide-react";

const collections = [
  { name: "Summer Collection 2026", type: "Manual", products: 12 },
  { name: "Bridal Wear", type: "Smart", products: 8 },
  { name: "Under ₹5,000", type: "Smart", products: 15 },
  { name: "Festive Edit", type: "Manual", products: 6 },
];

export const DashboardCollections = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h1 className="text-xl font-semibold text-foreground">Collections</h1>
      <Button size="sm"><Plus className="h-3.5 w-3.5 mr-1.5" />Create collection</Button>
    </div>
    <div className="grid gap-3">
      {collections.map((c) => (
        <Card key={c.name} className="shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
              <FolderOpen className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{c.name}</p>
              <p className="text-xs text-muted-foreground">{c.products} products</p>
            </div>
            <Badge variant="secondary">{c.type}</Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);
