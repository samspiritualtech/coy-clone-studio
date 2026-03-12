import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe } from "lucide-react";

export const DashboardMarkets = () => (
  <div className="space-y-4">
    <h1 className="text-xl font-semibold text-foreground">Markets</h1>
    <Card className="shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-4 flex items-center gap-4">
        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
          <Globe className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">India (Primary)</p>
          <p className="text-xs text-muted-foreground">INR · English, Hindi</p>
        </div>
        <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>
      </CardContent>
    </Card>
  </div>
);
