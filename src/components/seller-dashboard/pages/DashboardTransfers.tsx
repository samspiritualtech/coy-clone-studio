import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, ArrowLeftRight } from "lucide-react";

export const DashboardTransfers = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h1 className="text-xl font-semibold text-foreground">Transfers</h1>
      <Button size="sm"><Plus className="h-3.5 w-3.5 mr-1.5" />Create transfer</Button>
    </div>
    <Card className="shadow-sm">
      <CardContent className="p-12 text-center">
        <ArrowLeftRight className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
        <h3 className="font-medium text-foreground mb-1">No transfers yet</h3>
        <p className="text-sm text-muted-foreground">Move inventory between locations.</p>
      </CardContent>
    </Card>
  </div>
);
