import { useEffect, useRef } from "react";
import {
  Calendar,
  MapPin,
  BadgeCheck,
  Rocket,
  Headphones,
  Trophy,
} from "lucide-react";
import { usePublicStats } from "../../hooks/usePublicStats";




const AboutOverview = () => {
  const { stats } = usePublicStats();
  const headingRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);

  const data = [
    {
      icon: Calendar,
      title: "Founded in 2025",
      desc: "Dreamers Softtech delivers innovative IT solutions across industries with a passion for excellence.",
    },
    {
      icon: MapPin,
      title: "Our Location",
      desc: "Headquartered in Indore, serving clients across regions.",
    },
    {
      icon: BadgeCheck,
      title: "Certifications",
      desc: "Globally recognized standards achieved — quality and compliance at every step.",
    },
    {
      icon: Rocket,
      title: `${stats?.projectsCompleted || 0}+ Projects`,
      desc: "Successfully delivered projects across diverse industries and global markets.",
    },
    {
      icon: Headphones,
      title: "Our Expertise",
      desc: "Delivering expert solutions in Web Development, App Development, UI/UX Design, AI/ML, and Deployment Services.",
    },
    {
      icon: Trophy,
      title: "Recognition",
      desc: "Renowned for delivering award-winning IT solutions that make a measurable impact.",
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = "1";
            (entry.target as HTMLElement).style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.12 },
    );

    if (headingRef.current) observer.observe(headingRef.current);
    cardRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-gray-50 py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div
          ref={headingRef}
          className="text-center mb-16 max-w-3xl mx-auto"
          style={{
            opacity: 0,
            transform: "translateY(28px)",
            transition:
              "opacity 0.8s cubic-bezier(0.4,0,0.2,1), transform 0.8s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-[#C89A3D]" />
            <span className="text-xs uppercase tracking-widest text-[#C89A3D] font-semibold">
              Who We Are
            </span>
            <div className="w-8 h-px bg-[#C89A3D]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Your End-to-End{" "}
            <span className="text-[#C89A3D]">Software Development</span> Partner
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                ref={(el) => {
                  if (el) cardRefs.current[index] = el;
                }}
                className="group relative bg-white rounded-2xl p-7 border border-gray-100 hover:border-[#C89A3D]/30 shadow-sm hover:shadow-lg transition-all duration-400 overflow-hidden cursor-default"
                style={{
                  opacity: 0,
                  transform: "translateY(40px)",
                  transition: `opacity 0.75s cubic-bezier(0.4,0,0.2,1) ${index * 80}ms, transform 0.75s cubic-bezier(0.4,0,0.2,1) ${index * 80}ms, box-shadow 0.3s ease, border-color 0.3s ease`,
                }}
              >
                {/* Hover bg glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#C89A3D]/04 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#C89A3D] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Icon box */}
                <div className="w-12 h-12 rounded-xl bg-[#C89A3D]/10 flex items-center justify-center mb-5 group-hover:bg-[#C89A3D]/20 transition-colors duration-300">
                  <Icon className="w-5 h-5 text-[#C89A3D]" />
                </div>

                {/* Content */}
                <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-[#C89A3D] transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutOverview;
