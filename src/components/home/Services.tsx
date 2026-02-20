import { useEffect, useRef } from "react";
import gsap from "gsap";
import servicesBg from "../../assets/about-bg2.png";

import service1 from "../../assets/service1.png";
import service2 from "../../assets/service2.png";
import service3 from "../../assets/service3.png";
import service4 from "../../assets/service4.png";
import service5 from "../../assets/service5.png";

const services = [
  {
    image: service1,
    title: "Web Development",
    description: "Custom web applications built with modern technologies",
  },
  {
    image: service2,
    title: "Mobile Development",
    description: "Native and cross-platform mobile apps for compatibility",
  },
  {
    image: service3,
    title: "UI/UX Development",
    description: "Beautiful, intuitive interfaces designed to engage users",
  },
  {
    image: service4,
    title: "E-commerce Development",
    description: "Scalable online stores with secure payment integration",
  },
  {
    image: service5,
    title: "AI / ML",
    description: "Intelligent solutions powered by artificial intelligence",
  },
];

const CARD_WIDTH = 320;
const GAP = 24;

const Services = () => {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trackRef.current) return;

    const interval = setInterval(() => {
      const track = trackRef.current!;
      const firstCard = track.children[0] as HTMLElement;

      gsap.to(track, {
        x: -(CARD_WIDTH + GAP),
        duration: 0.6,
        ease: "power2.inOut",
        onComplete: () => {
          gsap.set(track, { x: 0 });
          track.appendChild(firstCard); // 👈 DOM MOVE (no re-render)
        },
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${servicesBg})` }}
      />
      <div className="absolute inset-0 bg-white/85" />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#B8872F] mb-4">
            Our Services
          </h2>
          <p className="text-lg text-slate-700 max-w-3xl mx-auto">
            Delivering end-to-end software and digital solutions
          </p>
        </div>

        {/* Viewport */}
        <div
          className="overflow-hidden mx-auto"
          style={{ width: CARD_WIDTH * 3 + GAP * 2 }}
        >
          <div ref={trackRef} className="flex gap-6 will-change-transform">
            {services.map((service, index) => (
              <div
                key={index}
                className="w-[320px] h-[420px] shrink-0 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col"
              >
                {/* Image */}
                <div className="h-1/2 w-full flex items-center justify-center bg-slate-50">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Content */}
                <div className="h-1/2 p-6 flex flex-col justify-center">
                  <h3 className="text-xl font-semibold text-center text-[#C89A3D] mb-3">
                    {service.title}
                  </h3>
                  <p className="text-slate-700 text-center text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;

// import { useEffect, useRef } from "react";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import {
//   Code2,
//   Smartphone,
//   Palette,
//   ShoppingCart,
//   Image,
//   Brain,
//   CheckCircle,
//   Headphones,
// } from "lucide-react";

// gsap.registerPlugin(ScrollTrigger);

// const Services = () => {
//   const sectionRef = useRef<HTMLElement>(null);
//   const cardsRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       gsap.fromTo(
//         ".service-card",
//         {
//           y: 100,
//           opacity: 0,
//         },
//         {
//           y: 0,
//           opacity: 1,
//           duration: 0.8,
//           stagger: 0.2,
//           ease: "power3.out",
//           immediateRender: false,
//           scrollTrigger: {
//             trigger: cardsRef.current,
//             start: "top 85%",
//             toggleActions: "play none none reverse",
//           },
//         },
//       );
//     }, sectionRef);

//     return () => ctx.revert();
//   }, []);

//   const services = [
//     {
//       icon: Code2,
//       title: "Web Development",
//       description:
//         "Custom web applications built with modern technologies for optimal performance",
//     },
//     {
//       icon: Smartphone,
//       title: "Mobile Development",
//       description:
//         "Native and cross-platform mobile apps that deliver exceptional user experiences",
//     },
//     {
//       icon: Palette,
//       title: "UI/UX Development",
//       description:
//         "Beautiful, intuitive interfaces designed to engage and delight your users",
//     },
//     {
//       icon: ShoppingCart,
//       title: "E-commerce Development",
//       description:
//         "Scalable online stores with secure payment integration and inventory management",
//     },
//     {
//       icon: Image,
//       title: "Social Graphic Development",
//       description:
//         "Eye-catching graphics and visual content for social media platforms",
//     },
//     {
//       icon: Brain,
//       title: "AI/ML",
//       description:
//         "Intelligent solutions powered by machine learning and artificial intelligence",
//     },
//     {
//       icon: CheckCircle,
//       title: "Quality Assurance",
//       description:
//         "Comprehensive testing to ensure flawless functionality and user experience",
//     },
//     {
//       icon: Headphones,
//       title: "Dedicated Support",
//       description:
//         "24/7 technical support and maintenance to keep your systems running smoothly",
//     },
//   ];

//   return (
//     <section
//       id="services"
//       ref={sectionRef}
//       className="py-20 bg-gradient-to-br from-slate-50 to-blue-50"
//     >
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center mb-16">
//           <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
//             Our Services
//           </h2>
//           <p className="text-xl text-slate-600 max-w-3xl mx-auto">
//             Delivering end-to-end software, web, and mobile solutions that
//             accelerate business innovation
//           </p>
//         </div>

//         <div
//           ref={cardsRef}
//           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
//         >
//           {services.map((service, index) => {
//             const Icon = service.icon;
//             return (
//               <div
//                 key={index}
//                 className="service-card group bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-slate-100"
//               >
//                 <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
//                   <Icon className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />
//                 </div>
//                 <h3 className="text-xl font-bold text-slate-900 mb-3">
//                   {service.title}
//                 </h3>
//                 <p className="text-slate-600 leading-relaxed">
//                   {service.description}
//                 </p>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Services;
