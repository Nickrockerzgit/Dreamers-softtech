import { useEffect, useRef } from "react";
import { ExternalLink, ArrowRight } from "lucide-react";

import portfolio1 from "../../assets/service4.png";
import portfolio2 from "../../assets/portfolio2.png";
import portfolio3 from "../../assets/portfolio3.png";
import portfolio4 from "../../assets/portfolio4.png";
import portfolio5 from "../../assets/portfolio5.png";
import portfolio6 from "../../assets/portfolio6.png";

const projects = [
  {
    title: "E-commerce Platform",
    category: "Web Development",
    description:
      "A comprehensive online shopping solution with advanced features, secure payments, and seamless UX.",
    image: portfolio1,
    tag: "01",
    size: "large", // spans 2 cols
  },
  {
    title: "Healthcare App",
    category: "Mobile Development",
    description:
      "Patient management and telemedicine platform built for reliability and compliance.",
    image: portfolio2,
    tag: "02",
    size: "small",
  },
  {
    title: "Financial Dashboard",
    category: "Web Application",
    description:
      "Real-time analytics and reporting system with beautiful data visualizations.",
    image: portfolio3,
    tag: "03",
    size: "small",
  },
  {
    title: "Social Media Platform",
    category: "Full Stack",
    description:
      "Community-driven content sharing application built to scale to millions.",
    image: portfolio4,
    tag: "04",
    size: "small",
  },
  {
    title: "Educational Portal",
    category: "Web Development",
    description:
      "Online learning management system with live classes, quizzes, and progress tracking.",
    image: portfolio5,
    tag: "05",
    size: "large",
  },
  {
    title: "Food Delivery App",
    category: "Mobile Development",
    description:
      "On-demand food ordering and delivery solution with real-time tracking.",
    image: portfolio6,
    tag: "06",
    size: "small",
  },
];

const ProjectCard = ({
  project,
  index,
  className = "",
}: {
  project: (typeof projects)[0];
  index: number;
  className?: string;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`group relative overflow-hidden rounded-3xl cursor-pointer ${className}`}
      style={{
        opacity: 0,
        transform: "translateY(52px)",
        transition: `opacity 0.75s cubic-bezier(0.4,0,0.2,1) ${index * 100}ms, transform 0.75s cubic-bezier(0.4,0,0.2,1) ${index * 100}ms`,
      }}
    >
      {/* Image */}
      <img
        src={project.image}
        alt={project.title}
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />

      {/* Base overlay — always visible at bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Hover overlay — fades in */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Tag */}
      <div className="absolute top-5 left-5 bg-white/15 backdrop-blur-sm border border-white/25 text-white text-xs font-bold px-3 py-1 rounded-full">
        {project.tag}
      </div>

      {/* Category pill */}
      <div className="absolute top-5 right-5 bg-[#C89A3D] text-white text-[10px] font-semibold px-3 py-1 rounded-full tracking-wide">
        {project.category}
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
        <h3 className="text-white text-xl font-bold mb-1">{project.title}</h3>
        <p className="text-white/70 text-sm leading-relaxed max-h-0 overflow-hidden group-hover:max-h-20 transition-all duration-500">
          {project.description}
        </p>

        {/* CTA */}
        <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
          <ExternalLink className="w-4 h-4 text-[#C89A3D]" />
          <span className="text-[#C89A3D] text-xs font-semibold">
            View Project
          </span>
        </div>
      </div>
    </div>
  );
};

const PortfolioSection = () => {
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
    <section className="py-24 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
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
              Our Work
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Projects We're <br />
                <span className="text-[#C89A3D]">Proud Of</span>
              </h1>
            </div>
            <div className="max-w-sm">
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                A curated collection of work that reflects our commitment to
                quality, innovation, and measurable impact.
              </p>
              <button className="inline-flex items-center gap-2 text-sm font-semibold text-[#C89A3D] hover:gap-3 transition-all duration-200">
                View All Projects <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-12 grid-rows-[320px_320px_320px] gap-5">
          {/* Row 1: Large left (col 1-7) + Small right (col 8-12) */}
          <ProjectCard
            project={projects[0]}
            index={0}
            className="col-span-12 md:col-span-7"
          />
          <ProjectCard
            project={projects[1]}
            index={1}
            className="col-span-12 md:col-span-5"
          />

          {/* Row 2: Small left (col 1-5) + Large right (col 6-12) */}
          <ProjectCard
            project={projects[2]}
            index={2}
            className="col-span-12 md:col-span-5"
          />
          <ProjectCard
            project={projects[3]}
            index={3}
            className="col-span-12 md:col-span-7"
          />

          {/* Row 3: Three equal */}
          <ProjectCard
            project={projects[4]}
            index={4}
            className="col-span-12 md:col-span-4"
          />
          <ProjectCard
            project={projects[5]}
            index={5}
            className="col-span-12 md:col-span-4"
          />

          {/* Stats / CTA tile */}
          <div
            className="col-span-12 md:col-span-4 rounded-3xl bg-[#C89A3D] p-8 flex flex-col justify-between"
            style={{
              opacity: 0,
              transform: "translateY(52px)",
              animation: "none",
            }}
            ref={(el) => {
              if (!el) return;
              const obs = new IntersectionObserver(
                ([entry]) => {
                  if (entry.isIntersecting) {
                    el.style.transition =
                      "opacity 0.75s cubic-bezier(0.4,0,0.2,1) 500ms, transform 0.75s cubic-bezier(0.4,0,0.2,1) 500ms";
                    el.style.opacity = "1";
                    el.style.transform = "translateY(0)";
                    obs.disconnect();
                  }
                },
                { threshold: 0.1 },
              );
              obs.observe(el);
            }}
          >
            <div>
              <p className="text-white/70 text-xs uppercase tracking-widest font-semibold mb-2">
                By the numbers
              </p>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {[
                  { value: "120+", label: "Projects" },
                  { value: "98%", label: "Satisfaction" },
                  { value: "6+", label: "Years" },
                  { value: "40+", label: "Team" },
                ].map((s) => (
                  <div key={s.label} className="bg-white/15 rounded-2xl p-3">
                    <p className="text-white text-2xl font-bold">{s.value}</p>
                    <p className="text-white/70 text-xs mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <button className="mt-6 w-full bg-white text-[#C89A3D] font-bold text-sm py-3 rounded-xl hover:bg-gray-100 transition flex items-center justify-center gap-2">
              Start a Project <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
