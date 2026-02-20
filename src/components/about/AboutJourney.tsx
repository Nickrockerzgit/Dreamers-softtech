const journeyData = [
  {
    title: "Inception",
    text: "Our journey began with a small group of passionate engineers coming together from diverse backgrounds. With a shared vision to solve real-world problems through technology, the foundation of our company was laid.",
  },
  {
    title: "Extension",
    text: "As our ideas gained momentum, we expanded our capabilities by taking on more complex projects. This phase marked our transition from concept-driven work to delivering impactful digital solutions.",
  },
  {
    title: "Progression",
    text: "Through consistency, dedication, and innovation, our team grew stronger. We streamlined processes, improved quality, and strengthened client trust while scaling our operations.",
  },
  {
    title: "Transformation",
    text: "Today, we stand as a forward-thinking technology company, continuously evolving. We embrace innovation, experimentation, and growth to build solutions that shape the future.",
  },
];

const AboutJourney = () => {
  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <h2 className="text-4xl font-bold text-center text-black mb-16">
          OUR JOURNEY
        </h2>

        {/* Journey Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {journeyData.map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              {/* Circle */}
              <div className="relative w-66 h-66 rounded-full border-[6px] border-gray-200 flex items-center justify-center">
                {/* Accent Arc */}
                <span className="absolute inset-0 rounded-full border-[6px] border-[#C89A3D] border-t-transparent border-l-transparent" />

                {/* Content */}
                <div className="px-6">
                  <h3 className="text-xl font-semibold text-black mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-[13px] leading-[1.6]">
                    {item.text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <button className="px-8 py-3 border border-[#C89A3D] text-[#C89A3D] rounded-full hover:bg-[#C89A3D] hover:text-white transition">
            Contact Us →
          </button>
        </div>
      </div>
    </section>
  );
};

export default AboutJourney;
