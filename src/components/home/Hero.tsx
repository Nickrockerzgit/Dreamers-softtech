import { useEffect, useRef } from "react";
import { ArrowRight, ArrowDown } from "lucide-react";
import { Link } from "react-router-dom";
import heroBg from "../../assets/her02-bg.png";

const Hero = () => {
  const labelRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = [
      { el: labelRef.current, delay: 100 },
      { el: titleRef.current, delay: 250 },
      { el: subtitleRef.current, delay: 450 },
      { el: ctaRef.current, delay: 600 },
      { el: statsRef.current, delay: 750 },
      { el: arrowRef.current, delay: 1000 },
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
    transition: `opacity 0.9s cubic-bezier(0.4,0,0.2,1) ${delay}ms, transform 0.9s cubic-bezier(0.4,0,0.2,1) ${delay}ms`,
  });

  return (
    <section
      id="home"
      className="relative min-h-screen w-full flex items-center overflow-hidden"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />

      {/* Layered overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, #C89A3D 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Gold glow */}
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#C89A3D]/10 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 translate-y-1/2" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-24 pb-20">
        <div className="max-w-3xl">
          {/* Label pill */}
          <div
            ref={labelRef}
            className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-8"
            style={fadeUp(100)}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#C89A3D] animate-pulse" />
            <span className="text-[#C89A3D] text-xs font-semibold uppercase tracking-widest">
              Dreamers Softtech LLP
            </span>
          </div>

          {/* Heading */}
          <h1
            ref={titleRef}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] tracking-tight mb-6"
            style={fadeUp(250)}
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

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="text-gray-300 text-base md:text-lg leading-relaxed max-w-xl mb-10"
            style={fadeUp(450)}
          >
            Unlock innovative solutions with cutting-edge technologies. We
            deliver end-to-end software, web, and mobile solutions that
            accelerate your business growth.
          </p>

          {/* CTAs */}
          <div
            ref={ctaRef}
            className="flex gap-4 flex-wrap"
            style={fadeUp(600)}
          >
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 px-7 py-3.5 bg-[#C89A3D] hover:bg-[#b78930] text-white font-semibold rounded-xl text-sm transition-all duration-200 shadow-lg hover:shadow-[#C89A3D]/30 hover:shadow-xl"
            >
              Get Started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>

            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-semibold rounded-xl text-sm transition-all duration-200 backdrop-blur-sm"
            >
              View Our Work
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={arrowRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
        style={fadeUp(1000)}
      >
        <span className="text-white/30 text-[10px] uppercase tracking-widest">
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

export default Hero;
