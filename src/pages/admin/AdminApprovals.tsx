import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { CheckCircle, XCircle, Loader2, Inbox } from "lucide-react";
import { toast } from "sonner";

interface PendingProduct {
  id: string;
  title: string;
  price: number;
  category: string;
  status: string | null;
  images: any;
  created_at: string | null;
  seller_id: string | null;
}

const AdminApprovals = () => {
  const [products, setProducts] = useState<PendingProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectTarget, setRejectTarget] = useState<string | null>(null);

  const fetchPending = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("id, title, price, category, status, images, created_at, seller_id")
      .eq("status", "pending")
      .order("created_at", { ascending: true });

    if (error) {
      toast.error("Failed to load pending products");
      console.error(error);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const approve = async (id: string) => {
    setActionId(id);
    const { error } = await supabase
      .from("products")
      .update({ status: "live" })
      .eq("id", id);

    if (error) {
      toast.error("Failed to approve");
    } else {
      toast.success("Product approved and now live!");
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
    setActionId(null);
  };

  const openReject = (id: string) => {
    setRejectTarget(id);
    setRejectReason("");
    setRejectDialogOpen(true);
  };

  const confirmReject = async () => {
    if (!rejectTarget) return;
    setActionId(rejectTarget);
    const { error } = await supabase
      .from("products")
      .update({ status: "rejected", rejection_reason: rejectReason || null })
      .eq("id", rejectTarget);

    if (error) {
      toast.error("Failed to reject");
    } else {
      toast.success("Product rejected");
      setProducts((prev) => prev.filter((p) => p.id !== rejectTarget));
    }
    setRejectDialogOpen(false);
    setRejectTarget(null);
    setActionId(null);
  };

  const firstImage = (images: any) => {
    if (Array.isArray(images) && images.length > 0) return images[0];
    return "/placeholder.svg";
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
        <h1 className="text-2xl font-bold text-foreground">Product Approvals</h1>
        <p className="text-sm text-muted-foreground">{products.length} pending product(s)</p>
      </div>

      {products.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Inbox className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">All caught up!</h3>
            <p className="text-sm text-muted-foreground">No products pending approval.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16"></TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <img src={firstImage(p.images)} alt={p.title} className="h-10 w-10 rounded object-cover bg-muted" />
                    </TableCell>
                    <TableCell className="font-medium">{p.title}</TableCell>
                    <TableCell className="text-muted-foreground capitalize">{p.category}</TableCell>
                    <TableCell>₹{p.price.toLocaleString("en-IN")}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {p.created_at ? new Date(p.created_at).toLocaleDateString("en-IN") : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1 text-green-700 border-green-300 hover:bg-green-50"
                          disabled={actionId === p.id}
                          onClick={() => approve(p.id)}
                        >
                          {actionId === p.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3" />}
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1 text-red-700 border-red-300 hover:bg-red-50"
                          disabled={actionId === p.id}
                          onClick={() => openReject(p.id)}
                        >
                          <XCircle className="h-3 w-3" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Optionally provide a reason for rejection:</p>
            <Textarea rows={3} value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="e.g. Images are low quality, missing description..." />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmReject} disabled={!!actionId} className="gap-2">
              {actionId && <Loader2 className="h-4 w-4 animate-spin" />}
              Confirm Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminApprovals;
