import { useEffect, useRef } from "react";
import { Bot, Globe, Link2, Smartphone, Cloud, ArrowRight } from "lucide-react";

const services = [
  {
    title: "AI & ML Solutions",
    description:
      "Intelligent systems that learn, adapt, and automate business processes using modern AI and machine learning technologies.",
    icon: Bot,
    tag: "Artificial Intelligence",
  },
  {
    title: "Web Development",
    description:
      "High-performance, scalable, and user-focused web applications built with modern frameworks and best practices.",
    icon: Globe,
    tag: "Full Stack",
  },
  {
    title: "Web3 Development",
    description:
      "Decentralized applications, smart contracts, and blockchain-powered solutions for the future web.",
    icon: Link2,
    tag: "Blockchain",
  },
  {
    title: "Mobile App Development",
    description:
      "Robust and intuitive mobile applications for Android and iOS platforms tailored to your users.",
    icon: Smartphone,
    tag: "iOS & Android",
  },
  {
    title: "DevOps & Cloud",
    description:
      "Automated deployments, scalable cloud infrastructure, and CI/CD pipelines for faster delivery.",
    icon: Cloud,
    tag: "Infrastructure",
  },
];

type Service = (typeof services)[0];

const ServiceCard = ({
  service,
  index,
}: {
  service: Service;
  index: number;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const Icon = service.icon;

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className="group relative bg-white rounded-2xl border border-gray-100 p-7 shadow-sm hover:shadow-xl hover:border-[#C89A3D]/30 transition-all duration-400 overflow-hidden cursor-default flex flex-col"
      style={{
        opacity: 0,
        transform: "translateY(40px)",
        transition: `opacity 0.75s cubic-bezier(0.4,0,0.2,1) ${index * 90}ms, transform 0.75s cubic-bezier(0.4,0,0.2,1) ${index * 90}ms, box-shadow 0.3s ease, border-color 0.3s ease`,
      }}
    >
      {/* Hover top accent */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#C89A3D] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Hover bg glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#C89A3D]/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Icon + tag row */}
      <div className="flex items-center justify-between mb-6">
        <div className="w-12 h-12 rounded-xl bg-[#C89A3D]/10 flex items-center justify-center group-hover:bg-[#C89A3D]/20 transition-colors duration-300">
          <Icon className="w-5 h-5 text-[#C89A3D]" />
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
          {service.tag}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-[#C89A3D] transition-colors duration-300">
        {service.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-500 leading-relaxed flex-grow">
        {service.description}
      </p>

      {/* Learn more */}
      <div className="flex items-center gap-1.5 mt-6 text-[#C89A3D] text-xs font-semibold opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transform transition-all duration-300">
        <span>Learn more</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </div>
    </div>
  );
};

const ServicesSection = () => {
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="service-section" className="bg-gray-50 py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div
          ref={headingRef}
          className="text-center mb-16"
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
              What We Do
            </span>
            <div className="w-8 h-px bg-[#C89A3D]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our <span className="text-[#C89A3D]">Services</span>
          </h2>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto leading-relaxed">
            We provide end-to-end technology solutions that help businesses
            innovate, scale, and stay ahead in a rapidly evolving digital world.
          </p>
        </div>

        {/* Grid — 5 cards: 3 on top, 2 centered below */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.slice(0, 3).map((service, index) => (
            <ServiceCard key={index} service={service} index={index} />
          ))}
        </div>
        <div className="grid gap-6 sm:grid-cols-2 mt-6 max-w-2xl mx-auto lg:max-w-none lg:grid-cols-2 lg:w-2/3 lg:mx-auto">
          {services.slice(3).map((service, index) => (
            <ServiceCard key={index + 3} service={service} index={index + 3} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
