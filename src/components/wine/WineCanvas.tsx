import { useEffect, useRef } from "react";

/**
 * Wine canvas — threadwork art system.
 * Every layer lives strictly BEHIND page content (z-index 0, pointer-events none),
 * so videos and interactive elements always sit in front of the artwork.
 */

const A = (n: string) => `/wine-art/${n}.svg`;

type Art = {
  src: string;
  style: React.CSSProperties;
  op: number;
  speed: number;
  base?: string;
};

const artLayers: Art[] = [
  { src: A("829fb65e-dd59-46ba-9afe-58356db2e9c8"), op: 0.34, speed: -0.1, style: { top: "-190px", left: "-430px", width: "1180px", maskImage: "radial-gradient(60% 60% at 40% 40%,#000 30%,transparent 78%)", WebkitMaskImage: "radial-gradient(60% 60% at 40% 40%,#000 30%,transparent 78%)" } },
  { src: A("bc5b826d-7ac5-4c0a-a2d6-4d7af94d88af"), op: 0.22, speed: -0.12, style: { top: "-300px", right: "-400px", width: "1200px", maskImage: "radial-gradient(58% 58% at 46% 54%,#000 26%,transparent 80%)", WebkitMaskImage: "radial-gradient(58% 58% at 46% 54%,#000 26%,transparent 80%)" } },
  { src: A("67e3a75d-db28-4b7c-85fe-a02582a944d5"), op: 0.28, speed: 0.05, style: { top: "830px", left: "-160px", width: "1900px", maskImage: "linear-gradient(90deg,transparent,#000 18%,#000 70%,transparent)", WebkitMaskImage: "linear-gradient(90deg,transparent,#000 18%,#000 70%,transparent)" } },
  { src: A("a3b50fe3-76b9-4a06-b998-1169b955f916"), op: 0.26, speed: 0.03, style: { top: "990px", left: "8px", width: "300px" } },
  { src: A("a3b50fe3-76b9-4a06-b998-1169b955f916"), op: 0.22, speed: 0.03, base: "rotate(180deg)", style: { top: "1200px", right: "8px", width: "300px", transform: "rotate(180deg)" } },
  { src: A("b448ac4f-d6fd-49d5-ae51-f28ba686772d"), op: 0.26, speed: -0.07, style: { top: "1520px", right: "-170px", width: "520px", maskImage: "linear-gradient(180deg,transparent,#000 26%,#000 74%,transparent)", WebkitMaskImage: "linear-gradient(180deg,transparent,#000 26%,#000 74%,transparent)" } },
  { src: A("159f407c-0afc-4104-9a8a-7c8d7b206ddd"), op: 0.22, speed: 0.06, style: { top: "1600px", left: "40px", width: "1360px", maskImage: "linear-gradient(180deg,#000 12%,rgba(0,0,0,.35) 60%,transparent)", WebkitMaskImage: "linear-gradient(180deg,#000 12%,rgba(0,0,0,.35) 60%,transparent)" } },
  { src: A("784c8721-26be-4d53-b880-8e698f4fb682"), op: 0.26, speed: -0.09, style: { top: "2240px", left: "-190px", width: "680px", maskImage: "radial-gradient(65% 65% at 60% 45%,#000 24%,transparent 82%)", WebkitMaskImage: "radial-gradient(65% 65% at 60% 45%,#000 24%,transparent 82%)" } },
  { src: A("8108bba1-0b69-4ddf-9560-5c91a8b49240"), op: 0.3, speed: 0.08, style: { top: "2620px", left: "-260px", width: "1180px", maskImage: "radial-gradient(70% 70% at 20% 50%,#000 20%,transparent 80%)", WebkitMaskImage: "radial-gradient(70% 70% at 20% 50%,#000 20%,transparent 80%)" } },
  { src: A("784c8721-26be-4d53-b880-8e698f4fb682"), op: 0.24, speed: -0.05, base: "scaleX(-1)", style: { top: "2820px", right: "-210px", width: "520px", transform: "scaleX(-1)", maskImage: "radial-gradient(62% 62% at 45% 50%,#000 22%,transparent 80%)", WebkitMaskImage: "radial-gradient(62% 62% at 45% 50%,#000 22%,transparent 80%)" } },
  { src: A("624c312e-c16f-455a-a079-66dd271639d5"), op: 0.3, speed: 0.04, style: { top: "3130px", left: "-120px", width: "1700px", maskImage: "linear-gradient(90deg,transparent,#000 14%,#000 82%,transparent)", WebkitMaskImage: "linear-gradient(90deg,transparent,#000 14%,#000 82%,transparent)" } },
  { src: A("624c312e-c16f-455a-a079-66dd271639d5"), op: 0.26, speed: 0.04, base: "scaleY(-1)", style: { top: "4370px", left: "-120px", width: "1700px", transform: "scaleY(-1)", maskImage: "linear-gradient(90deg,transparent,#000 16%,#000 80%,transparent)", WebkitMaskImage: "linear-gradient(90deg,transparent,#000 16%,#000 80%,transparent)" } },
  { src: A("a3b50fe3-76b9-4a06-b998-1169b955f916"), op: 0.26, speed: 0.05, style: { top: "4640px", left: "6px", width: "320px" } },
  { src: A("a3b50fe3-76b9-4a06-b998-1169b955f916"), op: 0.22, speed: 0.05, base: "rotate(180deg)", style: { top: "4880px", right: "6px", width: "320px", transform: "rotate(180deg)" } },
  { src: A("c6059de4-bb06-427b-afc9-a33cfef7d392"), op: 0.3, speed: -0.06, style: { top: "5180px", left: "-80px", width: "1700px", maskImage: "linear-gradient(120deg,#000 10%,transparent 62%)", WebkitMaskImage: "linear-gradient(120deg,#000 10%,transparent 62%)" } },
  { src: A("bc5b826d-7ac5-4c0a-a2d6-4d7af94d88af"), op: 0.2, speed: -0.06, style: { top: "5180px", left: "470px", width: "680px", maskImage: "radial-gradient(50% 50% at 50% 50%,#000 24%,transparent 78%)", WebkitMaskImage: "radial-gradient(50% 50% at 50% 50%,#000 24%,transparent 78%)" } },
  { src: A("25d50897-df0d-4935-ac8a-99ae0a41da6f"), op: 0.3, speed: 0.05, style: { top: "5610px", left: "70px", width: "1320px", maskImage: "linear-gradient(90deg,transparent,#000 18%,#000 78%,transparent)", WebkitMaskImage: "linear-gradient(90deg,transparent,#000 18%,#000 78%,transparent)" } },
  { src: A("eff4163e-ae69-4b52-a8f2-84b16eecd2f7"), op: 0.24, speed: 0.04, style: { top: "6320px", left: 0, width: "1440px", maskImage: "radial-gradient(80% 100% at 50% 100%,#000 30%,transparent 85%)", WebkitMaskImage: "radial-gradient(80% 100% at 50% 100%,#000 30%,transparent 85%)" } },
  { src: A("25d50897-df0d-4935-ac8a-99ae0a41da6f"), op: 0.26, speed: -0.04, style: { top: "6440px", left: "-80px", width: "1560px", maskImage: "linear-gradient(90deg,transparent,#000 14%,#000 84%,transparent)", WebkitMaskImage: "linear-gradient(90deg,transparent,#000 14%,#000 84%,transparent)" } },
  { src: A("159f407c-0afc-4104-9a8a-7c8d7b206ddd"), op: 0.18, speed: 0.03, style: { top: "6700px", left: "-60px", width: "940px", maskImage: "radial-gradient(70% 70% at 30% 50%,#000 20%,transparent 80%)", WebkitMaskImage: "radial-gradient(70% 70% at 30% 50%,#000 20%,transparent 80%)" } },
  { src: A("829fb65e-dd59-46ba-9afe-58356db2e9c8"), op: 0.14, speed: -0.05, style: { top: "6760px", right: "-560px", width: "1000px", maskImage: "radial-gradient(55% 55% at 50% 50%,#000 25%,transparent 80%)", WebkitMaskImage: "radial-gradient(55% 55% at 50% 50%,#000 25%,transparent 80%)" } },
  { src: A("784c8721-26be-4d53-b880-8e698f4fb682"), op: 0.2, speed: -0.03, base: "scaleX(-1)", style: { top: "6800px", right: "-150px", width: "520px", transform: "scaleX(-1)", maskImage: "radial-gradient(60% 60% at 50% 50%,#000 22%,transparent 80%)", WebkitMaskImage: "radial-gradient(60% 60% at 50% 50%,#000 22%,transparent 80%)" } },
];

export const WineCanvas = ({ children }: { children: React.ReactNode }) => {
  const artRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const vh = window.innerHeight || 900;
        artRef.current?.querySelectorAll<HTMLElement>("[data-art]").forEach((el) => {
          const r = el.getBoundingClientRect();
          const off = (r.top + r.height / 2 - vh / 2) * parseFloat(el.dataset.speed || "0");
          el.style.transform = `${el.dataset.base || ""} translate3d(0,${off.toFixed(1)}px,0)`;
        });
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="wine-canvas relative isolate overflow-hidden">
      {/* Artwork strictly behind content */}
      <div ref={artRef} aria-hidden className="pointer-events-none absolute inset-0 z-0 select-none">
        {artLayers.map((a, i) => (
          <img
            key={i}
            data-art=""
            data-speed={a.speed}
            data-base={a.base}
            src={a.src}
            alt=""
            loading="lazy"
            className="pointer-events-none absolute max-w-none"
            style={{ ...a.style, opacity: a.op }}
          />
        ))}
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  );
};
