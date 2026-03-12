import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const revenueData = [
  { name: "Jan", value: 45000 }, { name: "Feb", value: 38000 }, { name: "Mar", value: 52000 },
  { name: "Apr", value: 48000 }, { name: "May", value: 61000 }, { name: "Jun", value: 55000 },
];

const ordersData = [
  { name: "Jan", value: 12 }, { name: "Feb", value: 19 }, { name: "Mar", value: 15 },
  { name: "Apr", value: 22 }, { name: "May", value: 30 }, { name: "Jun", value: 25 },
];

const conversionData = [
  { name: "Jan", value: 2.1 }, { name: "Feb", value: 2.8 }, { name: "Mar", value: 3.2 },
  { name: "Apr", value: 2.9 }, { name: "May", value: 3.5 }, { name: "Jun", value: 3.8 },
];

const bestSelling = [
  { name: "Sarees", value: 35 }, { name: "Lehengas", value: 25 },
  { name: "Suits", value: 20 }, { name: "Kurtas", value: 15 }, { name: "Other", value: 5 },
];

const COLORS = ["hsl(var(--primary))", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

export const DashboardAnalytics = () => (
  <div className="space-y-6">
    <h1 className="text-xl font-semibold text-foreground">Analytics</h1>

    <div className="grid lg:grid-cols-2 gap-4">
      <Card className="shadow-sm">
        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Revenue</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueData}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Orders</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={ordersData}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Conversion Rate (%)</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={conversionData}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Best Selling Categories</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={bestSelling} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {bestSelling.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  </div>
);
