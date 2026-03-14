// src/admin/pages/TestimonialsAdmin.tsx

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
  Star,
  Upload,
  Users,
} from "lucide-react";
import AdminHeader from "../components/AdminHeader";

const API = `${import.meta.env.VITE_API_URL}/api/testimonials`;

// ─── Types ────────────────────────────────────────────────────
interface DBTestimonial {
  id: string;
  name: string;
  company: string;
  role: string;
  avatar: string | null;
  color: string;
  avatarImage: string | null;
  rating: number;
  text: string;
  status: "published" | "draft";
  createdAt: string;
}

type ModalMode = "create" | "edit" | "view" | null;

interface FormState {
  name: string;
  company: string;
  role: string;
  avatar: string;
  color: string;
  rating: number;
  text: string;
  status: "published" | "draft";
}

const EMPTY_FORM: FormState = {
  name: "",
  company: "",
  role: "",
  avatar: "",
  color: "#C89A3D",
  rating: 5,
  text: "",
  status: "published",
};

const COLOR_PRESETS = [
  "#C89A3D",
  "#4F8EF7",
  "#2DBD8E",
  "#E45C7C",
  "#9B6FE4",
  "#F4922A",
  "#3ABDE0",
  "#E85D4A",
  "#6DBF67",
];

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

// ─── Star Rating Picker ───────────────────────────────────────
const StarPicker = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((s) => (
      <button key={s} type="button" onClick={() => onChange(s)}>
        <Star
          className={`w-5 h-5 transition-colors ${s <= value ? "fill-[#C89A3D] text-[#C89A3D]" : "text-gray-300"}`}
        />
      </button>
    ))}
  </div>
);

