const AboutMissionVision = () => {
  return (
    <section className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
          {/* Mission Card */}
          <div className="relative h-full">
            {/* Background shade */}
            <div className="absolute inset-0 translate-x-3 translate-y-3 bg-[#C89A3D]/10 rounded-xl"></div>

            <div className="relative bg-white p-8 rounded-xl shadow-lg h-full flex flex-col">
              <h3 className="flex items-center gap-3 text-xl font-semibold mb-4 text-[#B8872F]">
                <span className="text-[#C89A3D] text-2xl">→</span>
                OUR MISSION
              </h3>

              <p className="text-gray-600 leading-relaxed flex-grow">
                At Dreamers Softtech LLP, our mission is to turn ideas into
                impactful digital solutions that drive real business growth. We
                collaborate closely with our clients to understand their vision
                and transform it into scalable, high-quality software through
                thoughtful design, modern technologies, and reliable
                engineering.
                <br />
                <br />
                Every project we undertake is guided by a commitment to
                innovation, transparency, and long-term value. By solving
                complex challenges with clarity and precision, we aim to build
                trusted partnerships that grow alongside our client’s success.
              </p>
            </div>
          </div>

          {/* Vision Card */}
          <div className="relative h-full">
            {/* Background shade */}
            <div className="absolute inset-0 translate-x-3 translate-y-3 bg-[#C89A3D]/10 rounded-xl"></div>

            <div className="relative bg-white p-8 rounded-xl shadow-lg h-full flex flex-col">
              <h3 className="flex items-center gap-3 text-xl font-semibold mb-4 text-[#B8872F]">
                <span className="text-[#C89A3D] text-2xl">→</span>
                OUR VISION
              </h3>

              <p className="text-gray-600 leading-relaxed flex-grow">
                Our vision is to become a trusted technology partner for
                businesses across the globe, helping them navigate the digital
                landscape with confidence, adaptability, and strategic clarity.
                <br />
                <br />
                By continuously embracing innovation and emerging technologies,
                we aim to create sustainable digital solutions that empower
                organizations to grow, evolve, and succeed in an ever-changing
                future.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMissionVision;
