import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Upload, Download, MoreHorizontal } from "lucide-react";

interface Props {
  onAddProduct: () => void;
}

const products = [
  { name: "Silk Embroidered Saree", status: "Active", inventory: "24 in stock", category: "Sarees", channels: "Online Store", img: "/roshi/product-1.jpg" },
  { name: "Banarasi Lehenga Set", status: "Active", inventory: "8 in stock", category: "Lehengas", channels: "Online Store", img: "/roshi/product-2.jpg" },
  { name: "Designer Anarkali Suit", status: "Draft", inventory: "0 in stock", category: "Suits", channels: "—", img: "/roshi/product-3.jpg" },
  { name: "Cotton Kurta Set", status: "Active", inventory: "42 in stock", category: "Kurtas", channels: "Online Store", img: "/roshi/product-4.jpg" },
  { name: "Bridal Lehenga", status: "Active", inventory: "3 in stock", category: "Bridal", channels: "Online Store", img: "/roshi/product-5.jpg" },
];

const statusColor: Record<string, string> = {
  Active: "bg-green-100 text-green-800",
  Draft: "bg-muted text-muted-foreground",
};

export const DashboardProducts = ({ onAddProduct }: Props) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h1 className="text-xl font-semibold text-foreground">Products</h1>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm"><Upload className="h-3.5 w-3.5 mr-1.5" />Import</Button>
        <Button variant="outline" size="sm"><Download className="h-3.5 w-3.5 mr-1.5" />Export</Button>
        <Button size="sm" onClick={onAddProduct}><Plus className="h-3.5 w-3.5 mr-1.5" />Add product</Button>
      </div>
    </div>

    <Card className="shadow-sm">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs w-12"></TableHead>
              <TableHead className="text-xs">Product</TableHead>
              <TableHead className="text-xs">Status</TableHead>
              <TableHead className="text-xs">Inventory</TableHead>
              <TableHead className="text-xs">Category</TableHead>
              <TableHead className="text-xs">Sales channel</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.name} className="text-sm cursor-pointer hover:bg-muted/50">
                <TableCell>
                  <img src={p.img} alt={p.name} className="w-10 h-10 rounded object-cover" />
                </TableCell>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell><Badge variant="secondary" className={statusColor[p.status]}>{p.status}</Badge></TableCell>
                <TableCell className="text-muted-foreground">{p.inventory}</TableCell>
                <TableCell className="text-muted-foreground">{p.category}</TableCell>
                <TableCell className="text-muted-foreground">{p.channels}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
);
