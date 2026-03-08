const InstagramModelsBanner = () => {
  return (
    <section className="py-8 md:py-12 lg:py-16 px-4 md:px-8 lg:px-16">
      <div className="relative w-full rounded-2xl overflow-hidden" style={{ aspectRatio: "16/7" }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          src="https://res.cloudinary.com/dow8lbkui/video/upload/v1772960567/Ogura_fashion_brand_reel_d936ed2c10_y9kikd.mp4"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center gap-2 md:gap-3">
          <span
            className="text-xs md:text-sm tracking-[0.3em] uppercase font-medium"
            style={{ color: "white", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}
          >
            OGURA FASHION
          </span>
          <h2
            className="text-3xl md:text-5xl lg:text-7xl font-serif font-bold tracking-wide"
            style={{ color: "white", textShadow: "0 4px 16px rgba(0,0,0,0.5)" }}
          >
            INSTAGRAM MODELS
          </h2>
          <p
            className="text-sm md:text-base lg:text-lg font-light tracking-wide"
            style={{ color: "rgba(255,255,255,0.85)", textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}
          >
            Discover trending fashion looks
          </p>
        </div>
      </div>
    </section>
  );
};

export default InstagramModelsBanner;
