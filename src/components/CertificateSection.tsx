import { Card, CardContent } from "@/components/ui/card";
import { Shield, Truck, RefreshCw } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "100% Authentic",
    description: "All products are genuine and certified",
  },
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders above ₹1999",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    description: "15 days return policy",
  },
];

export const CertificateSection = () => {
  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Ogura Certificate</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-2">
              <CardContent className="p-6 text-center">
                <feature.icon className="h-12 w-12 mx-auto mb-4 text-accent" />
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
