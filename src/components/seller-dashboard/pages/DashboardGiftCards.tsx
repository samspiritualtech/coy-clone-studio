import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Gift } from "lucide-react";

export const DashboardGiftCards = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h1 className="text-xl font-semibold text-foreground">Gift cards</h1>
      <div className="flex gap-2">
        <Button variant="outline" size="sm"><Gift className="h-3.5 w-3.5 mr-1.5" />Add gift card product</Button>
        <Button size="sm"><Plus className="h-3.5 w-3.5 mr-1.5" />Create gift card</Button>
      </div>
    </div>
    <Card className="shadow-sm">
      <CardContent className="p-12 text-center">
        <Gift className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
        <h3 className="font-medium text-foreground mb-1">No gift cards yet</h3>
        <p className="text-sm text-muted-foreground">Create gift cards to offer your customers.</p>
      </CardContent>
    </Card>
  </div>
);
