import { useState } from "react";
import {
  Plus,
  Search,
  X,
  CheckCircle2,
  AlertCircle,
  Eye,
  Pencil,
  Trash2,
  ExternalLink,
} from "lucide-react";
import AdminHeader from "../components/AdminHeader";

// ─── Types ────────────────────────────────────────────────────────────────────
type ProjectStatus = "completed" | "ongoing";
type ModalMode = "create" | "edit" | "view" | null;

interface Project {
  id: string;
  title: string;
  client: string;
  image: string;
  liveUrl: string;
  status: ProjectStatus;
  createdAt: string;
}

// ─── Seed Data ────────────────────────────────────────────────────────────────
const SEED_PROJECTS: Project[] = [
  {
    id: "1",
    title: "Restaurant Billing System",
    client: "Spice Garden Pvt Ltd",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80",
    liveUrl: "https://spicegarden.in",
    status: "completed",
    createdAt: "2026-01-15",
  },
  {
    id: "2",
    title: "Inventory Management Dashboard",
    client: "FreshMart Retail",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&q=80",
    liveUrl: "https://freshmart.in/dashboard",
    status: "completed",
    createdAt: "2026-02-03",
  },
  {
    id: "3",
    title: "Corporate Portfolio Website",
    client: "Nexus Infra",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80",
    liveUrl: "https://nexusinfra.com",
    status: "completed",
    createdAt: "2026-02-20",
  },
  {
    id: "4",
    title: "Healthcare Patient Portal",
    client: "MedCare Clinic",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80",
    liveUrl: "",
    status: "ongoing",
    createdAt: "2026-03-01",
  },
];

