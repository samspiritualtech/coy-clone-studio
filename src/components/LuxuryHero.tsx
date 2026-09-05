import { Link } from "react-router-dom";

const HERO_VIDEO =
  "https://res.cloudinary.com/dpnosz8im/video/upload/f_auto,q_auto/v1768378220/bfakbydpghrmr0cvqdy99nkqy4_result__udh0fw.mp4";

export const LuxuryHero = () => {
  return (
    <section
      id="top"
      className="relative grid items-center gap-10 px-6 pb-16 pt-16 lg:grid-cols-[1.02fr_.98fr] lg:gap-0 lg:px-0 lg:pb-[84px] lg:pl-[60px] lg:pt-24 lg:min-h-[700px]"
    >
      {/* Copy */}
      <div className="relative max-w-[560px]">
        <div className="mb-7 flex items-center gap-3.5">
          <span className="h-px w-[46px] bg-[rgba(244,239,232,.45)]" />
          <span className="wine-eyebrow">Autumn Atelier — Volume IV</span>
        </div>

        <h1 className="wine-serif text-[clamp(46px,8vw,92px)] font-normal leading-[.96] tracking-[-.015em] text-[#F4EFE8]">
          Fashion that <em className="italic text-[#F0E2DA]">defines</em> you.
        </h1>

        <p className="wine-body mt-6 max-w-[400px] text-[15px] leading-[1.8] text-[#D8D0C7]">
          OGURA Fashion — crafted for modern elegance. Nine hundred ateliers, one
          wine-dark room to find them in.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-5">
          <Link to="/collections" className="wine-btn-solid">
            Explore collection
            <svg width="16" height="9" viewBox="0 0 16 9" fill="none" stroke="#3B1219" strokeWidth="1.4">
              <path d="M0 4.5h14M10.5 1 14 4.5 10.5 8" />
            </svg>
          </Link>
          <Link to="/designers" className="wine-btn-ghost">
            Meet the designers
          </Link>
        </div>

        <div className="mt-14 flex gap-11">
          {[
            ["920", "Ateliers"],
            ["64", "Cities"],
            ["15 days", "Easy returns"],
          ].map(([v, l]) => (
            <div key={l}>
              <div className="wine-serif text-[27px] leading-none text-[#F4EFE8]">{v}</div>
              <div className="wine-eyebrow mt-[7px] text-[#AFA7A2]">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Film panel — the video always sits above the artwork */}
      <div className="relative h-[420px] sm:h-[520px] lg:h-[640px]">
        <div className="absolute inset-0 overflow-hidden">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            src={HERO_VIDEO}
            className="wine-kb absolute inset-0 h-full w-full object-cover"
            style={{
              objectPosition: "52% 30%",
              maskImage: "linear-gradient(100deg,transparent 0%,#000 26%,#000 100%)",
              WebkitMaskImage: "linear-gradient(100deg,transparent 0%,#000 26%,#000 100%)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(200deg,rgba(84,26,37,.42),rgba(28,11,15,.12) 55%,rgba(61,18,25,.5))",
              mixBlendMode: "multiply",
            }}
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center gap-4 px-6 py-5"
            style={{ background: "linear-gradient(0deg,rgba(20,7,9,.85),transparent)" }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#F4EFE8" strokeWidth="1.5">
              <path d="M4 8h3.5L12 4.5v15L7.5 16H4z" />
              <path d="M16 9.5a4 4 0 0 1 0 5" />
            </svg>
            <div className="relative h-px flex-1 bg-[rgba(244,239,232,.28)]">
              <div className="wine-play absolute left-0 top-[-1px] h-[3px] bg-[#F4EFE8]" />
            </div>
            <span className="wine-body text-[10.5px] tracking-[.14em] text-[#D8D0C7]">0:38 / 1:24</span>
          </div>
        </div>

        <div className="absolute right-6 top-6 flex items-center gap-2 rounded-full bg-[rgba(28,11,15,.55)] px-3 py-2 backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full bg-[#F4EFE8]" />
          <span className="wine-eyebrow text-[9.5px] text-[#F4EFE8]">Autumn film</span>
        </div>

        <div className="absolute bottom-8 left-4 flex items-center gap-4 bg-[rgba(28,11,15,.62)] px-6 py-4 backdrop-blur-lg lg:-left-16">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#F4EFE8" strokeWidth="1.2">
            <circle cx="12" cy="12" r="10.5" />
            <path d="M10 8.4 16 12l-6 3.6z" fill="#F4EFE8" stroke="none" />
          </svg>
          <div>
            <div className="wine-serif text-[13px] leading-[1.2] text-[#F4EFE8]">Autumn film — 1:24</div>
            <div className="wine-eyebrow mt-1 text-[10px] text-[#AFA7A2]">Watch the show</div>
          </div>
        </div>
      </div>
    </section>
  );
};
