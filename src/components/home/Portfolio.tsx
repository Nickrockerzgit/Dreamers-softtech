// src/components/home/Portfolio.tsx

import { useEffect, useRef, useState } from "react";
import { ExternalLink, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePublicStats } from "../../hooks/usePublicStats";

// ─── DB type ──────────────────────────────────────────────────
interface DBProject {
  id: string;
  title: string;
  slug: string;
  category: string;
  overview: string;
  heroImage: string | null;
  status: string;
}

const Portfolio = () => {
  const { stats } = usePublicStats();
  const navigate = useNavigate();

  const [projects, setProjects] = useState<DBProject[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Fetch published projects ───────────────────────────────
  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/portfolio`);
        const data = await res.json();
        if (res.ok) {
          setProjects(
            data.data.filter((p: DBProject) => p.status === "published"),
          );
        }
      } catch {
        /* fail silently on home page */
      }
    };
    fetch_();
  }, []);

  // ── Auto slide ─────────────────────────────────────────────
  const startAutoSlide = () => {
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % Math.max(projects.length, 1));
    }, 2800);
  };

  const stopAutoSlide = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (projects.length === 0) return;
    startAutoSlide();
    return () => stopAutoSlide();
  }, [projects]);

  const handleDotClick = (idx: number) => {
    stopAutoSlide();
    setActiveIndex(idx);
    startAutoSlide();
  };

  // 3 visible slides at a time
  const visibleProjects =
    projects.length >= 3
      ? [
          projects[activeIndex % projects.length],
          projects[(activeIndex + 1) % projects.length],
          projects[(activeIndex + 2) % projects.length],
        ]
      : projects;

  return (
    <section id="portfolio" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Label */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-px bg-[#C89A3D]" />
          <span className="text-xs uppercase tracking-widest text-[#C89A3D] font-semibold">
            Our Work
          </span>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-stretch">
          {/* ── LEFT: Sliding Cards ── */}
          <div
            className="lg:w-[60%] relative"
            onMouseEnter={stopAutoSlide}
            onMouseLeave={startAutoSlide}
          >
            {/* Loading skeleton */}
            {projects.length === 0 && (
              <div className="grid grid-cols-3 gap-3 h-[480px]">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="rounded-2xl bg-gray-100 animate-pulse"
                  />
                ))}
              </div>
            )}

            {/* Cards */}
            {projects.length > 0 && (
              <>
                <div className="grid grid-cols-3 gap-3 h-[480px]">
                  {visibleProjects.map((project, i) => (
                    <div
                      key={`${project.id}-${activeIndex}-${i}`}
                      onClick={() => navigate(`/portfolio/${project.slug}`)}
                      className={`relative rounded-2xl overflow-hidden cursor-pointer group
                        transition-all duration-700 ease-in-out
                        ${i === 1 ? "scale-105 shadow-2xl z-10" : "scale-100 shadow-md opacity-80 hover:opacity-100"}`}
                      style={{
                        animation: `fadeSlideIn 0.6s ease ${i * 0.1}s both`,
                      }}
                    >
                      {/* Image */}
                      {project.heroImage ? (
                        <img
                          src={project.heroImage}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#C89A3D]/20 to-[#C89A3D]/5 flex items-center justify-center">
                          <span className="text-5xl font-extrabold text-[#C89A3D]/20 uppercase">
                            {project.title?.charAt(0)}
                          </span>
                        </div>
                      )}

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p className="text-[10px] text-[#C89A3D] font-semibold uppercase tracking-wider mb-1">
                          {project.category}
                        </p>
                        <h3 className="text-white font-bold text-sm leading-tight mb-2">
                          {project.title}
                        </h3>
                        <p className="text-white/70 text-[11px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2">
                          {project.overview}
                        </p>
                        <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="inline-flex items-center gap-1 text-[#C89A3D] text-[11px] font-semibold">
                            View Project <ExternalLink className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Dot Navigation */}
                <div className="flex items-center justify-center gap-2 mt-6">
                  {projects.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleDotClick(idx)}
                      className={`rounded-full transition-all duration-300 cursor-pointer
                        ${
                          activeIndex % projects.length === idx
                            ? "bg-[#C89A3D] w-6 h-2"
                            : "bg-gray-300 hover:bg-gray-400 w-2 h-2"
                        }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* ── DIVIDER ── */}
          <div className="hidden lg:flex justify-center">
            <div className="w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent" />
          </div>

          {/* ── RIGHT: Text Content ── */}
          <div className="lg:w-[38%] flex flex-col justify-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
              Work That
              <span className="block text-[#C89A3D]">Speaks For Itself</span>
            </h2>

            <p className="text-gray-500 text-base leading-relaxed mb-6">
              We've partnered with startups and enterprises alike to craft
              digital experiences that are fast, beautiful, and built to scale.
              Every project reflects our obsession with quality.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                {
                  value: `${stats.projectsCompleted}+`,
                  label: "Projects Delivered",
                },
                {
                  value: `${stats.satisfactionRate}%`,
                  label: "Client Satisfaction",
                },
                {
                  value: `${stats.yearsExperience}+`,
                  label: "Years Experience",
                },
                { value: `${stats.teamMembersCount}+`, label: "Team Members" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-gray-50 border border-gray-100 rounded-xl p-4"
                >
                  <p className="text-2xl font-bold text-[#C89A3D]">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={() => navigate("/portfolio")}
              className="self-start inline-flex items-center gap-2 bg-[#C89A3D] hover:bg-[#b78930] text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow hover:shadow-lg text-sm"
            >
              View All Projects
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default Portfolio;
