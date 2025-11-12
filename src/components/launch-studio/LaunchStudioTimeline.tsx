import { Lightbulb, Palette, Package, Rocket } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const weeks = [
  {
    week: 1,
    title: "Foundation & Strategy",
    icon: Lightbulb,
    items: [
      "Define your brand identity and vision",
      "Market research & target audience analysis",
      "Business model planning & financial projections",
      "Brand positioning & unique value proposition"
    ],
    color: "bg-red-50"
  },
  {
    week: 2,
    title: "Design & Development",
    icon: Palette,
    items: [
      "Product design & prototyping",
      "Brand visual identity & logo design",
      "Website & e-commerce platform setup",
      "Photography & content creation strategy"
    ],
    color: "bg-red-50"
  },
  {
    week: 3,
    title: "Production & Logistics",
    icon: Package,
    items: [
      "Supplier sourcing & manufacturer partnerships",
      "Sample production & quality control",
      "Inventory management systems",
      "Supply chain & fulfillment planning"
    ],
    color: "bg-red-50"
  },
  {
    week: 4,
    title: "Launch & Marketing",
    icon: Rocket,
    items: [
      "Marketing campaign setup & execution",
      "Social media strategy & content calendar",
      "Launch event planning & PR outreach",
      "Sales tracking & performance optimization"
    ],
    color: "bg-red-50"
  }
];

export const LaunchStudioTimeline = () => {
  return (
    <div className="container mx-auto px-4 mb-20">
      <h3 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
        Your 4-Week Journey
      </h3>
      
      <div className="relative max-w-4xl mx-auto">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-red-200 hidden md:block" />
        
        <div className="space-y-8">
          {weeks.map((week, index) => {
            const Icon = week.icon;
            return (
              <div key={index} className="relative">
                <Card className="border-2 hover:shadow-xl transition-all duration-300 md:ml-20">
                  <CardContent className="p-6 md:p-8">
                    <div className="absolute -left-20 top-8 hidden md:flex w-16 h-16 bg-[hsl(var(--ogura-red))] rounded-full items-center justify-center shadow-lg">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    
                    <div className="flex items-center gap-4 mb-4 md:hidden">
                      <div className="w-12 h-12 bg-[hsl(var(--ogura-red))] rounded-full flex items-center justify-center flex-shrink-0">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[hsl(var(--ogura-red))]">WEEK {week.week}</p>
                        <h4 className="text-xl font-bold text-gray-900">{week.title}</h4>
                      </div>
                    </div>
                    
                    <div className="hidden md:block mb-4">
                      <p className="text-sm font-semibold text-[hsl(var(--ogura-red))]">WEEK {week.week}</p>
                      <h4 className="text-2xl font-bold text-gray-900">{week.title}</h4>
                    </div>
                    
                    <ul className="space-y-2">
                      {week.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-2">
                          <span className="text-[hsl(var(--ogura-red))] mt-1">•</span>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
