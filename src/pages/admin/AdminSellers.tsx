import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Loader2, CheckCircle, Users } from "lucide-react";
import { toast } from "sonner";

interface SellerRow {
  id: string;
  brand_name: string;
  city: string;
  seller_type: string;
  application_status: string;
  is_verified: boolean | null;
  created_at: string | null;
  user_id: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const AdminSellers = () => {
  const [sellers, setSellers] = useState<SellerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchSellers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("sellers")
      .select("id, brand_name, city, seller_type, application_status, is_verified, created_at, user_id")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load sellers");
    } else {
      setSellers(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const approveSeller = async (id: string) => {
    setActionId(id);
    const { error } = await supabase
      .from("sellers")
      .update({ application_status: "approved", is_verified: true })
      .eq("id", id);

    if (error) {
      toast.error("Failed to approve seller");
    } else {
      toast.success("Seller approved! Seller role has been assigned.");
      setSellers((prev) =>
        prev.map((s) => (s.id === id ? { ...s, application_status: "approved", is_verified: true } : s))
      );
    }
    setActionId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Seller Management</h1>
        <p className="text-sm text-muted-foreground">{sellers.length} seller(s)</p>
      </div>

      {sellers.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">No sellers yet</h3>
            <p className="text-sm text-muted-foreground">Seller applications will appear here.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Brand</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sellers.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.brand_name}</TableCell>
                    <TableCell className="text-muted-foreground">{s.city}</TableCell>
                    <TableCell className="text-muted-foreground capitalize">{s.seller_type}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={statusColors[s.application_status] || ""}>
                        {s.application_status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {s.created_at ? new Date(s.created_at).toLocaleDateString("en-IN") : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      {s.application_status === "pending" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1 text-green-700 border-green-300 hover:bg-green-50"
                          disabled={actionId === s.id}
                          onClick={() => approveSeller(s.id)}
                        >
                          {actionId === s.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3" />}
                          Approve
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AdminSellers;
