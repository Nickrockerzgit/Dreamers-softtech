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
  {
    image: service6,
    title: "Free Consulting",
    description: "Intelligent solutions powered by artificial intelligence",
  },
];

const Services = () => {
  return (
    <section className="relative py-20">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${servicesBg})` }}
      />
      <div className="absolute inset-0 bg-white/85" />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#B8872F] mb-4">
            Our Services
          </h2>
          <p className="text-lg text-slate-700 max-w-3xl mx-auto">
            Delivering end-to-end software and digital solutions
          </p>
        </div>

        {/* Cards */}
        <div className="flex flex-wrap justify-center gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="relative w-[360px] h-[260px] rounded-2xl overflow-hidden shadow-xl group cursor-pointer"
            >
              {/* Image */}
              <img
                src={service.image}
                alt={service.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
              />

              {/* 75% Bright → 25% Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-black/70" />

              {/* Content */}
              <div className="absolute bottom-0 p-6 text-white z-10 transition-transform duration-700 ease-in-out group-hover:scale-105">
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-sm leading-relaxed text-white/90">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
