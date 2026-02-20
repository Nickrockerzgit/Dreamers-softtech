import {
  Calendar,
  MapPin,
  BadgeCheck,
  Rocket,
  Headphones,
  Trophy,
} from "lucide-react";

const data = [
  {
    icon: Calendar,
    title: "Founded in 2020",
    desc: "Nextloop Technologies delivers innovative IT solutions across industries.",
  },
  {
    icon: MapPin,
    title: "Location",
    desc: "Headquartered in Indore, with an office in the UK.",
  },
  {
    icon: BadgeCheck,
    title: "Certifications",
    desc: "Globally recognized standards achieved.",
  },
  {
    icon: Rocket,
    title: "Projects Completed",
    desc: "Successfully delivered 30+ projects globally.",
  },
  {
    icon: Headphones,
    title: "Expertise",
    desc: "Specializing in Cloud Solutions, Blockchain, Custom Software, and Digital Transformation.",
  },
  {
    icon: Trophy,
    title: "Recognition",
    desc: "Renowned for delivering award-winning IT solutions.",
  },
];

const AboutOverview = () => {
  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <h2 className="text-4xl font-bold text-center text-black mb-16">
          YOUR END-TO-END{" "}
          <span className="text-[#C89A3D]">SOFTWARE DEVELOPMENT</span> PARTNER
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="border border-gray-200 p-6 hover:shadow-md transition"
              >
                <Icon className="w-8 h-8 text-[#C89A3D] mb-4" />

                <h3 className="text-lg font-semibold text-black mb-2">
                  {item.title}
                </h3>

                <p className="text-gray-600 text-sm leading-relaxed">
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
