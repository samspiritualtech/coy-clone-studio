import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

export const DashboardContent = () => (
  <div className="space-y-4">
    <h1 className="text-xl font-semibold text-foreground">Content</h1>
    <Card className="shadow-sm">
      <CardContent className="p-12 text-center">
        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
        <h3 className="font-medium text-foreground mb-1">Manage your store content</h3>
        <p className="text-sm text-muted-foreground">Create and edit pages, blog posts, and navigation menus.</p>
      </CardContent>
    </Card>
  </div>
);
