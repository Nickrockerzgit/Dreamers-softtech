import { useEffect, useRef } from "react";
import gsap from "gsap";

const portfolioData = [
  {
    id: 1,
    tag: "WEBSITE",
    title: "Shower Wealth Academy",
    accent: "bg-red-600",
  },
  {
    id: 2,
    tag: "MOBILE APP",
    title: "BrewPod",
    accent: "bg-[#C89A3D]",
  },
  {
    id: 3,
    tag: "WEB PLATFORM",
    title: "FinEdge Dashboard",
    accent: "bg-emerald-600",
  },
  {
    id: 4,
    tag: "SAAS PRODUCT",
    title: "TaskFlow Pro",
    accent: "bg-indigo-600",
  },
];

const PortfolioSection = () => {
  const textureRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    textureRefs.current.forEach((el) => {
      if (!el) return;

      gsap.fromTo(
        el,
        { scale: 1 },
        {
          scale: 1.08,
          duration: 18,
          ease: "none",
          repeat: -1,
          yoyo: true,
        },
      );
    });
  }, []);

  return (
    <section className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
          {portfolioData.map((item, index) => (
            <div key={item.id} className="relative">
              {/* DECORATIVE SHAPE */}
              <div
                className={`absolute -top-12 -left-12 w-40 h-40 ${item.accent} rounded-[60px]`}
              />

              {/* PROJECT CARD */}
              <div className="relative overflow-hidden rounded-2xl shadow-xl h-[320px]">
                {/* TEXTURED BACKGROUND (ZOOMING) */}
                <div
                  ref={(el) => {
                    if (el) textureRefs.current[index] = el;
                  }}
                  className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1c1917] to-[#3a2a0f]"
                />

                {/* DARK OVERLAY */}
                <div className="absolute inset-0 bg-black/30" />

                {/* CONTENT */}
                <div className="relative z-10 h-full flex items-center justify-center">
                  <span className="text-2xl font-bold tracking-wide text-white">
                    {item.tag}
                  </span>
                </div>
              </div>

              {/* TITLE CARD */}
              <div className="mt-8 bg-white rounded-xl shadow-lg py-6 px-8 text-center">
                <h3 className="text-xl font-semibold text-slate-900">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
