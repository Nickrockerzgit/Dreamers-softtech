import { useEffect, useRef } from "react";

const journeyData = [
  {
    title: "Inception",
    step: "01",
    year: "2018",
    text: "Our journey began with a small group of passionate engineers coming together from diverse backgrounds. With a shared vision to solve real-world problems through technology, the foundation of our company was laid.",
    align: "right",
  },
  {
    title: "Extension",
    step: "02",
    year: "2020",
    text: "As our ideas gained momentum, we expanded our capabilities by taking on more complex projects. This phase marked our transition from concept-driven work to delivering impactful digital solutions.",
    align: "left",
  },
  {
    title: "Progression",
    step: "03",
    year: "2022",
    text: "Through consistency, dedication, and innovation, our team grew stronger. We streamlined processes, improved quality, and strengthened client trust while scaling our operations.",
    align: "right",
  },
  {
    title: "Transformation",
    step: "04",
    year: "2024",
    text: "Today, we stand as a forward-thinking technology company, continuously evolving. We embrace innovation, experimentation, and growth to build solutions that shape the future.",
    align: "left",
  },
];

const AboutJourney = () => {
  const headingRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<HTMLDivElement[]>([]);
  const lineRef = useRef<HTMLDivElement>(null);

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
      { threshold: 0.2 },
    );

    if (headingRef.current) observer.observe(headingRef.current);
    if (lineRef.current) observer.observe(lineRef.current);
    itemRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-gray-50 py-28 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div
          ref={headingRef}
          className="text-center mb-20"
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
              How We Got Here
            </span>
            <div className="w-8 h-px bg-[#C89A3D]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Our Journey
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Center vertical line */}
          <div
            ref={lineRef}
            className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px hidden md:block"
            style={{
              background:
                "linear-gradient(to bottom, transparent, #C89A3D88 10%, #C89A3D88 90%, transparent)",
              opacity: 0,
              transition: "opacity 1s ease 0.2s",
            }}
          />

          <div className="flex flex-col gap-16">
            {journeyData.map((item, index) => {
              const isRight = item.align === "right";

              return (
                <div
                  key={index}
                  ref={(el) => {
                    if (el) itemRefs.current[index] = el;
                  }}
                  className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-0 ${
                    isRight ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                  style={{
                    opacity: 0,
                    transform: `translateY(40px) translateX(${isRight ? "-24px" : "24px"})`,
                    transition: `opacity 0.8s cubic-bezier(0.4,0,0.2,1) ${index * 150}ms, transform 0.8s cubic-bezier(0.4,0,0.2,1) ${index * 150}ms`,
                  }}
                >
                  {/* Content card */}
                  <div
                    className={`w-full md:w-[calc(50%-40px)] ${isRight ? "md:pr-10" : "md:pl-10"}`}
                  >
                    <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 hover:shadow-md hover:border-[#C89A3D]/20 transition-all duration-300 group">
                      {/* Year tag */}
                      <span className="inline-block bg-[#C89A3D]/10 text-[#C89A3D] text-xs font-bold px-3 py-1 rounded-full mb-4 tracking-wide">
                        {item.year}
                      </span>

                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#C89A3D] transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                  </div>

                  {/* Center node */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 flex-col items-center z-10">
                    <div className="w-12 h-12 rounded-full bg-white border-2 border-[#C89A3D] flex items-center justify-center shadow-md shadow-[#C89A3D]/20">
                      <span className="text-[#C89A3D] text-xs font-extrabold">
                        {item.step}
                      </span>
                    </div>
                  </div>

                  {/* Mobile step badge */}
                  <div className="md:hidden flex items-center gap-3 self-start">
                    <div className="w-9 h-9 rounded-full bg-[#C89A3D] flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-extrabold">
                        {item.step}
                      </span>
                    </div>
                    <span className="text-[#C89A3D] text-xs font-bold uppercase tracking-widest">
                      {item.year}
                    </span>
                  </div>

                  {/* Empty right/left side spacer */}
                  <div className="hidden md:block w-[calc(50%-40px)]" />
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div
          className="mt-20 text-center"
          ref={(el) => {
            if (el) itemRefs.current[journeyData.length] = el;
          }}
          style={{
            opacity: 0,
            transform: "translateY(20px)",
            transition: `opacity 0.8s cubic-bezier(0.4,0,0.2,1) ${journeyData.length * 150}ms, transform 0.8s cubic-bezier(0.4,0,0.2,1) ${journeyData.length * 150}ms`,
          }}
        >
          <button className="px-8 py-3 border-2 border-[#C89A3D] text-[#C89A3D] rounded-full font-semibold text-sm hover:bg-[#C89A3D] hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-[#C89A3D]/25">
            Contact Us →
          </button>
        </div>
      </div>
    </section>
  );
};

export default AboutJourney;
