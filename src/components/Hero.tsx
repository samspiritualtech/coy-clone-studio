export const Hero = () => {
  return (
    <section className="py-4 md:py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Hero Banner */}
          <div className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden group cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&q=80"
              alt="New in Midseason"
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <p className="text-sm mb-2">NEW IN MIDSEASON</p>
              <h2 className="text-3xl md:text-4xl font-bold">Shop Now</h2>
            </div>
          </div>

          {/* Right Hero Banner */}
          <div className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden group cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&q=80"
              alt="The Best Deals"
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <p className="text-sm mb-2">THE BEST DEALS</p>
              <h2 className="text-3xl md:text-4xl font-bold">Discover More</h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
