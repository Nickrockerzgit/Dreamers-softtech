import { useEffect, useRef } from "react";
import { ArrowDown } from "lucide-react";
import { usePublicStats } from "../../hooks/usePublicStats";

const AboutHero = () => {
  const { stats: siteStats } = usePublicStats();
  const labelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = [
      { el: labelRef.current, delay: 0 },
      { el: headingRef.current, delay: 100 },
      { el: dividerRef.current, delay: 220 },
      { el: textRef.current, delay: 320 },
      { el: statsRef.current, delay: 460 },
      { el: arrowRef.current, delay: 600 },
    ];

    els.forEach(({ el, delay }) => {
      if (!el) return;
      setTimeout(() => {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, delay);
    });
  }, []);

  const fadeUp = (delay = 0): React.CSSProperties => ({
    opacity: 0,
    transform: "translateY(36px)",
    transition: `opacity 0.85s cubic-bezier(0.4,0,0.2,1) ${delay}ms, transform 0.85s cubic-bezier(0.4,0,0.2,1) ${delay}ms`,
  });

  return (
    <section className="relative min-h-[100vh] overflow-hidden flex flex-col items-center justify-center text-white">
      {/* ── Background ── */}
      <div className="absolute inset-0 bg-[#0c1117]" />

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #C89A3D 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* Diagonal gold line accent — top left */}
      <div
        className="absolute top-0 left-0 w-px h-[40%] origin-top"
        style={{
          background:
            "linear-gradient(to bottom, transparent, #C89A3D55, transparent)",
          left: "25%",
          transform: "rotate(0deg)",
        }}
      />
      {/* Diagonal gold line accent — top right */}
      <div
        className="absolute top-0 w-px h-[35%]"
        style={{
          background:
            "linear-gradient(to bottom, transparent, #C89A3D44, transparent)",
          left: "75%",
        }}
      />

      {/* Gold glows */}
      <div className="absolute top-[-8%] left-[-8%]  w-[560px] h-[560px] bg-[#C89A3D]/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-8%] right-[-5%] w-[480px] h-[480px] bg-[#C89A3D]/07 rounded-full blur-[110px] pointer-events-none" />

      {/* ── Main content ── */}
      <div className="relative z-10 text-center px-6 max-w-5xl pt-28 pb-20">
        {/* Label pill */}
        <div
          ref={labelRef}
          className="inline-flex items-center gap-2 bg-white/8 border border-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 mb-8"
          style={fadeUp(0)}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#C89A3D] animate-pulse" />
          <span className="text-[#C89A3D] text-xs font-semibold uppercase tracking-widest">
            About Us
          </span>
        </div>

        {/* Heading */}
        <h1
          ref={headingRef}
          className="text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6"
          style={fadeUp(100)}
        >
          We Build
          <br />
          <span
            className="text-transparent bg-clip-text"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #C89A3D, #f0c46a, #C89A3D)",
            }}
          >
            Digital Futures
          </span>
        </h1>

        {/* Gold divider line */}
        <div
          ref={dividerRef}
          className="mx-auto mb-7 h-px w-24 rounded-full"
          style={{
            background:
              "linear-gradient(to right, transparent, #C89A3D, transparent)",
            ...fadeUp(220),
          }}
        />

        {/* Description */}
        <p
          ref={textRef}
          className="text-slate-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-14"
          style={fadeUp(320)}
        >
          Dreamers Softtech LLP was founded with a vision to build meaningful
          digital products that help businesses grow and adapt. We combine
          strategy, design, and technology to deliver reliable, scalable, and
          future-ready solutions tailored to your goals.
        </p>

        {/* Stats */}
        <div
          ref={statsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
          style={fadeUp(460)}
        >
          {[
            {
              value: `${siteStats.yearsExperience}+`,
              label: "Years of Excellence",
            },
            {
              value: `${siteStats.projectsCompleted}+`,
              label: "Projects Delivered",
            },
            { value: `${siteStats.teamMembersCount}+`, label: "Team Members" },
            {
              value: `${siteStats.satisfactionRate}%`,
              label: "Client Satisfaction",
            },
          ].map((s, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl px-4 py-5 hover:border-[#C89A3D]/40 hover:bg-white/8 transition-all duration-300"
            >
              <p
                className="text-3xl font-extrabold text-transparent bg-clip-text mb-1"
                style={{
                  backgroundImage: "linear-gradient(135deg, #C89A3D, #f0c46a)",
                }}
              >
                {s.value}
              </p>
              <p className="text-slate-500 text-xs uppercase tracking-wide">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="flex items-center justify-center gap-4 flex-wrap mt-10">
          <button
            onClick={() => {
              const target = document.getElementById("our-story");
              if (target) {
                const top = target.getBoundingClientRect().top + window.scrollY;
                window.scrollTo({ top, behavior: "smooth" });
              }
            }}
            className="px-7 py-3 bg-[#C89A3D] hover:bg-[#b78930] text-white font-semibold rounded-xl text-sm transition-all duration-200 shadow-lg hover:shadow-[#C89A3D]/30 hover:shadow-xl"
          >
            Our Story
          </button>
          {/* <button className="px-7 py-3 bg-white/8 hover:bg-white/15 border border-white/20 text-white font-semibold rounded-xl text-sm transition-all duration-200 backdrop-blur-sm">
            Meet the Team
          </button> */}
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div
        ref={arrowRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
        style={fadeUp(600)}
      >
        <span className="text-slate-600 text-[10px] uppercase tracking-widest">
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

export default AboutHero;
