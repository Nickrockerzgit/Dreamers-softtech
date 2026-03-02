import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";

const stats = [
  { value: "2+", label: "Projects" },
  { value: "98%", label: "Satisfaction" },
  { value: "1+", label: "Years" },
];

const PortfolioHero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  // Entrance animation on mount
  useEffect(() => {
    const els = [
      { el: titleRef.current, delay: 0 },
      { el: subtitleRef.current, delay: 120 },
      { el: statsRef.current, delay: 260 },
      { el: arrowRef.current, delay: 400 },
    ];

    els.forEach(({ el, delay }) => {
      if (!el) return;
      setTimeout(() => {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, delay);
    });

    setReady(true);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen min-h-[680px] overflow-hidden flex items-center justify-center text-white"
    >
      {/* ── Dark gradient bg ── */}
      <div className="absolute inset-0 bg-[#0c1117]" />

      {/* ── Dot grid pattern ── */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #C89A3D 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* ── Gold ambient glows ── */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#C89A3D]/12 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%]  w-[500px] h-[500px] bg-[#C89A3D]/08 rounded-full blur-[100px] pointer-events-none" />

      {/* ── Center content ── */}
      <div className="relative z-20 text-center px-6 max-w-4xl pt-20">
        {/* Label */}
        <div className="inline-flex items-center gap-2 bg-white/8 border border-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 mb-8">
          <div className="w-1.5 h-1.5 rounded-full bg-[#C89A3D] animate-pulse" />
          <span className="text-[#C89A3D] text-xs font-semibold uppercase tracking-widest">
            Our Portfolio
          </span>
        </div>

        {/* Main heading */}
        <h1
          ref={titleRef}
          className="text-5xl md:text-7xl font-extrabold leading-[1.05] mb-6 tracking-tight"
          style={{
            opacity: 0,
            transform: "translateY(40px)",
            transition:
              "opacity 0.9s cubic-bezier(0.4,0,0.2,1), transform 0.9s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          Work That
          <br />
          <span
            className="text-transparent bg-clip-text"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #C89A3D, #f0c46a, #C89A3D)",
            }}
          >
            Defines Us
          </span>
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-slate-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-10"
          style={{
            opacity: 0,
            transform: "translateY(30px)",
            transition:
              "opacity 0.9s cubic-bezier(0.4,0,0.2,1), transform 0.9s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          From modern web applications to AI-powered platforms — every project
          we ship reflects our obsession with clean architecture, thoughtful
          design, and real business impact.
        </p>

        {/* Stats row */}
        <div
          ref={statsRef}
          className="flex items-center justify-center gap-8 mb-10"
          style={{
            opacity: 0,
            transform: "translateY(24px)",
            transition:
              "opacity 0.9s cubic-bezier(0.4,0,0.2,1), transform 0.9s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl font-extrabold text-[#C89A3D]">
                {s.value}
              </p>
              <p className="text-slate-500 text-xs mt-0.5 uppercase tracking-widest">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <button className="px-7 py-3 bg-[#C89A3D] hover:bg-[#b78930] text-white font-semibold rounded-xl text-sm transition-all duration-200 shadow-lg hover:shadow-[#C89A3D]/30 hover:shadow-xl">
            Explore Projects
          </button>
          <button className="px-7 py-3 bg-white/8 hover:bg-white/15 border border-white/20 text-white font-semibold rounded-xl text-sm transition-all duration-200 backdrop-blur-sm">
            Start a Project
          </button>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div
        ref={arrowRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
        style={{
          opacity: 0,
          transform: "translateY(16px)",
          transition:
            "opacity 0.9s cubic-bezier(0.4,0,0.2,1), transform 0.9s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <span className="text-slate-500 text-[10px] uppercase tracking-widest">
          Scroll
        </span>
        <ArrowDown
          className="w-4 h-4 text-[#C89A3D]"
          style={{ animation: "bounce 2s infinite" }}
        />
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(6px); }
        }
      `}</style>
    </section>
  );
};

export default PortfolioHero;
