import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { PlusCircle, Package, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface SellerProduct {
  id: string;
  title: string;
  price: number;
  original_price: number | null;
  category: string;
  status: string | null;
  is_available: boolean | null;
  images: any;
  created_at: string | null;
}

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  pending: "bg-yellow-100 text-yellow-800",
  live: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const SellerProducts = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [sellerId, setSellerId] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const fetchSeller = async () => {
      const { data } = await supabase
        .from("sellers")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();
      setSellerId(data?.id || null);
    };
    fetchSeller();
  }, [user?.id]);

  useEffect(() => {
    if (!sellerId) return;

    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("id, title, price, original_price, category, status, is_available, images, created_at")
        .eq("seller_id", sellerId)
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Failed to load products");
        console.error(error);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    };
    fetchProducts();
  }, [sellerId]);

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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Products</h1>
          <p className="text-sm text-muted-foreground">{products.length} product(s)</p>
        </div>
        <Button asChild className="gap-2">
          <Link to="/seller/products/new">
            <PlusCircle className="h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      {products.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">No products yet</h3>
            <p className="text-sm text-muted-foreground mb-6">Add your first product to get started.</p>
            <Button asChild className="gap-2">
              <Link to="/seller/products/new">
                <PlusCircle className="h-4 w-4" />
                Add Product
              </Link>
            </Button>
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
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <img
                        src={firstImage(p.images)}
                        alt={p.title}
                        className="h-10 w-10 rounded object-cover bg-muted"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{p.title}</TableCell>
                    <TableCell className="text-muted-foreground capitalize">{p.category}</TableCell>
                    <TableCell>₹{p.price.toLocaleString("en-IN")}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={statusColors[p.status || "draft"]}>
                        {p.status || "draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {p.created_at ? new Date(p.created_at).toLocaleDateString("en-IN") : "—"}
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

export default SellerProducts;