const EMPTY_FORM: Omit<Project, "id" | "createdAt"> = {
  title: "",
  client: "",
  image: "",
  liveUrl: "",
  status: "ongoing",
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ─── Toast ────────────────────────────────────────────────────────────────────
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

// ─── Main Page ────────────────────────────────────────────────────────────────
const PortfolioAdmin = () => {
  const [projects, setProjects] = useState<Project[]>(SEED_PROJECTS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | ProjectStatus>(
    "all",
  );
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<typeof EMPTY_FORM>({
    ...EMPTY_FORM,
  });
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  // ── Derived ────────────────────────────────────────────────────────────────
  const filtered = projects.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch =
      p.title.toLowerCase().includes(q) || p.client.toLowerCase().includes(q);
    const matchStatus = filterStatus === "all" || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: projects.length,
    completed: projects.filter((p) => p.status === "completed").length,
    ongoing: projects.filter((p) => p.status === "ongoing").length,
  };

  // ── Helpers ────────────────────────────────────────────────────────────────
  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  function openCreate() {
    setFormData({ ...EMPTY_FORM });
    setModalMode("create");
  }

  function openEdit(project: Project) {
    setFormData({
      title: project.title,
      client: project.client,
      image: project.image,
      liveUrl: project.liveUrl,
      status: project.status,
    });
    setSelectedProject(project);
    setModalMode("edit");
  }

  function openView(project: Project) {
    setSelectedProject(project);
    setModalMode("view");
  }

  function closeModal() {
    setModalMode(null);
    setSelectedProject(null);
  }

  function handleSave() {
    if (!formData.title.trim()) {
      showToast("Project title is required", "error");
      return;
    }
    if (!formData.client.trim()) {
      showToast("Client name is required", "error");
      return;
    }
    const now = new Date().toISOString().split("T")[0];
    if (modalMode === "create") {
      const newProject: Project = {
        ...formData,
        id: Date.now().toString(),
        createdAt: now,
      };
      setProjects((p) => [newProject, ...p]);
      showToast("Project added successfully!");
    } else if (modalMode === "edit" && selectedProject) {
      setProjects((p) =>
        p.map((pr) =>
          pr.id === selectedProject.id ? { ...pr, ...formData } : pr,
        ),
      );
      showToast("Project updated successfully!");
    }
    closeModal();
  }

  function handleDelete(id: string) {
    setProjects((p) => p.filter((pr) => pr.id !== id));
    setDeleteConfirmId(null);
    showToast("Project deleted.");
  }

  function handleToggleStatus(project: Project) {
    const next: ProjectStatus =
      project.status === "completed" ? "ongoing" : "completed";
    setProjects((p) =>
      p.map((pr) => (pr.id === project.id ? { ...pr, status: next } : pr)),
    );
    showToast(`Marked as ${next}`);
  }

  // ── Shared styles ──────────────────────────────────────────────────────────
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
        {/* Stats */}
        <div className="flex gap-4 flex-wrap">
          {[
            { label: "Total Projects", value: stats.total, gold: false },
            { label: "Completed", value: stats.completed, gold: true },
            { label: "Ongoing", value: stats.ongoing, gold: false },
          ].map((s) => (
            <div
              key={s.label}
              className={`bg-white rounded-2xl border shadow-sm px-5 py-5 flex-1 min-w-[120px] hover:shadow-md transition-all duration-300 group
              ${s.gold ? "border-[#C89A3D]/20 hover:border-[#C89A3D]/40" : "border-gray-100 hover:border-gray-200"}
            `}
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

        {/* Toolbar */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects, clients..."
              className={`${inputCls} pl-9`}
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value as "all" | ProjectStatus)
            }
            className={`${inputCls} w-36`}
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="ongoing">Ongoing</option>
          </select>

          <span className="text-xs text-gray-400 hidden sm:block ml-auto">
            {filtered.length} project{filtered.length !== 1 ? "s" : ""}
          </span>

          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C89A3D] hover:bg-[#b78930] text-white font-semibold rounded-xl text-sm transition-all duration-200 shadow hover:shadow-lg hover:shadow-[#C89A3D]/25"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Head */}
          <div className="grid grid-cols-[2fr_1fr_100px_100px_110px] gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100">
            {["Project & Client", "Live URL", "Status", "Added", "Actions"].map(
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

          {/* Empty */}
          {filtered.length === 0 && (
            <div className="py-20 text-center text-sm text-gray-400">
              No projects found. Try adjusting your filters.
            </div>
          )}

          {/* Rows */}
          {filtered.map((project, idx) => (
            <div
              key={project.id}
              className={`grid grid-cols-[2fr_1fr_100px_100px_110px] gap-4 px-5 py-4 items-center
                hover:bg-gray-50/70 transition-colors duration-150
                ${idx < filtered.length - 1 ? "border-b border-gray-50" : ""}
              `}
            >
              {/* Project + Client */}
              <div className="flex items-center gap-3 min-w-0">
                {project.image ? (
                  <img
                    src={project.image}
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
                    {project.client}
                  </p>
                </div>
              </div>

              {/* Live URL */}
              <div>
                {project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-[#C89A3D] font-medium hover:underline truncate max-w-[120px]"
                  >
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">
                      {project.liveUrl.replace("https://", "")}
                    </span>
                  </a>
                ) : (
                  <span className="text-xs text-gray-300">—</span>
                )}
              </div>

              {/* Status */}
              <button
                onClick={() => handleToggleStatus(project)}
                title="Click to toggle status"
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border cursor-pointer transition-all duration-150 hover:shadow-sm w-fit
                  ${
                    project.status === "completed"
                      ? "bg-green-50 text-green-700 border-green-100"
                      : "bg-amber-50 text-amber-700 border-amber-100"
                  }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${project.status === "completed" ? "bg-green-500" : "bg-amber-400"}`}
                />
                <span className="capitalize">{project.status}</span>
              </button>

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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg">
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
            <div className="px-7 py-6 space-y-4">
              <div>
                <label className={labelCls}>Project Title *</label>
                <input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, title: e.target.value }))
                  }
                  placeholder="e.g. Restaurant Billing System"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Client Name *</label>
                <input
                  value={formData.client}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, client: e.target.value }))
                  }
                  placeholder="e.g. Spice Garden Pvt Ltd"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Project Image URL</label>
                <input
                  value={formData.image}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, image: e.target.value }))
                  }
                  placeholder="https://..."
                  className={inputCls}
                />
                {formData.image && (
                  <img
                    src={formData.image}
                    alt=""
                    className="mt-2 w-full h-32 object-cover rounded-xl border border-gray-100"
                  />
                )}
              </div>
              <div>
                <label className={labelCls}>Live URL</label>
                <input
                  value={formData.liveUrl}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, liveUrl: e.target.value }))
                  }
                  placeholder="https://..."
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((f) => ({
                      ...f,
                      status: e.target.value as ProjectStatus,
                    }))
                  }
                  className={inputCls}
                >
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
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
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#C89A3D] hover:bg-[#b78930] text-white font-semibold rounded-xl text-sm transition-all duration-200 shadow hover:shadow-[#C89A3D]/25"
              >
                {modalMode === "create" ? "Add Project" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── View Modal ── */}
      {modalMode === "view" && selectedProject && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
            {selectedProject.image && (
              <img
                src={selectedProject.image}
                alt=""
                className="w-full h-44 object-cover rounded-t-3xl"
              />
            )}
            <div className="p-7">
              <div className="flex items-start justify-between mb-4">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border capitalize
                  ${selectedProject.status === "completed" ? "bg-green-50 text-green-700 border-green-100" : "bg-amber-50 text-amber-700 border-amber-100"}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${selectedProject.status === "completed" ? "bg-green-500" : "bg-amber-400"}`}
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
                  {selectedProject.client}
                </span>
              </p>
              <p className="text-xs text-gray-300 mb-4">
                Added {formatDate(selectedProject.createdAt)}
              </p>

              {selectedProject.liveUrl && (
                <a
                  href={selectedProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-[#C89A3D]/40 hover:text-[#C89A3D] transition-all mb-5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  {selectedProject.liveUrl}
                </a>
              )}

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
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-all shadow hover:shadow-red-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
};

export default PortfolioAdmin;