// ─── Main Page ────────────────────────────────────────────────
const TestimonialsAdmin = () => {
  const [testimonials, setTestimonials] = useState<DBTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "published" | "draft"
  >("all");
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selected, setSelected] = useState<DBTestimonial | null>(null);
  const [formData, setFormData] = useState<FormState>({ ...EMPTY_FORM });
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  // avatar image states
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // ── Fetch ──────────────────────────────────────────────────
  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await fetch(API, { credentials: "include" });
      const data = await res.json();
      if (res.ok) setTestimonials(data.data);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  // ── Derived ────────────────────────────────────────────────
  const filtered = testimonials.filter((t) => {
    const q = search.toLowerCase();
    const matchSearch =
      t.name.toLowerCase().includes(q) ||
      t.company.toLowerCase().includes(q) ||
      t.role.toLowerCase().includes(q);
    const matchStatus = filterStatus === "all" || t.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: testimonials.length,
    published: testimonials.filter((t) => t.status === "published").length,
    draft: testimonials.filter((t) => t.status === "draft").length,
  };

  // ── Helpers ────────────────────────────────────────────────
  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  function resetImageState() {
    setAvatarFile(null);
    setAvatarPreview("");
    setRemoveAvatar(false);
  }

  function openCreate() {
    setFormData({ ...EMPTY_FORM });
    resetImageState();
    setSelected(null);
    setModalMode("create");
  }

  function openEdit(t: DBTestimonial) {
    setFormData({
      name: t.name,
      company: t.company,
      role: t.role,
      avatar: t.avatar || "",
      color: t.color || "#C89A3D",
      rating: t.rating,
      text: t.text,
      status: t.status,
    });
    resetImageState();
    setAvatarPreview(t.avatarImage || "");
    setSelected(t);
    setModalMode("edit");
  }

  function openView(t: DBTestimonial) {
    setSelected(t);
    setModalMode("view");
  }

  function closeModal() {
    setModalMode(null);
    setSelected(null);
    resetImageState();
  }

  function handleAvatarPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setRemoveAvatar(false);
  }

  // ── Save ───────────────────────────────────────────────────
  async function handleSave() {
    if (!formData.name.trim()) return showToast("Name is required", "error");
    if (!formData.company.trim())
      return showToast("Company is required", "error");
    if (!formData.role.trim()) return showToast("Role is required", "error");
    if (!formData.text.trim())
      return showToast("Testimonial text is required", "error");

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", formData.name.trim());
      fd.append("company", formData.company.trim());
      fd.append("role", formData.role.trim());
      fd.append(
        "avatar",
        formData.avatar.trim() || formData.name.slice(0, 2).toUpperCase(),
      );
      fd.append("color", formData.color);
      fd.append("rating", String(formData.rating));
      fd.append("text", formData.text.trim());
      fd.append("status", formData.status);
      if (avatarFile) fd.append("avatarImage", avatarFile);
      if (removeAvatar) fd.append("removeAvatar", "true");

      const url = modalMode === "create" ? API : `${API}/${selected!.id}`;
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
        modalMode === "create"
          ? "Testimonial created!"
          : "Testimonial updated!",
      );
      closeModal();
      fetchTestimonials();
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
      showToast("Testimonial deleted.");
      setDeleteConfirmId(null);
      fetchTestimonials();
    } catch {
      showToast("Something went wrong", "error");
    } finally {
      setDeleting(false);
    }
  }

  const inputCls =
    "w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#C89A3D]/60 focus:bg-white transition-all duration-200 placeholder:text-gray-400 text-gray-800";
  const labelCls =
    "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

  return (
    <div className="flex-1 flex flex-col bg-gray-50 min-h-screen">
      <AdminHeader
        title="Testimonials"
        subtitle="Manage client testimonials shown on the website"
      />

      <div className="flex-1 p-6 space-y-6 max-w-[1400px] w-full mx-auto">
        {/* ── Stats ── */}
        <div className="flex gap-4 flex-wrap">
          {[
            { label: "Total", value: stats.total, gold: false },
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
              placeholder="Search name, company, role..."
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
            {filtered.length} testimonial{filtered.length !== 1 ? "s" : ""}
          </span>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C89A3D] hover:bg-[#b78930] text-white font-semibold rounded-xl text-sm transition-all duration-200 shadow hover:shadow-lg hover:shadow-[#C89A3D]/25"
          >
            <Plus className="w-4 h-4" /> New Testimonial
          </button>
        </div>

        {/* ── Table ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="grid grid-cols-[2fr_1.5fr_1fr_80px_100px_110px] gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100">
            {[
              "Person",
              "Company & Role",
              "Rating",
              "Status",
              "Added",
              "Actions",
            ].map((h) => (
              <span
                key={h}
                className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider"
              >
                {h}
              </span>
            ))}
          </div>

          {loading && (
            <div className="flex items-center justify-center py-16">
              <div className="w-6 h-6 border-2 border-[#C89A3D] border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="py-20 text-center">
              <Users className="w-8 h-8 text-gray-200 mx-auto mb-3" />
              <p className="text-sm text-gray-400">No testimonials found.</p>
            </div>
          )}

          {!loading &&
            filtered.map((t, idx) => (
              <div
                key={t.id}
                className={`grid grid-cols-[2fr_1.5fr_1fr_80px_100px_110px] gap-4 px-5 py-4 items-center hover:bg-gray-50/70 transition-colors duration-150
                ${idx < filtered.length - 1 ? "border-b border-gray-50" : ""}`}
              >
                {/* Person */}
                <div className="flex items-center gap-3 min-w-0">
                  {t.avatarImage ? (
                    <img
                      src={t.avatarImage}
                      alt={t.name}
                      className="w-9 h-9 rounded-full object-cover flex-shrink-0 border border-gray-100"
                    />
                  ) : (
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ backgroundColor: t.color }}
                    >
                      {t.avatar || t.name?.charAt(0)}
                    </div>
                  )}
                  <span className="text-sm font-semibold text-gray-800 truncate">
                    {t.name}
                  </span>
                </div>

                {/* Company + Role */}
                <div className="min-w-0">
                  <p className="text-sm text-gray-700 font-medium truncate">
                    {t.company}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{t.role}</p>
                </div>

                {/* Rating */}
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-3 h-3 fill-[#C89A3D] text-[#C89A3D]"
                    />
                  ))}
                </div>

                {/* Status */}
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border w-fit
                ${
                  t.status === "published"
                    ? "bg-green-50 text-green-700 border-green-100"
                    : "bg-gray-50 text-gray-500 border-gray-200"
                }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${t.status === "published" ? "bg-green-500" : "bg-gray-400"}`}
                  />
                  {t.status === "published" ? "Live" : "Draft"}
                </span>

                {/* Date */}
                <span className="text-xs text-gray-400">
                  {formatDate(t.createdAt)}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openView(t)}
                    title="View"
                    className="w-7 h-7 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:border-gray-200 transition-all duration-150"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => openEdit(t)}
                    title="Edit"
                    className="w-7 h-7 rounded-lg bg-[#C89A3D]/8 border border-[#C89A3D]/15 flex items-center justify-center text-[#C89A3D] hover:bg-[#C89A3D]/15 transition-all duration-150"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(t.id)}
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
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg my-6">
            {/* Header */}
            <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-px bg-[#C89A3D]" />
                <h2 className="text-lg font-bold text-gray-900">
                  {modalMode === "create"
                    ? "Add Testimonial"
                    : "Edit Testimonial"}
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
              {/* Avatar upload */}
              <div>
                <label className={labelCls}>
                  Avatar Image{" "}
                  <span className="normal-case text-gray-300">(optional)</span>
                </label>
                <div className="flex items-center gap-4">
                  {/* Preview */}
                  <div className="relative flex-shrink-0">
                    {avatarPreview && !removeAvatar ? (
                      <div className="relative group">
                        <img
                          src={avatarPreview}
                          alt="Avatar"
                          className="w-16 h-16 rounded-full object-cover border-2 border-[#C89A3D]/30"
                        />
                        <button
                          onClick={() => {
                            setRemoveAvatar(true);
                            setAvatarPreview("");
                            setAvatarFile(null);
                          }}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center text-white text-lg font-bold border-2 border-dashed border-gray-200"
                        style={{ backgroundColor: formData.color }}
                      >
                        {formData.avatar ||
                          formData.name?.slice(0, 2).toUpperCase() ||
                          "?"}
                      </div>
                    )}
                  </div>
                  {/* Upload button */}
                  <div>
                    <button
                      onClick={() => avatarInputRef.current?.click()}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:border-[#C89A3D]/40 hover:text-[#C89A3D] transition-all"
                    >
                      <Upload className="w-3.5 h-3.5" /> Upload Photo
                    </button>
                    <p className="text-[10px] text-gray-400 mt-1">
                      JPG, PNG or WebP. Max 5MB.
                    </p>
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarPick}
                    />
                  </div>
                </div>
              </div>

              {/* Name + Role */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Full Name *</label>
                  <input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((f) => ({ ...f, name: e.target.value }))
                    }
                    placeholder="e.g. Rohit Verma"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Role *</label>
                  <input
                    value={formData.role}
                    onChange={(e) =>
                      setFormData((f) => ({ ...f, role: e.target.value }))
                    }
                    placeholder="e.g. CEO"
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Company */}
              <div>
                <label className={labelCls}>Company *</label>
                <input
                  value={formData.company}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, company: e.target.value }))
                  }
                  placeholder="e.g. TechStart Solutions"
                  className={inputCls}
                />
              </div>

              {/* Initials + Color */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>
                    Initials{" "}
                    <span className="normal-case text-gray-300">
                      (fallback)
                    </span>
                  </label>
                  <input
                    value={formData.avatar}
                    onChange={(e) =>
                      setFormData((f) => ({
                        ...f,
                        avatar: e.target.value.toUpperCase().slice(0, 2),
                      }))
                    }
                    placeholder="e.g. RV"
                    maxLength={2}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Avatar Color</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {COLOR_PRESETS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setFormData((f) => ({ ...f, color: c }))}
                        className={`w-6 h-6 rounded-full border-2 transition-all ${formData.color === c ? "border-gray-800 scale-110" : "border-transparent"}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className={labelCls}>Rating</label>
                <StarPicker
                  value={formData.rating}
                  onChange={(v) => setFormData((f) => ({ ...f, rating: v }))}
                />
              </div>

              {/* Text */}
              <div>
                <label className={labelCls}>Testimonial Text *</label>
                <textarea
                  value={formData.text}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, text: e.target.value }))
                  }
                  placeholder="What did the client say about working with us?"
                  rows={4}
                  className={`${inputCls} resize-none`}
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
                  <option value="published">Published (visible on site)</option>
                  <option value="draft">Draft (hidden)</option>
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
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#C89A3D] hover:bg-[#b78930] text-white font-semibold rounded-xl text-sm transition-all duration-200 shadow disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                    Saving...
                  </>
                ) : modalMode === "create" ? (
                  "Add Testimonial"
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── View Modal ── */}
      {modalMode === "view" && selected && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-7">
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                {selected.avatarImage ? (
                  <img
                    src={selected.avatarImage}
                    alt={selected.name}
                    className="w-12 h-12 rounded-full object-cover border border-gray-100"
                  />
                ) : (
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: selected.color }}
                  >
                    {selected.avatar || selected.name?.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    {selected.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {selected.role}, {selected.company}
                  </p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Stars */}
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: selected.rating }).map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-[#C89A3D] text-[#C89A3D]"
                />
              ))}
            </div>

            {/* Text */}
            <p className="text-sm text-gray-600 leading-relaxed mb-5">
              "{selected.text}"
            </p>

            {/* Status + date */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border
                ${selected.status === "published" ? "bg-green-50 text-green-700 border-green-100" : "bg-gray-50 text-gray-500 border-gray-200"}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${selected.status === "published" ? "bg-green-500" : "bg-gray-400"}`}
                />
                {selected.status === "published" ? "Live" : "Draft"}
              </span>
              <span className="text-xs text-gray-400">
                Added {formatDate(selected.createdAt)}
              </span>
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={closeModal}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50 transition-all"
              >
                Close
              </button>
              <button
                onClick={() => {
                  closeModal();
                  openEdit(selected);
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#C89A3D] hover:bg-[#b78930] text-white font-semibold rounded-xl text-sm transition-all shadow"
              >
                Edit
              </button>
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
              Delete this testimonial?
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
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-all disabled:opacity-60"
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

export default TestimonialsAdmin;
