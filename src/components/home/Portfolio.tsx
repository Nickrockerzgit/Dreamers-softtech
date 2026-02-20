import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ExternalLink } from "lucide-react";

import service1 from "../../assets/service4.png";
import portfolio2 from "../../assets/portfolio2.png";
import portfolio3 from "../../assets/portfolio3.png";
import portfolio4 from "../../assets/portfolio4.png";
import portfolio5 from "../../assets/portfolio5.png";
import portfolio6 from "../../assets/portfolio6.png";

gsap.registerPlugin(ScrollTrigger);

const Portfolio = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {}, sectionRef);

    return () => ctx.revert();
  }, []);

  const projects = [
    {
      title: "E-commerce Platform",
      category: "Web Development",
      description:
        "A comprehensive online shopping solution with advanced features",
      image: service1,
    },
    {
      title: "Healthcare App",
      category: "Mobile Development",
      description: "Patient management and telemedicine platform",
      image: portfolio2,
    },
    {
      title: "Financial Dashboard",
      category: "Web Application",
      description: "Real-time analytics and reporting system",
      image: portfolio3,
    },
    {
      title: "Social Media Platform",
      category: "Full Stack",
      description: "Community-driven content sharing application",
      image: portfolio4,
    },
    {
      title: "Educational Portal",
      category: "Web Development",
      description: "Online learning management system",
      image: portfolio5,
    },
    {
      title: "Food Delivery App",
      category: "Mobile Development",
      description: "On-demand food ordering and delivery solution",
      image: portfolio6,
    },
  ];

  return (
    <section id="portfolio" ref={sectionRef} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#B8872F] mb-4">
            Our Portfolio
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Showcasing innovative software and digital solutions that deliver
            measurable business impact
          </p>
        </div>

        <div
          ref={projectsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {projects.map((project, index) => (
            <div
              key={index}
              className="portfolio-item group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
            >
              <div
                className="aspect-[4/3] bg-contain bg-center bg-no-repeat flex items-center justify-center relative"
                style={{
                  backgroundImage: `url(${project.image})`,
                }}
              >
                <div className="absolute inset-0 bg-black/20 backdrop-blur-xs group-hover:backdrop-blur-xs transition-all duration-300" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all"></div>
                <div className="relative z-10 text-white text-center p-6">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <ExternalLink className="w-8 h-8" />
                  </div>
                  <div className="text-sm font-medium mb-2 opacity-90">
                    {project.category}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{project.title}</h3>
                  <p className="text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {project.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
