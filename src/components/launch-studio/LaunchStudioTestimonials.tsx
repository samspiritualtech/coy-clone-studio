import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Priya Sharma",
    brand: "Aavya Textiles",
    quote: "OGURA Launch Studio transformed my sketches into a thriving fashion brand. The 4-week program gave me the structure and confidence I needed to launch successfully.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    initials: "PS"
  },
  {
    name: "Arjun Mehta",
    brand: "Urban Drape",
    quote: "The mentorship and network access were invaluable. Within 4 weeks, I went from concept to first sale. The support system is world-class!",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    initials: "AM"
  },
  {
    name: "Neha Kapoor",
    brand: "Silk Stories",
    quote: "I was skeptical at first, but the program delivered beyond my expectations. The resources, connections, and guidance are truly unmatched in the industry.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
    initials: "NK"
  }
];

export const LaunchStudioTestimonials = () => {
  return (
    <div className="container mx-auto px-4 mb-20">
      <h3 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
        Success Stories
      </h3>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
        Join the growing community of successful fashion entrepreneurs who launched with OGURA
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="relative hover:-translate-y-2 transition-transform duration-300 shadow-lg">
            <CardContent className="p-6">
              <Quote className="h-8 w-8 text-red-200 mb-4" />
              <p className="text-gray-700 mb-6 italic leading-relaxed">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={testimonial.image} alt={testimonial.name} />
                  <AvatarFallback className="bg-red-100 text-[hsl(var(--ogura-red))]">
                    {testimonial.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.brand}</p>
                  <div className="flex gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-[hsl(var(--ogura-red))] text-[hsl(var(--ogura-red))]" />
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
