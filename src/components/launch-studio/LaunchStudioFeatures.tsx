import { Users, Network, BookOpen, Megaphone, Monitor, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Users,
    title: "Expert Mentorship",
    description: "One-on-one guidance from fashion industry veterans with decades of experience"
  },
  {
    icon: Network,
    title: "Network Access",
    description: "Connect with suppliers, manufacturers, retailers, and fellow fashion entrepreneurs"
  },
  {
    icon: BookOpen,
    title: "Resource Library",
    description: "Templates, checklists, contracts, and comprehensive industry resources"
  },
  {
    icon: Megaphone,
    title: "Marketing Support",
    description: "Launch campaigns, social media strategies, and proven PR tactics"
  },
  {
    icon: Monitor,
    title: "Tech Platform",
    description: "E-commerce setup, inventory management, and analytics tools included"
  },
  {
    icon: DollarSign,
    title: "Funding Opportunities",
    description: "Pitch to investors and access our network of funding partners"
  }
];

export const LaunchStudioFeatures = () => {
  return (
    <div className="container mx-auto px-4 mb-20">
      <h3 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
        What's Included
      </h3>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
        Everything you need to launch and grow your fashion brand successfully
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card key={index} className="border-2 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-8 w-8 text-[hsl(var(--ogura-red))]" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
