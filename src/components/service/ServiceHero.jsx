import { useEffect, useRef } from "react";
import gsap from "gsap";

const ServiceHero = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from([headingRef.current, textRef.current], {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden flex items-center justify-center text-center text-white"
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1c1917] to-[#3a2a0f]" />

      {/* Gold glow */}
      <div className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-[#C89A3D]/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-[500px] h-[500px] bg-[#C89A3D]/10 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl px-6 pt-24">
        <h1
          ref={headingRef}
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
        >
          <span className="text-[#C89A3D]">SERVICES</span>
        </h1>

        <p
          ref={textRef}
          className="text-base md:text-lg lg:text-xl text-slate-200 leading-relaxed"
        >
          At Dreamers Softtech LLP, we deliver technology services that help
          businesses build, scale, and innovate with confidence.
        </p>
      </div>
    </section>
  );
};

export default ServiceHero;
