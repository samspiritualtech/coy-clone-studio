import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Megaphone } from "lucide-react";

export const DashboardMarketing = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h1 className="text-xl font-semibold text-foreground">Marketing</h1>
      <Button size="sm"><Plus className="h-3.5 w-3.5 mr-1.5" />Create campaign</Button>
    </div>
    <Card className="shadow-sm">
      <CardContent className="p-12 text-center">
        <Megaphone className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
        <h3 className="font-medium text-foreground mb-1">No campaigns yet</h3>
        <p className="text-sm text-muted-foreground">Create marketing campaigns to promote your products.</p>
      </CardContent>
    </Card>
  </div>
);
