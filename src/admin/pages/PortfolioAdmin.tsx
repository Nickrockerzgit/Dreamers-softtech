// src/admin/pages/PortfolioAdmin.tsx

import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Search,
  X,
  CheckCircle2,
  AlertCircle,
  Eye,
  Pencil,
  Trash2,
  Upload,
  ImagePlus,
  XCircle,
} from "lucide-react";
import AdminHeader from "../components/AdminHeader";

const API = `${import.meta.env.VITE_API_URL}/api/portfolio`;

// ─── Types ────────────────────────────────────────────────────
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
  status: "draft" | "published";
  createdAt: string;
}

type ModalMode = "create" | "edit" | "view" | null;

interface FormState {
  title: string;
  category: string;
  overview: string;
  description: string;
  techStack: string; // comma-separated input
  clientName: string;
  clientInfo: string;
  keyFeatures: string; // newline-separated input
  status: "draft" | "published";
}

const EMPTY_FORM: FormState = {
  title: "",
  category: "",
  overview: "",
  description: "",
  techStack: "",
  clientName: "",
  clientInfo: "",
  keyFeatures: "",
  status: "draft",
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ─── Toast ────────────────────────────────────────────────────
function Toast({ msg, type }: { msg: string; type: "success" | "error" }) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-lg text-sm font-medium border
      ${type === "success" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-600 border-red-200"}`}
    >
      {type === "success" ? (
        <CheckCircle2 className="w-4 h-4 text-green-500" />
      ) : (
        <AlertCircle className="w-4 h-4 text-red-500" />
      )}
      {msg}
    </div>
  );
}

