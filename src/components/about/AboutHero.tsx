import { useEffect, useRef } from "react";
import gsap from "gsap";

// Replace with your own image
// import aboutBg from "../../assets/about/about-hero.jpg";

const AboutHero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

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
      {/* Background Image */}
      {/* <img
        src={aboutBg}
        alt="About background"
        className="absolute inset-0 w-full h-full object-cover"
      /> */}

      {/* Dark Overlay */}
      {/* <div className="absolute inset-0 bg-black/70" /> */}

      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1c1917] to-[#3a2a0f]" />

      {/* Soft gold glow */}
      <div className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-[#C89A3D]/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-[500px] h-[500px] bg-[#C89A3D]/10 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl px-6 pt-24">
        <h1
          ref={headingRef}
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
        >
          <span className="text-[#C89A3D]">ABOUT</span> US
        </h1>

        <p
          ref={textRef}
          className="text-base md:text-lg lg:text-xl text-slate-200 leading-relaxed"
        >
          Dreamers Softtech LLP was founded with a vision to build meaningful
          digital products that help businesses grow and adapt in a fast-moving
          digital world. We combine strategy, design, and technology to deliver
          reliable, scalable, and future-ready solutions tailored to your goals.
        </p>
      </div>
    </section>
  );
};

export default AboutHero;
