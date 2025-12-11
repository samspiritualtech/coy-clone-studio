import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const STORAGE_URL = `https://yudzgkrjsstqbfrrrrly.supabase.co/storage/v1/object/public/influencer-videos`;

// Fallback videos (Pexels stock) used when no custom videos are uploaded
const fallbackVideos = [
  { videoSrc: "https://videos.pexels.com/video-files/4778602/4778602-hd_1080_1920_25fps.mp4", poster: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&q=80" },
  { videoSrc: "https://videos.pexels.com/video-files/5480459/5480459-hd_1080_1920_25fps.mp4", poster: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80" },
  { videoSrc: "https://videos.pexels.com/video-files/4536558/4536558-hd_1080_1920_25fps.mp4", poster: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&q=80" },
  { videoSrc: "https://videos.pexels.com/video-files/5480711/5480711-hd_1080_1920_25fps.mp4", poster: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&q=80" },
  { videoSrc: "https://videos.pexels.com/video-files/4765917/4765917-hd_1080_1920_25fps.mp4", poster: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80" },
];

export const LoveOguraSection = () => {
  const { data: videos = [] } = useQuery({
    queryKey: ['influencer-videos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('influencer_videos')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  // Check if custom videos exist in storage
  const getVideoUrl = (filename: string, index: number) => {
    // Try storage URL first, fallback to Pexels if video doesn't exist
    const storageUrl = `${STORAGE_URL}/${filename}`;
    return storageUrl;
  };

  // Merge database data with fallback videos
  const displayVideos = videos.map((video, index) => ({
    id: video.id,
    videoSrc: getVideoUrl(video.video_filename, index),
    fallbackSrc: fallbackVideos[index]?.videoSrc || fallbackVideos[0].videoSrc,
    poster: video.poster_url || fallbackVideos[index]?.poster || fallbackVideos[0].poster,
    caption: video.caption,
    link: video.link,
  }));

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
            {displayVideos.map((video) => (
              <Link
                key={video.id}
                to={video.link}
                className="w-[160px] sm:w-[200px] lg:w-[240px] aspect-[9/16] rounded-xl overflow-hidden relative group cursor-pointer flex-shrink-0 snap-center transition-all duration-300 hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                tabIndex={0}
                aria-label={`View ${video.caption}`}
              >
                {/* Real video clip with fallback */}
                <video
                  poster={video.poster}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                  preload="metadata"
                  onError={(e) => {
                    // Fallback to Pexels video if storage video fails
                    const target = e.target as HTMLVideoElement;
                    if (target.src !== video.fallbackSrc) {
                      target.src = video.fallbackSrc;
                    }
                  }}
                >
                  <source src={video.videoSrc} type="video/mp4" />
                  <source src={video.fallbackSrc} type="video/mp4" />
                </video>

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

      {/* Custom scrollbar hide */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};