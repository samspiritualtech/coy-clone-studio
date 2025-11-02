export const Spline3DBackground = () => {
  return (
    <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden">
      <div className="absolute inset-0 w-full h-full opacity-70">
        <iframe 
          src='https://my.spline.design/fashiontech-jQgcNhhdhO3bpc6NgnyW2CKN/' 
          frameBorder='0' 
          width='100%' 
          height='100%'
          title="3D Fashion Background"
          allow="fullscreen; autoplay; xr-spatial-tracking"
          loading="eager"
          style={{ 
            border: 'none',
            pointerEvents: 'none'
          }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background pointer-events-none" />
    </div>
  );
};
