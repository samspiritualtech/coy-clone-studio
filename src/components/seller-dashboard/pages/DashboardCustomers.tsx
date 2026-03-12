import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const customers = [
  { name: "Priya Sharma", email: "priya@email.com", orders: 5, spent: "₹58,200" },
  { name: "Anita Desai", email: "anita@email.com", orders: 3, spent: "₹42,000" },
  { name: "Meera Patel", email: "meera@email.com", orders: 8, spent: "₹1,25,000" },
  { name: "Kavya Nair", email: "kavya@email.com", orders: 2, spent: "₹18,400" },
  { name: "Ritu Singh", email: "ritu@email.com", orders: 1, spent: "₹65,000" },
];

export const DashboardCustomers = () => (
  <div className="space-y-4">
    <h1 className="text-xl font-semibold text-foreground">Customers</h1>
    <Card className="shadow-sm">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Customer</TableHead>
              <TableHead className="text-xs">Email</TableHead>
              <TableHead className="text-xs">Orders</TableHead>
              <TableHead className="text-xs">Total spent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((c) => (
              <TableRow key={c.email} className="text-sm">
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell className="text-muted-foreground">{c.email}</TableCell>
                <TableCell>{c.orders}</TableCell>
                <TableCell>{c.spent}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
);
