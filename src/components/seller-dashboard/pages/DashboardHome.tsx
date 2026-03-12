import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IndianRupee, ShoppingCart, Package, Clock } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, Area } from "recharts";

const salesData = [
  { name: "Jan", value: 4000 }, { name: "Feb", value: 3000 }, { name: "Mar", value: 5000 },
  { name: "Apr", value: 4500 }, { name: "May", value: 6000 }, { name: "Jun", value: 5500 },
  { name: "Jul", value: 7000 },
];

const ordersData = [
  { name: "Jan", value: 12 }, { name: "Feb", value: 19 }, { name: "Mar", value: 15 },
  { name: "Apr", value: 22 }, { name: "May", value: 30 }, { name: "Jun", value: 25 },
  { name: "Jul", value: 35 },
];

const recentOrders = [
  { id: "#1032", customer: "Priya Sharma", product: "Silk Saree", price: "₹12,500", status: "Fulfilled" },
  { id: "#1031", customer: "Anita Desai", product: "Lehenga Set", price: "₹28,000", status: "Pending" },
  { id: "#1030", customer: "Meera Patel", product: "Anarkali Suit", price: "₹8,500", status: "Unfulfilled" },
  { id: "#1029", customer: "Kavya Nair", product: "Designer Blouse", price: "₹4,200", status: "Fulfilled" },
  { id: "#1028", customer: "Ritu Singh", product: "Bridal Lehenga", price: "₹65,000", status: "Pending" },
];

const statusColor: Record<string, string> = {
  Fulfilled: "bg-green-100 text-green-800",
  Pending: "bg-yellow-100 text-yellow-800",
  Unfulfilled: "bg-red-100 text-red-800",
};

const kpis = [
  { label: "Total Sales", value: "₹1,18,200", icon: IndianRupee, change: "+12.5%" },
  { label: "Total Orders", value: "158", icon: ShoppingCart, change: "+8.2%" },
  { label: "Total Products", value: "45", icon: Package, change: "+3" },
  { label: "Pending Orders", value: "12", icon: Clock, change: "-2" },
];

export const DashboardHome = () => (
  <div className="space-y-6">
    <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <Card key={kpi.label} className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground font-medium">{kpi.label}</span>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
            <span className="text-xs text-green-600 font-medium">{kpi.change}</span>
          </CardContent>
        </Card>
      ))}
    </div>

    <div className="grid lg:grid-cols-2 gap-4">
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Sales Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="url(#salesGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={ordersData}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>

    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Recent Orders</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Order</TableHead>
              <TableHead className="text-xs">Customer</TableHead>
              <TableHead className="text-xs">Product</TableHead>
              <TableHead className="text-xs">Price</TableHead>
              <TableHead className="text-xs">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentOrders.map((o) => (
              <TableRow key={o.id} className="text-sm">
                <TableCell className="font-medium">{o.id}</TableCell>
                <TableCell>{o.customer}</TableCell>
                <TableCell>{o.product}</TableCell>
                <TableCell>{o.price}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={statusColor[o.status]}>{o.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
);
