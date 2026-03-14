// src/components/portfolio/PortfolioSection.tsx

import { useEffect, useRef, useState } from "react";
import { ExternalLink, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

// ─── DB Portfolio type ────────────────────────────────────────
export interface DBProject {
  id: string;
  title: string;
  slug: string;
  category: string;
  overview: string;
  description: string;
  techStack: string[];
  clientName: string;
  clientInfo: string;
  keyFeatures: string[];
  heroImage: string | null;
  images: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Project Card ─────────────────────────────────────────────
const ProjectCard = ({
  project,
  index,
  className = "",
}: {
  project: DBProject;
  index: number;
  className?: string;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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
      onClick={() => navigate(`/portfolio/${project.slug}`)}
      className={`group relative overflow-hidden rounded-3xl cursor-pointer ${className}`}
      style={{
        opacity: 0,
        transform: "translateY(52px)",
        transition: `opacity 0.75s cubic-bezier(0.4,0,0.2,1) ${index * 100}ms, transform 0.75s cubic-bezier(0.4,0,0.2,1) ${index * 100}ms`,
      }}
    >
      {/* Image */}
      {project.heroImage ? (
        <img
          src={project.heroImage}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-[#C89A3D]/20 to-[#C89A3D]/5 flex items-center justify-center">
          <span className="text-6xl font-extrabold text-[#C89A3D]/20 uppercase">
            {project.title?.charAt(0)}
          </span>
        </div>
      )}

      {/* Base overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Category pill */}
      <div className="absolute top-5 right-5 bg-[#C89A3D] text-white text-[10px] font-semibold px-3 py-1 rounded-full tracking-wide">
        {project.category}
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
        <h3 className="text-white text-xl font-bold mb-1">{project.title}</h3>
        <p className="text-white/70 text-sm leading-relaxed max-h-0 overflow-hidden group-hover:max-h-20 transition-all duration-500">
          {project.overview}
        </p>
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

// ─── Skeleton Card ────────────────────────────────────────────
const SkeletonCard = ({ className }: { className?: string }) => (
  <div className={`rounded-3xl bg-gray-200 animate-pulse ${className}`} />
);

// ─── Main Section ─────────────────────────────────────────────
const PortfolioSection = () => {
  const [projects, setProjects] = useState<DBProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const headingRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // ── Fetch from backend ─────────────────────────────────────
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/portfolio`);
        const data = await res.json();
        if (!res.ok) {
          setError("Failed to load projects.");
          return;
        }
        // Backend now handles filtering for "published" projects for visitors
        setProjects(data.data);
      } catch {
        setError("Could not connect to server.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // ── Heading animation ──────────────────────────────────────
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
    <section id="portfolio-section" className="py-24 bg-gray-50 min-h-screen">
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

        {/* Error */}
        {error && (
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <p className="text-5xl mb-4">⚠️</p>
              <p className="text-gray-700 font-semibold">{error}</p>
            </div>
          </div>
        )}

        {/* Bento Grid */}
        {!error && (
          <div className="grid grid-cols-12 grid-rows-[320px_320px_320px] gap-5">
            {loading ? (
              // skeleton loading
              <>
                <SkeletonCard className="col-span-12 md:col-span-7" />
                <SkeletonCard className="col-span-12 md:col-span-5" />
                <SkeletonCard className="col-span-12 md:col-span-5" />
                <SkeletonCard className="col-span-12 md:col-span-7" />
                <SkeletonCard className="col-span-12 md:col-span-4" />
                <SkeletonCard className="col-span-12 md:col-span-4" />
                <div className="col-span-12 md:col-span-4 rounded-3xl bg-gray-200 animate-pulse" />
              </>
            ) : (
              <>
                {/* Row 1 */}
                {projects[0] && (
                  <ProjectCard
                    project={projects[0]}
                    index={0}
                    className="col-span-12 md:col-span-7"
                  />
                )}
                {projects[1] && (
                  <ProjectCard
                    project={projects[1]}
                    index={1}
                    className="col-span-12 md:col-span-5"
                  />
                )}

                {/* Row 2 */}
                {projects[2] && (
                  <ProjectCard
                    project={projects[2]}
                    index={2}
                    className="col-span-12 md:col-span-5"
                  />
                )}
                {projects[3] && (
                  <ProjectCard
                    project={projects[3]}
                    index={3}
                    className="col-span-12 md:col-span-7"
                  />
                )}

                {/* Row 3 */}
                {projects[4] && (
                  <ProjectCard
                    project={projects[4]}
                    index={4}
                    className="col-span-12 md:col-span-4"
                  />
                )}
                {projects[5] && (
                  <ProjectCard
                    project={projects[5]}
                    index={5}
                    className="col-span-12 md:col-span-4"
                  />
                )}

                {/* Stats tile — always shown */}
                <div
                  className="col-span-12 md:col-span-4 rounded-3xl bg-[#C89A3D] p-8 flex flex-col justify-between"
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
                  style={{ opacity: 0, transform: "translateY(52px)" }}
                >
                  <div>
                    <p className="text-white/70 text-xs uppercase tracking-widest font-semibold mb-2">
                      By the numbers
                    </p>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      {[
                        { value: `${projects.length}+`, label: "Projects" },
                        { value: "98%", label: "Satisfaction" },
                        { value: "1+", label: "Years" },
                        { value: "8+", label: "Team" },
                      ].map((s) => (
                        <div
                          key={s.label}
                          className="bg-white/15 rounded-2xl p-3"
                        >
                          <p className="text-white text-2xl font-bold">
                            {s.value}
                          </p>
                          <p className="text-white/70 text-xs mt-0.5">
                            {s.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => navigate("/contact")}
                    className="mt-6 w-full bg-white text-[#C89A3D] font-bold text-sm py-3 rounded-xl hover:bg-gray-100 transition flex items-center justify-center gap-2"
                  >
                    Start a Project <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default PortfolioSection;
