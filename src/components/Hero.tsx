import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from(titleRef.current, {
      y: 100,
      opacity: 0,
      duration: 1,
      delay: 0.5,
    })
      .from(
        subtitleRef.current,
        {
          y: 50,
          opacity: 0,
          duration: 0.8,
        },
        '-=0.5'
      )
      .from(
        ctaRef.current,
        {
          y: 30,
          opacity: 0,
          duration: 0.6,
        },
        '-=0.4'
      );
  }, []);

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 pt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1
          ref={titleRef}
          className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight"
        >
          Dreamers Softtech LLP
        </h1>
        <p
          ref={subtitleRef}
          className="text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          Unlock innovative solutions with cutting-edge technologies. We deliver
          end-to-end software, web, and mobile solutions that accelerate business
          innovation.
        </p>
        <div ref={ctaRef} className="flex gap-4 justify-center flex-wrap">
          <a
            href="#contact"
            className="group px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            Get Started
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </a>
          <a
            href="#portfolio"
            className="px-8 py-4 border-2 border-slate-800 text-slate-800 rounded-lg hover:bg-slate-800 hover:text-white transition-all font-semibold"
          >
            View Our Work
          </a>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-slate-400 rounded-full flex justify-center">
          <div className="w-1.5 h-3 bg-slate-400 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
