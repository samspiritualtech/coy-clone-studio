import { Card } from "@/components/ui/card";

const collections = [
  {
    title: "Fresh Drops",
    description: "New arrivals this week",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80",
  },
  {
    title: "Summer Essentials",
    description: "Light & breezy styles",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80",
  },
  {
    title: "Most Loved",
    description: "Customer favorites",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
  },
  {
    title: "Trending Now",
    description: "What's hot this season",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80",
  },
];

export const FeaturedCollections = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Weekly Highlights</h2>
          <p className="text-muted-foreground">Discover our curated collections</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((collection, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover-scale"
            >
              <div className="aspect-[3/4] relative overflow-hidden">
                <img
                  src={collection.image}
                  alt={collection.title}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-bold mb-1">{collection.title}</h3>
                  <p className="text-sm text-white/90">{collection.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
