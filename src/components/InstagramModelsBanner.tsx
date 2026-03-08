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
      </div>
    </section>
  );
};

export default InstagramModelsBanner;
