export const LaunchStudioHero = () => {
  return (
    <div className="container mx-auto px-4 text-center mb-16">
      <div className="inline-block px-4 py-2 bg-red-50 rounded-full mb-4">
        <span className="text-[hsl(var(--ogura-red))] font-semibold text-sm">NEW PROGRAM</span>
      </div>
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
        OGURA Launch Studio
      </h2>
      <div className="w-24 h-1 bg-[hsl(var(--ogura-red))] mx-auto my-6" />
      <p className="text-2xl md:text-3xl font-light text-gray-800 mb-6">
        Build Your Fashion Dream in 4 Weeks
      </p>
      <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
        Turn your fashion vision into reality with our comprehensive 4-week accelerator program. 
        From concept to launch, we guide you every step of the way with expert mentorship, 
        industry connections, and proven strategies.
      </p>
    </div>
  );
};
