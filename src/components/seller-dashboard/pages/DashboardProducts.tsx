import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Upload, Download, Loader2, Package } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  onAddProduct: () => void;
  refreshKey?: number;
}

interface DBProduct {
  id: string;
  title: string;
  status: string | null;
  category: string;
  images: any;
  price: number;
  created_at: string | null;
}

const statusColor: Record<string, string> = {
  live: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  draft: "bg-muted text-muted-foreground",
  rejected: "bg-red-100 text-red-800",
};

const DEV_SELLER_ID = "07edb482-2c8e-4711-8cda-d2f3a87b790a";

export const DashboardProducts = ({ onAddProduct, refreshKey }: Props) => {
  const { user } = useAuth();
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [sellerId, setSellerId] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) {
      setSellerId(DEV_SELLER_ID);
      return;
    }
    supabase.from("sellers").select("id").eq("user_id", user.id).maybeSingle()
      .then(({ data }) => setSellerId(data?.id || DEV_SELLER_ID));
  }, [user?.id]);

  useEffect(() => {
    if (!sellerId) { setLoading(false); return; }
    const fetch = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("products")
        .select("id, title, status, category, images, price, created_at")
        .eq("seller_id", sellerId)
        .order("created_at", { ascending: false });
      setProducts((data as DBProduct[]) || []);
      setLoading(false);
    };
    fetch();
  }, [sellerId, refreshKey]);

  const getFirstImage = (images: any): string => {
    if (Array.isArray(images) && images.length > 0) return images[0];
    return "/placeholder.svg";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Products</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><Upload className="h-3.5 w-3.5 mr-1.5" />Import</Button>
          <Button variant="outline" size="sm"><Download className="h-3.5 w-3.5 mr-1.5" />Export</Button>
          <Button size="sm" onClick={onAddProduct}><Plus className="h-3.5 w-3.5 mr-1.5" />Add product</Button>
        </div>
      </div>

      {products.length === 0 ? (
        <Card className="shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-medium text-lg mb-1">No products yet</h3>
            <p className="text-sm text-muted-foreground mb-4">Add your first product to start selling.</p>
            <Button onClick={onAddProduct}><Plus className="h-4 w-4 mr-2" />Add product</Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs w-12"></TableHead>
                  <TableHead className="text-xs">Product</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs">Category</TableHead>
                  <TableHead className="text-xs">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map(p => (
                  <TableRow key={p.id} className="text-sm">
                    <TableCell>
                      <img src={getFirstImage(p.images)} alt={p.title} className="w-10 h-10 rounded object-cover" />
                    </TableCell>
                    <TableCell className="font-medium">{p.title}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={statusColor[p.status || "draft"]}>
                        {p.status || "draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{p.category}</TableCell>
                    <TableCell className="text-muted-foreground">₹{p.price?.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
