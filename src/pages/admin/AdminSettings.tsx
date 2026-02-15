import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { ShieldCheck } from "lucide-react";

const AdminSettings = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-6">Admin Settings</h1>

      <Card>
        <CardHeader><CardTitle className="text-base">Account</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground w-24">Name:</span>
            <span className="text-sm font-medium">{user?.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground w-24">Email:</span>
            <span className="text-sm font-medium">{user?.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground w-24">Role:</span>
            <span className="inline-flex items-center gap-1 text-sm font-medium">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Administrator
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
