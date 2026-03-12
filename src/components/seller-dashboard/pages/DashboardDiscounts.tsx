import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Percent, Gift, Truck, Tag } from "lucide-react";

const discountTypes = [
  { icon: Tag, title: "Amount off products", desc: "Discount specific products or collections" },
  { icon: Gift, title: "Buy X get Y", desc: "Offer free or discounted products with purchase" },
  { icon: Percent, title: "Amount off order", desc: "Discount the total order amount" },
  { icon: Truck, title: "Free shipping", desc: "Offer free shipping on orders" },
];

const activeDiscounts = [
  { code: "WELCOME10", type: "10% off", usage: "23 used", status: "Active" },
  { code: "BRIDAL20", type: "20% off bridal", usage: "8 used", status: "Active" },
  { code: "FREESHIP", type: "Free shipping", usage: "45 used", status: "Expired" },
];

export const DashboardDiscounts = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h1 className="text-xl font-semibold text-foreground">Discounts</h1>
      <Button size="sm"><Plus className="h-3.5 w-3.5 mr-1.5" />Create discount</Button>
    </div>

    <div className="grid sm:grid-cols-2 gap-3">
      {discountTypes.map((d) => (
        <Card key={d.title} className="shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4 flex items-start gap-3">
            <div className="w-9 h-9 bg-muted rounded-lg flex items-center justify-center shrink-0">
              <d.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">{d.title}</p>
              <p className="text-xs text-muted-foreground">{d.desc}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    <Card className="shadow-sm">
      <CardContent className="p-4">
        <h2 className="text-sm font-medium mb-3">Active discounts</h2>
        <div className="space-y-2">
          {activeDiscounts.map((d) => (
            <div key={d.code} className="flex items-center justify-between py-2 border-b last:border-0">
              <div>
                <span className="text-sm font-mono font-medium">{d.code}</span>
                <span className="text-xs text-muted-foreground ml-2">{d.type}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">{d.usage}</span>
                <Badge variant="secondary" className={d.status === "Active" ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground"}>
                  {d.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);
