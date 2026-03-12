import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const orders = [
  { id: "#1032", customer: "Priya Sharma", product: "Silk Saree", price: "₹12,500", status: "Fulfilled", date: "12 Mar 2026" },
  { id: "#1031", customer: "Anita Desai", product: "Lehenga Set", price: "₹28,000", status: "Pending", date: "11 Mar 2026" },
  { id: "#1030", customer: "Meera Patel", product: "Anarkali Suit", price: "₹8,500", status: "Unfulfilled", date: "10 Mar 2026" },
  { id: "#1029", customer: "Kavya Nair", product: "Designer Blouse", price: "₹4,200", status: "Fulfilled", date: "9 Mar 2026" },
  { id: "#1028", customer: "Ritu Singh", product: "Bridal Lehenga", price: "₹65,000", status: "Pending", date: "8 Mar 2026" },
  { id: "#1027", customer: "Sneha Gupta", product: "Party Gown", price: "₹15,800", status: "Fulfilled", date: "7 Mar 2026" },
];

const statusColor: Record<string, string> = {
  Fulfilled: "bg-green-100 text-green-800",
  Pending: "bg-yellow-100 text-yellow-800",
  Unfulfilled: "bg-red-100 text-red-800",
};

export const DashboardOrders = () => (
  <div className="space-y-4">
    <h1 className="text-xl font-semibold text-foreground">Orders</h1>
    <Card className="shadow-sm">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Order</TableHead>
              <TableHead className="text-xs">Date</TableHead>
              <TableHead className="text-xs">Customer</TableHead>
              <TableHead className="text-xs">Product</TableHead>
              <TableHead className="text-xs">Total</TableHead>
              <TableHead className="text-xs">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((o) => (
              <TableRow key={o.id} className="text-sm cursor-pointer hover:bg-muted/50">
                <TableCell className="font-medium">{o.id}</TableCell>
                <TableCell className="text-muted-foreground">{o.date}</TableCell>
                <TableCell>{o.customer}</TableCell>
                <TableCell>{o.product}</TableCell>
                <TableCell>{o.price}</TableCell>
                <TableCell><Badge variant="secondary" className={statusColor[o.status]}>{o.status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
);
