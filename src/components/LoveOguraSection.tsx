import { Link } from "react-router-dom";

const fashionVideos = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&q=80",
    caption: "outfit @ogura",
    link: "/collections/dresses"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80",
    caption: "✨💛",
    link: "/collections/dresses"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&q=80",
    caption: "Get ready with me for a date 💜✨",
    link: "/collections/tops"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&q=80",
    caption: '"Don\'t buy another dress, you got enough"',
    link: "/collections/dresses"
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80",
    caption: "outfit @ogura",
    link: "/collections/outerwear"
  }
];

export const LoveOguraSection = () => {
  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="mb-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold">Love Ogura 💖</h2>
          <p className="text-muted-foreground mt-2">Trending looks from our community</p>
        </div>

        <div className="relative">
          {/* Left gradient overlay */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none lg:hidden" />

          {/* Scrollable container */}
          <div className="flex gap-4 sm:gap-5 lg:gap-6 overflow-x-auto snap-x snap-mandatory lg:overflow-visible lg:justify-center pb-4 scrollbar-hide">
            {fashionVideos.map((video) => (
              <Link
                key={video.id}
                to={video.link}
                className="w-[160px] sm:w-[200px] lg:w-[240px] aspect-[9/16] rounded-xl overflow-hidden relative group cursor-pointer flex-shrink-0 snap-center transition-all duration-300 hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                tabIndex={0}
                aria-label={`View ${video.caption}`}
              >
                {/* Image with GIF-style motion */}
                <img
                  src={video.image}
                  alt={video.caption}
                  className="w-full h-full object-cover gif-motion"
                  loading="lazy"
                  width={240}
                  height={427}
                />

                {/* Gradient overlay at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Play button indicator */}
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-0 h-0 border-l-[8px] border-l-white border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent ml-1" />
                </div>

                {/* Caption text */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white text-sm font-medium leading-snug line-clamp-2">
                    {video.caption}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Right gradient overlay */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none lg:hidden" />
        </div>
      </div>

      {/* Custom scrollbar hide + GIF motion animation styles */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        /* GIF-style motion animation */
        @keyframes gifMotion {
          0%, 100% {
            transform: scale(1) translateY(0);
          }
          50% {
            transform: scale(1.05) translateY(-8px);
          }
        }
        
        .gif-motion {
          animation: gifMotion 2.5s ease-in-out infinite;
        }
        
        /* Faster animation on hover */
        .group:hover .gif-motion {
          animation-duration: 1.5s;
        }
        
        /* Respect reduced motion preferences */
        @media (prefers-reduced-motion: reduce) {
          .gif-motion {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
};