// ─── Image Upload Preview ─────────────────────────────────────
const ImagePreviewGrid = ({
  images,
  onRemove,
  label,
}: {
  images: string[];
  onRemove: (idx: number) => void;
  label: string;
}) =>
  images.length > 0 ? (
    <div className="mt-3">
      <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-2">
        {label}
      </p>
      <div className="grid grid-cols-3 gap-2">
        {images.map((src, idx) => (
          <div
            key={idx}
            className="relative group aspect-video rounded-xl overflow-hidden border border-gray-100"
          >
            <img src={src} alt="" className="w-full h-full object-cover" />
            <button
              onClick={() => onRemove(idx)}
              className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  ) : null;

// ─── Main Page ────────────────────────────────────────────────
const PortfolioAdmin = () => {
  const [projects, setProjects] = useState<DBProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "draft" | "published"
  >("all");
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedProject, setSelectedProject] = useState<DBProject | null>(
    null,
  );
  const [formData, setFormData] = useState<FormState>({ ...EMPTY_FORM });
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  // image file states
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroPreview, setHeroPreview] = useState<string>("");
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]); // existing gallery images (edit mode)

  const heroInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // ── Fetch ──────────────────────────────────────────────────
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch(API, { credentials: "include" });
      const data = await res.json();
      if (res.ok) setProjects(data.data);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // ── Derived ────────────────────────────────────────────────
  const filtered = projects.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch =
      p.title.toLowerCase().includes(q) ||
      p.clientName.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q);
    const matchStatus = filterStatus === "all" || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: projects.length,
    published: projects.filter((p) => p.status === "published").length,
    draft: projects.filter((p) => p.status === "draft").length,
  };

  // ── Helpers ────────────────────────────────────────────────
  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  function resetImageStates() {
    setHeroFile(null);
    setHeroPreview("");
    setGalleryFiles([]);
    setGalleryPreviews([]);
    setExistingImages([]);
  }

  function openCreate() {
    setFormData({ ...EMPTY_FORM });
    resetImageStates();
    setSelectedProject(null);
    setModalMode("create");
  }

  function openEdit(project: DBProject) {
    setFormData({
      title: project.title,
      category: project.category,
      overview: project.overview,
      description: project.description,
      techStack: project.techStack.join(", "),
      clientName: project.clientName,
      clientInfo: project.clientInfo,
      keyFeatures: project.keyFeatures.join("\n"),
      status: project.status,
    });
    resetImageStates();
    setHeroPreview(project.heroImage || "");
    setExistingImages(project.images || []);
    setSelectedProject(project);
    setModalMode("edit");
  }

  function openView(project: DBProject) {
    setSelectedProject(project);
    setModalMode("view");
  }

  function closeModal() {
    setModalMode(null);
    setSelectedProject(null);
    resetImageStates();
  }

  // ── Hero image pick ────────────────────────────────────────
  function handleHeroPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setHeroFile(file);
    setHeroPreview(URL.createObjectURL(file));
  }

  // ── Gallery images pick ────────────────────────────────────
  function handleGalleryPick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const newPreviews = files.map((f) => URL.createObjectURL(f));
    setGalleryFiles((prev) => [...prev, ...files]);
    setGalleryPreviews((prev) => [...prev, ...newPreviews]);
  }

  function removeNewGalleryImage(idx: number) {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== idx));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== idx));
  }

  function removeExistingImage(idx: number) {
    setExistingImages((prev) => prev.filter((_, i) => i !== idx));
  }

  // ── Save (create / edit) ───────────────────────────────────
  async function handleSave() {
    if (!formData.title.trim())
      return showToast("Project title is required", "error");
    if (!formData.category.trim())
      return showToast("Category is required", "error");
    if (!formData.overview.trim())
      return showToast("Overview is required", "error");
    if (!formData.clientName.trim())
      return showToast("Client name is required", "error");

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", formData.title.trim());
      fd.append("category", formData.category.trim());
      fd.append("overview", formData.overview.trim());
      fd.append("description", formData.description.trim());
      fd.append("clientName", formData.clientName.trim());
      fd.append("clientInfo", formData.clientInfo.trim());
      fd.append("status", formData.status);

      // techStack → JSON array
      const techArr = formData.techStack
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      fd.append("techStack", JSON.stringify(techArr));

      // keyFeatures → JSON array
      const featArr = formData.keyFeatures
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean);
      fd.append("keyFeatures", JSON.stringify(featArr));

      // hero image file
      if (heroFile) fd.append("heroImage", heroFile);

      // new gallery files
      galleryFiles.forEach((f) => fd.append("images", f));

      // in edit mode — send kept existing images so backend merges
      if (modalMode === "edit") {
        fd.append("existingImages", JSON.stringify(existingImages));
      }

      const url =
        modalMode === "create" ? API : `${API}/${selectedProject!.id}`;
      const method = modalMode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        body: fd,
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok) {
        showToast(data.message || "Failed to save", "error");
        return;
      }

      showToast(
        modalMode === "create" ? "Project created!" : "Project updated!",
      );
      closeModal();
      fetchProjects();
    } catch {
      showToast("Something went wrong", "error");
    } finally {
      setSaving(false);
    }
  }

  // ── Delete ─────────────────────────────────────────────────
  async function handleDelete(id: string) {
    setDeleting(true);
    try {
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        showToast("Failed to delete", "error");
        return;
      }
      showToast("Project deleted.");
      setDeleteConfirmId(null);
      fetchProjects();
    } catch {
      showToast("Something went wrong", "error");
    } finally {
      setDeleting(false);
    }
  }

  // ── Shared styles ──────────────────────────────────────────
  const inputCls =
    "w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#C89A3D]/60 focus:bg-white transition-all duration-200 placeholder:text-gray-400 text-gray-800";
  const labelCls =
    "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

  return (
    <div className="flex-1 flex flex-col bg-gray-50 min-h-screen">
      <AdminHeader
        title="Portfolio"
        subtitle="Manage all your projects from one place"
      />

      <div className="flex-1 p-6 space-y-6 max-w-[1400px] w-full mx-auto">
        {/* ── Stats ── */}
        <div className="flex gap-4 flex-wrap">
          {[
            { label: "Total Projects", value: stats.total, gold: false },
            { label: "Published", value: stats.published, gold: true },
            { label: "Drafts", value: stats.draft, gold: false },
          ].map((s) => (
            <div
              key={s.label}
              className={`bg-white rounded-2xl border shadow-sm px-5 py-5 flex-1 min-w-[120px] hover:shadow-md transition-all duration-300 group
                ${s.gold ? "border-[#C89A3D]/20 hover:border-[#C89A3D]/40" : "border-gray-100 hover:border-gray-200"}`}
            >
              <p
                className={`text-3xl font-extrabold leading-none group-hover:scale-105 transition-transform origin-left duration-300
                ${s.gold ? "text-[#C89A3D]" : "text-gray-800"}`}
              >
                {s.value}
              </p>
              <p className="text-xs text-gray-400 mt-2 font-medium">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* ── Toolbar ── */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title, client, category..."
              className={`${inputCls} pl-9`}
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className={`${inputCls} w-36`}
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          <span className="text-xs text-gray-400 hidden sm:block ml-auto">
            {filtered.length} project{filtered.length !== 1 ? "s" : ""}
          </span>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C89A3D] hover:bg-[#b78930] text-white font-semibold rounded-xl text-sm transition-all duration-200 shadow hover:shadow-lg hover:shadow-[#C89A3D]/25"
          >
            <Plus className="w-4 h-4" /> New Project
          </button>
        </div>

        {/* ── Table ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="grid grid-cols-[2fr_1.5fr_1fr_100px_110px] gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100">
            {["Project & Client", "Category", "Status", "Added", "Actions"].map(
              (h) => (
                <span
                  key={h}
                  className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider"
                >
                  {h}
                </span>
              ),
            )}
          </div>

          {loading && (
            <div className="flex items-center justify-center py-16">
              <div className="w-6 h-6 border-2 border-[#C89A3D] border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="py-20 text-center text-sm text-gray-400">
              No projects found. Try adjusting your filters or add a new
              project.
            </div>
          )}

          {!loading &&
            filtered.map((project, idx) => (
              <div
                key={project.id}
                className={`grid grid-cols-[2fr_1.5fr_1fr_100px_110px] gap-4 px-5 py-4 items-center hover:bg-gray-50/70 transition-colors duration-150
                ${idx < filtered.length - 1 ? "border-b border-gray-50" : ""}`}
              >
                {/* Project + Client */}
                <div className="flex items-center gap-3 min-w-0">
                  {project.heroImage ? (
                    <img
                      src={project.heroImage}
                      alt=""
                      className="w-10 h-10 rounded-xl object-cover flex-shrink-0 border border-gray-100"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-[#C89A3D]/10 flex-shrink-0 flex items-center justify-center">
                      <span className="text-[#C89A3D] text-xs font-bold">
                        {project.title[0]}
                      </span>
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {project.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">
                      {project.clientName}
                    </p>
                  </div>
                </div>

                {/* Category */}
                <span className="text-xs text-gray-500 font-medium truncate">
                  {project.category}
                </span>

                {/* Status */}
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border w-fit
                ${
                  project.status === "published"
                    ? "bg-green-50 text-green-700 border-green-100"
                    : "bg-gray-50 text-gray-500 border-gray-200"
                }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${project.status === "published" ? "bg-green-500" : "bg-gray-400"}`}
                  />
                  {project.status === "published" ? "Published" : "Draft"}
                </span>

                {/* Date */}
                <span className="text-xs text-gray-400">
                  {formatDate(project.createdAt)}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openView(project)}
                    title="View"
                    className="w-7 h-7 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:border-gray-200 transition-all duration-150"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => openEdit(project)}
                    title="Edit"
                    className="w-7 h-7 rounded-lg bg-[#C89A3D]/8 border border-[#C89A3D]/15 flex items-center justify-center text-[#C89A3D] hover:bg-[#C89A3D]/15 transition-all duration-150"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(project.id)}
                    title="Delete"
                    className="w-7 h-7 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-red-400 hover:bg-red-100 transition-all duration-150"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* ── Create / Edit Modal ── */}
      {(modalMode === "create" || modalMode === "edit") && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-start justify-center z-40 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-6">
            {/* Header */}
            <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-px bg-[#C89A3D]" />
                <h2 className="text-lg font-bold text-gray-900">
                  {modalMode === "create" ? "Add New Project" : "Edit Project"}
                </h2>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <div className="px-7 py-6 space-y-5">
              {/* Row: title + category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Project Title *</label>
                  <input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((f) => ({ ...f, title: e.target.value }))
                    }
                    placeholder="e.g. Workshop Booking Platform"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Category *</label>
                  <input
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((f) => ({ ...f, category: e.target.value }))
                    }
                    placeholder="e.g. Web Development"
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Overview */}
              <div>
                <label className={labelCls}>
                  Overview *{" "}
                  <span className="normal-case text-gray-300">
                    (shown on card)
                  </span>
                </label>
                <input
                  value={formData.overview}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, overview: e.target.value }))
                  }
                  placeholder="One-line summary of the project"
                  className={inputCls}
                />
              </div>

              {/* Description */}
              <div>
                <label className={labelCls}>
                  Full Description{" "}
                  <span className="normal-case text-gray-300">
                    (shown on detail page)
                  </span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, description: e.target.value }))
                  }
                  placeholder="Detailed write-up about the project, what it does, challenges solved, outcomes..."
                  rows={5}
                  className={`${inputCls} resize-none`}
                />
              </div>

              {/* Row: client name + client info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Client Name *</label>
                  <input
                    value={formData.clientName}
                    onChange={(e) =>
                      setFormData((f) => ({ ...f, clientName: e.target.value }))
                    }
                    placeholder="e.g. Akola Digital Solutions"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Client Info</label>
                  <input
                    value={formData.clientInfo}
                    onChange={(e) =>
                      setFormData((f) => ({ ...f, clientInfo: e.target.value }))
                    }
                    placeholder="Short info about the client"
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Tech Stack */}
              <div>
                <label className={labelCls}>
                  Tech Stack{" "}
                  <span className="normal-case text-gray-300">
                    (comma separated)
                  </span>
                </label>
                <input
                  value={formData.techStack}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, techStack: e.target.value }))
                  }
                  placeholder="React, Node.js, MongoDB, Tailwind CSS"
                  className={inputCls}
                />
                {formData.techStack && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.techStack
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean)
                      .map((t, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 bg-gray-900 text-white text-xs rounded-lg"
                        >
                          {t}
                        </span>
                      ))}
                  </div>
                )}
              </div>

              {/* Key Features */}
              <div>
                <label className={labelCls}>
                  Key Features{" "}
                  <span className="normal-case text-gray-300">
                    (one per line)
                  </span>
                </label>
                <textarea
                  value={formData.keyFeatures}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, keyFeatures: e.target.value }))
                  }
                  placeholder={
                    "Admin Dashboard with analytics\nWorkshop booking & management\nGoogle Calendar integration"
                  }
                  rows={4}
                  className={`${inputCls} resize-none`}
                />
              </div>

              {/* Hero Image Upload */}
              <div>
                <label className={labelCls}>
                  Hero Image{" "}
                  <span className="normal-case text-gray-300">
                    (main cover image)
                  </span>
                </label>
                <div
                  onClick={() => heroInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center gap-2 cursor-pointer hover:border-[#C89A3D]/40 hover:bg-[#C89A3D]/3 transition-all duration-200"
                >
                  <Upload className="w-5 h-5 text-gray-300" />
                  <p className="text-xs text-gray-400">
                    Click to upload hero image
                  </p>
                  <input
                    ref={heroInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleHeroPick}
                  />
                </div>
                {heroPreview && (
                  <div className="mt-3 relative group w-full">
                    <img
                      src={heroPreview}
                      alt="Hero preview"
                      className="w-full h-40 object-cover rounded-xl border border-gray-100"
                    />
                    <button
                      onClick={() => {
                        setHeroFile(null);
                        setHeroPreview("");
                      }}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Gallery Images Upload */}
              <div>
                <label className={labelCls}>
                  Gallery Images{" "}
                  <span className="normal-case text-gray-300">
                    (multiple allowed)
                  </span>
                </label>
                <div
                  onClick={() => galleryInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center gap-2 cursor-pointer hover:border-[#C89A3D]/40 hover:bg-[#C89A3D]/3 transition-all duration-200"
                >
                  <ImagePlus className="w-5 h-5 text-gray-300" />
                  <p className="text-xs text-gray-400">
                    Click to upload gallery images
                  </p>
                  <input
                    ref={galleryInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleGalleryPick}
                  />
                </div>

                {/* Existing images (edit mode) */}
                <ImagePreviewGrid
                  images={existingImages}
                  onRemove={removeExistingImage}
                  label="Existing images (click × to remove)"
                />

                {/* New images just picked */}
                <ImagePreviewGrid
                  images={galleryPreviews}
                  onRemove={removeNewGalleryImage}
                  label="New images to upload"
                />
              </div>

              {/* Status */}
              <div>
                <label className={labelCls}>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((f) => ({
                      ...f,
                      status: e.target.value as any,
                    }))
                  }
                  className={inputCls}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-7 py-5 border-t border-gray-100">
              <button
                onClick={closeModal}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#C89A3D] hover:bg-[#b78930] text-white font-semibold rounded-xl text-sm transition-all duration-200 shadow hover:shadow-[#C89A3D]/25 disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                    Saving...
                  </>
                ) : modalMode === "create" ? (
                  "Add Project"
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── View Modal ── */}
      {modalMode === "view" && selectedProject && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {selectedProject.heroImage && (
              <img
                src={selectedProject.heroImage}
                alt=""
                className="w-full h-48 object-cover rounded-t-3xl"
              />
            )}
            <div className="p-7">
              <div className="flex items-start justify-between mb-4">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border capitalize
                  ${selectedProject.status === "published" ? "bg-green-50 text-green-700 border-green-100" : "bg-gray-50 text-gray-500 border-gray-200"}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${selectedProject.status === "published" ? "bg-green-500" : "bg-gray-400"}`}
                  />
                  {selectedProject.status}
                </span>
                <button
                  onClick={closeModal}
                  className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-1">
                {selectedProject.title}
              </h2>
              <p className="text-sm text-gray-400 mb-1">
                Client:{" "}
                <span className="text-[#C89A3D] font-semibold">
                  {selectedProject.clientName}
                </span>
              </p>
              <p className="text-xs text-[#C89A3D] font-medium mb-3">
                {selectedProject.category}
              </p>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">
                {selectedProject.overview}
              </p>

              {/* Tech stack */}
              {selectedProject.techStack.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedProject.techStack.map((t, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-gray-900 text-white text-xs rounded-lg"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}

              {/* Key features */}
              {selectedProject.keyFeatures.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Key Features
                  </p>
                  <ul className="space-y-1">
                    {selectedProject.keyFeatures.map((f, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-gray-600"
                      >
                        <span className="text-[#C89A3D] mt-0.5">•</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="text-xs text-gray-300 mb-4">
                Added {formatDate(selectedProject.createdAt)}
              </p>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={closeModal}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50 transition-all"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    closeModal();
                    openEdit(selectedProject);
                  }}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#C89A3D] hover:bg-[#b78930] text-white font-semibold rounded-xl text-sm transition-all duration-200 shadow hover:shadow-[#C89A3D]/25"
                >
                  Edit Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-5">
              <Trash2 className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Delete this project?
            </h3>
            <p className="text-sm text-gray-400 mb-7">
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-all shadow hover:shadow-red-200 disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
};

export default PortfolioAdmin;
