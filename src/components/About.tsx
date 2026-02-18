import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import aboutBg from "../assets/about-bg.png";
import aboutBg2 from "../assets/about-bg2.png";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(contentRef.current, {
        x: -100,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
        },
      });

      gsap.from(imageRef.current, {
        x: 100,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-20 overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-100"
        style={{ backgroundImage: `url(${aboutBg2})` }}
      />

      {/* Soft overlay for readability */}
      <div className="absolute inset-0 bg-white/70" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div ref={contentRef}>
            <h2 className="text-4xl md:text-5xl font-bold text-[#B8872F] mb-16 text-center">
              Who We Are?
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              Dreamers Softtech LLP is the foundation of professional and
              innovative digital solutions. Our mission is to empower businesses
              through cutting-edge technology and strategic development.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              We specialize in creating custom software, web applications, and
              mobile solutions that drive growth and efficiency. With our team
              of expert developers and designers, we transform ideas into
              reality.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              Our commitment to excellence and client satisfaction sets us
              apart. We don't just build software; we build lasting partnerships
              that help businesses thrive in the digital landscape.
            </p>
            <div className="flex gap-8 mt-8">
              <div>
                <div className="text-4xl font-bold text-[#C89A3D] mb-2">
                  50+
                </div>
                <div className="text-slate-600">Projects Delivered</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#C89A3D] mb-2">
                  40+
                </div>
                <div className="text-slate-600">Happy Clients</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#C89A3D] mb-2">5+</div>
                <div className="text-slate-600">Years Experience</div>
              </div>
            </div>
          </div>

          <div ref={imageRef} className="relative">
            <div className="aspect-square bg-gradient-to-br from-[#C89A3D] to-slate-100 rounded-2xl shadow-2xl flex items-center justify-center">
              <div className="w-full h-full p-1 flex items-center justify-center">
                <img
                  src={aboutBg}
                  alt="About Dreamers Softtech"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
