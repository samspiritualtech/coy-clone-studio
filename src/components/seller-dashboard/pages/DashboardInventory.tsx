import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

const inventory = [
  { product: "Silk Embroidered Saree", sku: "SAR-001", unavailable: 0, committed: 2, available: 22, onHand: 24 },
  { product: "Banarasi Lehenga Set", sku: "LEH-001", unavailable: 1, committed: 3, available: 4, onHand: 8 },
  { product: "Designer Anarkali Suit", sku: "ANK-001", unavailable: 0, committed: 0, available: 0, onHand: 0 },
  { product: "Cotton Kurta Set", sku: "KUR-001", unavailable: 0, committed: 5, available: 37, onHand: 42 },
  { product: "Bridal Lehenga", sku: "BRD-001", unavailable: 0, committed: 1, available: 2, onHand: 3 },
];

export const DashboardInventory = () => (
  <div className="space-y-4">
    <h1 className="text-xl font-semibold text-foreground">Inventory</h1>
    <Card className="shadow-sm">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Product</TableHead>
              <TableHead className="text-xs">SKU</TableHead>
              <TableHead className="text-xs text-center">Unavailable</TableHead>
              <TableHead className="text-xs text-center">Committed</TableHead>
              <TableHead className="text-xs text-center">Available</TableHead>
              <TableHead className="text-xs text-center">On hand</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory.map((i) => (
              <TableRow key={i.sku} className="text-sm">
                <TableCell className="font-medium">{i.product}</TableCell>
                <TableCell className="text-muted-foreground">{i.sku}</TableCell>
                <TableCell className="text-center">{i.unavailable}</TableCell>
                <TableCell className="text-center">{i.committed}</TableCell>
                <TableCell className="text-center">
                  <Input type="number" defaultValue={i.available} className="w-16 h-7 text-center mx-auto text-xs" />
                </TableCell>
                <TableCell className="text-center font-medium">{i.onHand}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
);
