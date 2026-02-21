const services = [
  {
    title: "AI & ML Solutions",
    description:
      "Intelligent systems that learn, adapt, and automate business processes using modern AI and machine learning technologies.",
    icon: "🤖",
  },
  {
    title: "Web Development",
    description:
      "High-performance, scalable, and user-focused web applications built with modern frameworks and best practices.",
    icon: "🌐",
  },
  {
    title: "Web3 Development",
    description:
      "Decentralized applications, smart contracts, and blockchain-powered solutions for the future web.",
    icon: "⛓️",
  },
  {
    title: "Mobile App Development",
    description:
      "Robust and intuitive mobile applications for Android and iOS platforms tailored to your users.",
    icon: "📱",
  },
  {
    title: "DevOps & Cloud",
    description:
      "Automated deployments, scalable cloud infrastructure, and CI/CD pipelines for faster delivery.",
    icon: "⚙️",
  },
];

const ServiceCard = ({ title, description, icon }) => {
  return (
    <div
      className="
        group relative rounded-xl border border-gray-200 bg-white
        p-8 text-center shadow-sm transition-all duration-300
        hover:bg-[#1c1917] hover:border-[#C89A3D]
      "
    >
      {/* Icon */}
      <div className="text-4xl mb-6 transition-colors duration-300 group-hover:text-[#C89A3D]">
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold mb-4 transition-colors duration-300 text-[#C89A3D] group-hover:text-white">
        {title}
      </h3>

      {/* Description */}
      <p className="text-[13px] leading-relaxed text-gray-600 transition-colors duration-300 group-hover:text-gray-300">
        {description}
      </p>

      {/* Gold border glow */}
      <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition">
        <div className="absolute inset-0 rounded-xl ring-1 ring-[#C89A3D]/40" />
      </div>
    </div>
  );
};

/* ----------------------------- Section ----------------------------- */

const ServicesSection = () => {
  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-[#C89A3D]">Our Services</span>
          </h2>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            We provide end-to-end technology solutions that help businesses
            innovate, scale, and stay ahead in a rapidly evolving digital world.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
