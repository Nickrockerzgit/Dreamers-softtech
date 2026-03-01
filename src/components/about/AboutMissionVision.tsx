import { useEffect, useRef } from "react";
import { Compass, Rocket } from "lucide-react";

const cards = [
  {
    label: "Our Mission",
    icon: Rocket,
    accent: "#C89A3D",
    heading: "Building With Purpose",
    text1:
      "At Dreamers Softtech LLP, our mission is to turn ideas into impactful digital solutions that drive real business growth. We collaborate closely with our clients to understand their vision and transform it into scalable, high-quality software through thoughtful design, modern technologies, and reliable engineering.",
    text2:
      "Every project we undertake is guided by a commitment to innovation, transparency, and long-term value. By solving complex challenges with clarity and precision, we aim to build trusted partnerships that grow alongside our client's success.",
    highlights: ["Innovation", "Transparency", "Long-term Value"],
  },
  {
    label: "Our Vision",
    icon: Compass,
    accent: "#C89A3D",
    heading: "Leading Digital Futures",
    text1:
      "Our vision is to become a trusted technology partner for businesses across the globe, helping them navigate the digital landscape with confidence, adaptability, and strategic clarity.",
    text2:
      "By continuously embracing innovation and emerging technologies, we aim to create sustainable digital solutions that empower organizations to grow, evolve, and succeed in an ever-changing future.",
    highlights: ["Global Reach", "Adaptability", "Sustainability"],
  },
];

const AboutMissionVision = () => {
  const headingRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = "1";
            (entry.target as HTMLElement).style.transform =
              "translateY(0) translateX(0)";
          }
        });
      },
      { threshold: 0.15 },
    );

    if (headingRef.current) observer.observe(headingRef.current);
    cardRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-white py-28 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
              What Drives Us
            </span>
            <div className="w-8 h-px bg-[#C89A3D]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Mission & Vision
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={i}
                ref={(el) => {
                  if (el) cardRefs.current[i] = el;
                }}
                className="group relative rounded-3xl overflow-hidden border border-gray-100 hover:border-[#C89A3D]/30 shadow-sm hover:shadow-xl transition-all duration-500 bg-white flex flex-col"
                style={{
                  opacity: 0,
                  transform: `translateY(44px) translateX(${i === 0 ? "-20px" : "20px"})`,
                  transition: `opacity 0.8s cubic-bezier(0.4,0,0.2,1) ${i * 150}ms, transform 0.8s cubic-bezier(0.4,0,0.2,1) ${i * 150}ms, box-shadow 0.4s ease, border-color 0.4s ease`,
                }}
              >
                {/* Top gold bar */}
                <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#C89A3D] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="p-8 flex flex-col flex-grow">
                  {/* Icon + Label */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#C89A3D]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#C89A3D]/20 transition-colors duration-300">
                      <Icon className="w-5 h-5 text-[#C89A3D]" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-[#C89A3D] font-semibold">
                        {card.label}
                      </p>
                      <h3 className="text-xl font-bold text-gray-900 mt-0.5">
                        {card.heading}
                      </h3>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="w-full h-px bg-gray-100 mb-6" />

                  {/* Text */}
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">
                    {card.text1}
                  </p>
                  <p className="text-gray-500 text-sm leading-relaxed flex-grow">
                    {card.text2}
                  </p>

                  {/* Highlight tags */}
                  <div className="flex flex-wrap gap-2 mt-7">
                    {card.highlights.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full bg-[#C89A3D]/08 border border-[#C89A3D]/20 text-[#C89A3D] text-[11px] font-semibold tracking-wide"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutMissionVision;
