// src/pages/ProjectDetail.tsx

import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Code2,
  Users,
  Layers,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

interface DBProject {
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
}

const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<DBProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/portfolio/${slug}`);
        const data = await res.json();
        if (!res.ok || !data.data) {
          setError("Project not found.");
          return;
        }
        setProject(data.data);
      } catch {
        setError("Could not connect to server.");
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [slug]);

  // animate content in
  useEffect(() => {
    if (!project || !contentRef.current) return;
    const children = Array.from(contentRef.current.children) as HTMLElement[];
    children.forEach((el, i) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(24px)";
      el.style.transition = `opacity 0.6s ease ${i * 100}ms, transform 0.6s ease ${i * 100}ms`;
      setTimeout(() => {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, 80);
    });
  }, [project]);

  // lightbox keyboard nav
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (!project) return;
      if (e.key === "ArrowRight")
        setLightboxIndex((i) =>
          i !== null ? Math.min(i + 1, project.images.length - 1) : null,
        );
      if (e.key === "ArrowLeft")
        setLightboxIndex((i) => (i !== null ? Math.max(i - 1, 0) : null));
      if (e.key === "Escape") setLightboxIndex(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex, project]);

  // ── Loading ───────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#C89A3D] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400 font-medium">
            Loading project...
          </p>
        </div>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────
  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">🔍</p>
          <p className="text-gray-800 text-xl font-bold mb-2">
            Project Not Found
          </p>
          <p className="text-gray-400 text-sm mb-6">
            {error || "This project doesn't exist."}
          </p>
          <button
            onClick={() => navigate("/portfolio")}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C89A3D] text-white text-sm font-semibold rounded-xl hover:bg-[#b78930] transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Portfolio
          </button>
        </div>
      </div>
    );
  }

  const allImages = project.heroImage
    ? [project.heroImage, ...project.images]
    : project.images;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Hero Section ── */}
      <div
        ref={heroRef}
        className="relative h-[60vh] min-h-[420px] overflow-hidden"
      >
        {project.heroImage ? (
          <img
            src={project.heroImage}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-700" />
        )}

        {/* dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

        {/* back button */}
        {/* <button
          onClick={() => navigate("/portfolio")}
          className="absolute top-8 left-8 inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white text-sm font-semibold rounded-xl transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button> */}

        {/* Hero text */}
        <div className="absolute bottom-0 left-0 right-0 px-8 pb-12 max-w-7xl mx-auto">
          <span className="inline-block bg-[#C89A3D] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            {project.category}
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-3">
            {project.title}
          </h1>
          <p className="text-white/70 text-base max-w-2xl leading-relaxed">
            {project.overview}
          </p>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div ref={contentRef} className="space-y-12">
          {/* ── Overview + Client grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Description — 2/3 width */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <SectionLabel
                icon={<Layers className="w-4 h-4" />}
                label="Project Overview"
              />
              <p className="text-gray-600 text-sm leading-loose whitespace-pre-line mt-4">
                {project.description}
              </p>
            </div>

            {/* Client info — 1/3 width */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <SectionLabel
                icon={<Users className="w-4 h-4" />}
                label="Client"
              />
              <div className="mt-4">
                <div className="w-12 h-12 rounded-xl bg-[#C89A3D]/10 flex items-center justify-center mb-4">
                  <span className="text-[#C89A3D] text-xl font-extrabold uppercase">
                    {project.clientName?.charAt(0)}
                  </span>
                </div>
                <h3 className="text-gray-900 font-bold text-base mb-2">
                  {project.clientName}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {project.clientInfo}
                </p>
              </div>

              {/* Meta */}
              <div className="mt-6 pt-6 border-t border-gray-50 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400 font-medium">
                    Category
                  </span>
                  <span className="text-xs font-semibold text-gray-700 bg-gray-50 px-3 py-1 rounded-lg">
                    {project.category}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400 font-medium">
                    Published
                  </span>
                  <span className="text-xs font-semibold text-gray-700">
                    {new Date(project.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Key Features ── */}
          {project.keyFeatures.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <SectionLabel
                icon={<Layers className="w-4 h-4" />}
                label="Key Features"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {project.keyFeatures.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-[#C89A3D]/20 hover:bg-[#C89A3D]/5 transition-all duration-200"
                  >
                    <div className="w-6 h-6 rounded-lg bg-[#C89A3D]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#C89A3D] text-xs font-bold">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 font-medium leading-relaxed">
                      {feature}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Tech Stack ── */}
          {project.techStack.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <SectionLabel
                icon={<Code2 className="w-4 h-4" />}
                label="Tech Stack"
              />
              <div className="flex flex-wrap gap-3 mt-6">
                {project.techStack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-gray-900 text-white text-xs font-semibold rounded-xl tracking-wide hover:bg-[#C89A3D] transition-colors duration-200 cursor-default"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ── Image Gallery ── */}
          {allImages.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <SectionLabel
                icon={<Layers className="w-4 h-4" />}
                label="Project Gallery"
              />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                {allImages.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setLightboxIndex(idx)}
                    className="group relative aspect-video rounded-xl overflow-hidden cursor-zoom-in border border-gray-100 hover:border-[#C89A3D]/30 transition-all duration-300"
                  >
                    <img
                      src={img}
                      alt={`${project.title} screenshot ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                      <span className="text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/40 px-3 py-1 rounded-full">
                        View
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Lightbox ── */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Close */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-6 right-6 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Prev */}
          {lightboxIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((i) => i! - 1);
              }}
              className="absolute left-6 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Image */}
          <img
            src={allImages[lightboxIndex]}
            alt="Project screenshot"
            className="max-w-5xl max-h-[85vh] w-full object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next */}
          {lightboxIndex < allImages.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((i) => i! + 1);
              }}
              className="absolute right-6 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          {/* Counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-xs font-medium">
            {lightboxIndex + 1} / {allImages.length}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Section Label Helper ──────────────────────────────────────
const SectionLabel = ({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) => (
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 rounded-xl bg-[#C89A3D]/10 flex items-center justify-center text-[#C89A3D]">
      {icon}
    </div>
    <div>
      <div className="flex items-center gap-2">
        <div className="w-5 h-px bg-[#C89A3D]" />
        <span className="text-[10px] uppercase tracking-widest text-[#C89A3D] font-semibold">
          {label}
        </span>
      </div>
    </div>
  </div>
);

export default ProjectDetail;
