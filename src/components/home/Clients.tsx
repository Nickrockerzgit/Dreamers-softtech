import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Clients = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const logosRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!logosRef.current) return;

    const ctx = gsap.context(() => {}, sectionRef);

    return () => ctx.revert();
  }, []);

  const clients = [
    "TechCorp",
    "InnovateLabs",
    "CloudSync",
    "DataFlow",
    "MobileFirst",
    "WebMasters",
    "CodeVision",
    "DigitalHub",
    "SmartSolutions",
    "FutureTech",
  ];

  return (
    <section
      id="clients"
      ref={sectionRef}
      className="py-20 bg-gradient-to-br from-slate-50 to-blue-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Our Clients
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Trusted by global brands and startups for innovative technology
            solutions and long-term partnerships
          </p>
        </div>

        {/* Client logos */}
        <div
          ref={logosRef}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8"
        >
          {clients.map((client, index) => (
            <div
              key={index}
              className="client-logo bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-300 group-hover:text-blue-600 transition-colors">
                  {client.charAt(0)}
                </div>
                <div className="text-sm font-semibold text-slate-700 mt-2">
                  {client}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Clients;
