import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";
import heroBg from "../../assets/her02-bg.png";

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(titleRef.current, {
        y: 80,
        opacity: 0,
        duration: 1,
      })
        .from(
          subtitleRef.current,
          {
            y: 40,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.5",
        )
        .from(
          ctaRef.current,
          {
            y: 30,
            opacity: 0,
            duration: 0.6,
          },
          "-=0.4",
        );
    }, heroRef);

    return () => ctx.revert(); // 👈 CRITICAL
  }, []);

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen w-full flex items-center"
    >
      ``
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-20"
        style={{
          backgroundImage: `url(${heroBg})`,
        }}
      />
      {/* Balanced Overlay (Not Too Dark) */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent -z-10" />
      {/* Content */}
      <div className="relative z-10 max-w-8xl mx-auto px-6 lg:px-8 w-full">
        <div className="max-w-2xl">
          {/* Heading */}
          <h1
            ref={titleRef}
            className="text-5xl md:text-5xl font-bold text-white mb-6 leading-tight drop-shadow-lg"
          >
            Dreamers Softtech LLP
          </h1>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="text-base md:text-1xl text-gray-200 mb-12 leading-relaxed"
          >
            Unlock innovative solutions with cutting-edge technologies. We
            deliver end-to-end software, web, and mobile solutions that
            accelerate business innovation.
          </p>

          {/* CTA Buttons */}
          <div ref={ctaRef} className="flex gap-4 flex-wrap">
            <a
              href="#contact"
              className="group px-8 py-4 bg-[#C89A3D] hover:bg-[#B8872F] text-white rounded-lg transition-all font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              Get Started
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </a>

            <a
              href="#portfolio"
              className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white hover:text-black transition-all font-semibold"
            >
              View Our Work
            </a>
          </div>
        </div>
      </div>
      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
        <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
          <div className="w-1.5 h-3 bg-gray-300 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

// import { useEffect, useRef } from "react";
// import gsap from "gsap";
// import { ArrowRight } from "lucide-react";
// import heroBg from "../assets/hero-bg.png";

// const Hero = () => {
//   const heroRef = useRef<HTMLDivElement>(null);
//   const titleRef = useRef<HTMLHeadingElement>(null);
//   const subtitleRef = useRef<HTMLParagraphElement>(null);
//   const ctaRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

//     tl.from(titleRef.current, {
//       y: 100,
//       opacity: 0,
//       duration: 1,
//       delay: 0.5,
//     })
//       .from(
//         subtitleRef.current,
//         {
//           y: 50,
//           opacity: 0,
//           duration: 0.8,
//         },
//         "-=0.5",
//       )
//       .from(
//         ctaRef.current,
//         {
//           y: 30,
//           opacity: 0,
//           duration: 0.6,
//         },
//         "-=0.4",
//       );
//   }, []);

//   return (
//     <section
//       id="home"
//       ref={heroRef}
//       className="relative min-h-screen w-full overflow-hidden flex items-center"
//     >
//       <div
//         className="absolute inset-0 -z-20 bg-cover bg-center"
//         style={{
//           backgroundImage: `url(${heroBg})`,
//         }}
//       />

//       {/* Overlay */}
//       <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
//       <div className="relative z-10 max-w-7xl px-6 lg:px-8 py-20 w-full">
//         <div className="max-w-3xl">
//           {/* Background Image */}

//           {/* Heading */}
//           <h1
//             ref={titleRef}
//             className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
//           >
//             Dreamers Softtech LLP
//           </h1>

//           <p
//             ref={subtitleRef}
//             className="text-xl md:text-2xl text-gray-200 mb-12 leading-relaxed"
//           >
//             Unlock innovative solutions with cutting-edge technologies. We
//             deliver end-to-end software, web, and mobile solutions that
//             accelerate business innovation.
//           </p>
//           <div ref={ctaRef} className="flex gap-4 flex-wrap">
//             <a
//               href="#contact"
//               className="group px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl"
//             >
//               Get Started
//               <ArrowRight
//                 size={20}
//                 className="group-hover:translate-x-1 transition-transform"
//               />
//             </a>
//             <a
//               href="#portfolio"
//               className="px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-black
//             rounded-lg hover:bg-slate-800 hover:text-white transition-all font-semibold"
//             >
//               View Our Work
//             </a>
//           </div>
//         </div>
//       </div>

//       <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
//         <div className="w-6 h-10 border-2 border-slate-400 rounded-full flex">
//           <div className="w-1.5 h-3 bg-slate-400 rounded-full mt-2"></div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Hero;
