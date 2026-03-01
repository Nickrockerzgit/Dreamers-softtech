import { useEffect, useRef } from "react";
import servicesBg from "../../assets/about-bg2.png";

import service1 from "../../assets/serv1.png";
import service2 from "../../assets/serv2.png";
import service3 from "../../assets/serv3.png";
import service4 from "../../assets/serv4.png";
import service5 from "../../assets/serv5.png";
import service6 from "../../assets/serv6.png";

const services = [
  {
    image: service1,
    title: "Web Development",
    description:
      "Custom web applications built with modern technologies for performance and scale.",
  },
  {
    image: service2,
    title: "Mobile Development",
    description:
      "Native and cross-platform mobile apps for seamless compatibility.",
  },
  {
    image: service3,
    title: "UI/UX Design",
    description:
      "Beautiful, intuitive interfaces designed to engage and delight users.",
  },
  {
    image: service4,
    title: "E-commerce",
    description:
      "Scalable online stores with secure payment integration built to convert.",
  },
  {
    image: service5,
    title: "AI / ML",
    description:
      "Intelligent solutions powered by cutting-edge artificial intelligence.",
  },
  {
    image: service6,
    title: "Free Consulting",
    description:
      "Expert guidance to align your tech strategy with your business goals.",
  },
];

const ServiceCard = ({
  service,
  index,
}: {
  service: (typeof services)[0];
  index: number;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          card.style.opacity = "1";
          card.style.transform = "translateY(0px)";
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className="group relative rounded-2xl overflow-hidden cursor-pointer"
      style={{
        opacity: 0,
        transform: "translateY(48px)",
        transition: `opacity 0.7s cubic-bezier(0.4,0,0.2,1) ${index * 80}ms, transform 0.7s cubic-bezier(0.4,0,0.2,1) ${index * 80}ms`,
      }}
    >
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="bg-white p-5 border-b-2 border-transparent group-hover:border-[#C89A3D] transition-all duration-300">
        <h3 className="text-lg font-bold text-gray-900 mb-1.5 group-hover:text-[#C89A3D] transition-colors duration-300">
          {service.title}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          {service.description}
        </p>
      </div>
    </div>
  );
};

const Services = () => {
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
    <section className="relative py-24">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${servicesBg})` }}
      />
      <div className="absolute inset-0 bg-gray-50/92" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading — fades in first */}
        <div
          ref={headingRef}
          className="mb-16"
          style={{
            opacity: 0,
            transform: "translateY(32px)",
            transition:
              "opacity 0.8s cubic-bezier(0.4,0,0.2,1), transform 0.8s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-[#C89A3D]" />
            <span className="text-xs uppercase tracking-widest text-[#C89A3D] font-semibold">
              What We Do
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Our <span className="text-[#C89A3D]">Services</span>
            </h2>
            <p className="text-gray-500 max-w-md text-sm leading-relaxed">
              Delivering end-to-end software and digital solutions that help
              businesses grow, scale, and lead.
            </p>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
