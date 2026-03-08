import { useState, useRef } from "react";
import { Plus, Search, X, CheckCircle2, AlertCircle } from "lucide-react";
import AdminHeader from "../components/AdminHeader";
import BlogTable from "../components/BlogTable";
import type { BlogPost, ModalMode, FilterStatus } from "../types/blog.types.ts";

// ─── Seed data (replace with API later) ──────────────────────────────────────
const SEED_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "Building Scalable React Applications in 2024",
    slug: "building-scalable-react-apps-2024",
    author: "Brijesh Patel",
    category: "Engineering",
    tags: ["React", "TypeScript", "Architecture"],
    status: "published",
    excerpt:
      "An in-depth guide on structuring large-scale React apps with TypeScript.",
    content: "",
    coverImage:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80",
    createdAt: "2024-11-15",
    updatedAt: "2024-11-20",
    views: 3420,
  },
  {
    id: "2",
    title: "Mastering Tailwind CSS: Advanced Patterns",
    slug: "mastering-tailwind-css-advanced",
    author: "Priya Sharma",
    category: "Design",
    tags: ["CSS", "Tailwind", "UI"],
    status: "published",
    excerpt:
      "Unlock the full potential of Tailwind CSS with component patterns.",
    content: "",
    coverImage:
      "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=400&q=80",
    createdAt: "2024-10-28",
    updatedAt: "2024-10-28",
    views: 2187,
  },
  {
    id: "3",
    title: "Node.js Microservices with Docker",
    slug: "nodejs-microservices-docker",
    author: "Rahul Verma",
    category: "DevOps",
    tags: ["Node.js", "Docker"],
    status: "draft",
    excerpt:
      "Step-by-step tutorial on containerised microservices using Docker Compose.",
    content: "",
    coverImage: "",
    createdAt: "2024-12-01",
    updatedAt: "2024-12-03",
    views: 0,
  },
  {
    id: "4",
    title: "The Future of AI in Software Development",
    slug: "ai-future-software-development",
    author: "Brijesh Patel",
    category: "AI & ML",
    tags: ["AI", "LLM"],
    status: "published",
    excerpt: "Exploring how LLMs are reshaping the developer workflow.",
    content: "",
    coverImage:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&q=80",
    createdAt: "2024-09-10",
    updatedAt: "2024-09-12",
    views: 5891,
  },
  {
    id: "5",
    title: "UX Writing: Words That Convert",
    slug: "ux-writing-words-convert",
    author: "Ananya Singh",
    category: "Design",
    tags: ["UX", "Copywriting"],
    status: "archived",
    excerpt:
      "How intentional micro-copy drives measurable product improvements.",
    content: "",
    coverImage: "",
    createdAt: "2024-07-05",
    updatedAt: "2024-08-01",
    views: 1543,
  },
];

const CATEGORIES = [
  "Engineering",
  "Design",
  "DevOps",
  "AI & ML",
  "Product",
  "Tutorial",
];

const EMPTY_FORM = {
  title: "",
  slug: "",
  author: "",
  category: CATEGORIES[0],
  tags: [] as string[],
  status: "draft" as BlogPost["status"],
  excerpt: "",
  content: "",
  coverImage: "",
};

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div
      className={`bg-white rounded-2xl border shadow-sm px-5 py-5 flex-1 min-w-[120px] hover:shadow-md transition-all duration-300 group
      ${accent ? "border-[#C89A3D]/20 hover:border-[#C89A3D]/40" : "border-gray-100 hover:border-gray-200"}
    `}
    >
      <p
        className={`text-3xl font-extrabold leading-none group-hover:scale-105 transition-transform origin-left duration-300
        ${accent ? "text-[#C89A3D]" : "text-gray-800"}
      `}
      >
        {value}
      </p>
      <p className="text-xs text-gray-400 mt-2 font-medium">{label}</p>
    </div>
  );
}

// ─── Tag Badge ────────────────────────────────────────────────────────────────
function TagBadge({ tag, onRemove }: { tag: string; onRemove?: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#C89A3D]/8 text-[#C89A3D] text-xs font-medium border border-[#C89A3D]/15">
      {tag}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-0.5 text-[#C89A3D]/60 hover:text-[#C89A3D] transition-colors"
        >
          <X className="w-2.5 h-2.5" />
        </button>
      )}
    </span>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ msg, type }: { msg: string; type: "success" | "error" }) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-lg text-sm font-medium border
      ${
        type === "success"
          ? "bg-green-50 text-green-700 border-green-200"
          : "bg-red-50 text-red-600 border-red-200"
      }`}
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
const BlogsAdmin = () => {
  const [posts, setPosts] = useState<BlogPost[]>(SEED_POSTS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({ ...EMPTY_FORM });
  const [tagInput, setTagInput] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);
  const tagRef = useRef<HTMLInputElement>(null);

  // ── Derived ──────────────────────────────────────────────────────────────
  const filtered = posts.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch =
      p.title.toLowerCase().includes(q) ||
      p.author.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q);
    const matchStatus = filterStatus === "all" || p.status === filterStatus;
    const matchCat = filterCategory === "all" || p.category === filterCategory;
    return matchSearch && matchStatus && matchCat;
  });

  const stats = {
    total: posts.length,
    published: posts.filter((p) => p.status === "published").length,
    draft: posts.filter((p) => p.status === "draft").length,
    totalViews: posts.reduce((acc, p) => acc + p.views, 0),
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  function openCreate() {
    setFormData({ ...EMPTY_FORM });
    setTagInput("");
    setModalMode("create");
  }

  function openEdit(post: BlogPost) {
    setFormData({
      title: post.title,
      slug: post.slug,
      author: post.author,
      category: post.category,
      tags: [...post.tags],
      status: post.status,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage,
    });
    setSelectedPost(post);
    setTagInput("");
    setModalMode("edit");
  }

  function openView(post: BlogPost) {
    setSelectedPost(post);
    setModalMode("view");
  }

  function closeModal() {
    setModalMode(null);
    setSelectedPost(null);
  }

  function handleSave() {
    if (!formData.title.trim()) {
      showToast("Title is required", "error");
      return;
    }
    const now = new Date().toISOString().split("T")[0];
    if (modalMode === "create") {
      const newPost: BlogPost = {
        ...formData,
        id: Date.now().toString(),
        slug: formData.slug || slugify(formData.title),
        createdAt: now,
        updatedAt: now,
        views: 0,
      };
      setPosts((p) => [newPost, ...p]);
      showToast("Post created successfully!");
    } else if (modalMode === "edit" && selectedPost) {
      setPosts((p) =>
        p.map((post) =>
          post.id === selectedPost.id
            ? {
                ...post,
                ...formData,
                slug: formData.slug || slugify(formData.title),
                updatedAt: now,
              }
            : post,
        ),
      );
      showToast("Post updated successfully!");
    }
    closeModal();
  }

  function handleDelete(id: string) {
    setPosts((p) => p.filter((post) => post.id !== id));
    setDeleteConfirmId(null);
    showToast("Post deleted.");
  }

  function handleToggleStatus(post: BlogPost) {
    const next: BlogPost["status"] =
      post.status === "published" ? "draft" : "published";
    setPosts((p) =>
      p.map((pr) => (pr.id === post.id ? { ...pr, status: next } : pr)),
    );
    showToast(`Marked as ${next}`);
  }

  function addTag() {
    const t = tagInput.trim();
    if (t && !formData.tags.includes(t))
      setFormData((f) => ({ ...f, tags: [...f.tags, t] }));
    setTagInput("");
    tagRef.current?.focus();
  }

  // ── Shared form field styles ──────────────────────────────────────────────
  const inputCls =
    "w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#C89A3D]/60 focus:bg-white transition-all duration-200 placeholder:text-gray-400 text-gray-800";
  const labelCls =
    "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

  return (
    <div className="flex-1 flex flex-col bg-gray-50 min-h-screen">
      <AdminHeader
        title="Blog Posts"
        subtitle="Manage all blog content from one place"
      />

      <div className="flex-1 p-6 space-y-6 max-w-[1400px] w-full mx-auto">
        {/* Stats */}
        <div className="flex gap-4 flex-wrap">
          <StatCard label="Total Posts" value={stats.total} />
          <StatCard label="Published" value={stats.published} accent />
          <StatCard label="Drafts" value={stats.draft} />
          <StatCard
            label="Total Views"
            value={stats.totalViews.toLocaleString()}
          />
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search posts, authors..."
              className={`${inputCls} pl-9`}
            />
          </div>

          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
            className={`${inputCls} w-36`}
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>

          {/* Category filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className={`${inputCls} w-40`}
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <span className="text-xs text-gray-400 hidden sm:block ml-auto">
            {filtered.length} post{filtered.length !== 1 ? "s" : ""}
          </span>

          {/* New post button — matches project CTA style */}
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C89A3D] hover:bg-[#b78930] text-white font-semibold rounded-xl text-sm transition-all duration-200 shadow hover:shadow-lg hover:shadow-[#C89A3D]/25 group"
          >
            <Plus className="w-4 h-4" />
            New Post
          </button>
        </div>

        {/* Table */}
        <BlogTable
          posts={filtered}
          onView={openView}
          onEdit={openEdit}
          onDelete={(id) => setDeleteConfirmId(id)}
          onToggleStatus={handleToggleStatus}
        />
      </div>

      {/* ── Create / Edit Modal ── */}
      {(modalMode === "create" || modalMode === "edit") && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-3xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-px bg-[#C89A3D]" />
                <h2 className="text-lg font-bold text-gray-900">
                  {modalMode === "create" ? "Create New Post" : "Edit Post"}
                </h2>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <div className="px-7 py-6 grid grid-cols-2 gap-5">
              {/* Title */}
              <div className="col-span-2">
                <label className={labelCls}>Title *</label>
                <input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((f) => ({
                      ...f,
                      title: e.target.value,
                      slug: slugify(e.target.value),
                    }))
                  }
                  placeholder="Enter post title..."
                  className={inputCls}
                />
              </div>

              {/* Slug */}
              <div className="col-span-2">
                <label className={labelCls}>Slug</label>
                <input
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, slug: e.target.value }))
                  }
                  placeholder="auto-generated-from-title"
                  className={inputCls}
                />
              </div>

              {/* Author */}
              <div>
                <label className={labelCls}>Author</label>
                <input
                  value={formData.author}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, author: e.target.value }))
                  }
                  placeholder="Author name"
                  className={inputCls}
                />
              </div>

              {/* Category */}
              <div>
                <label className={labelCls}>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, category: e.target.value }))
                  }
                  className={inputCls}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className={labelCls}>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((f) => ({
                      ...f,
                      status: e.target.value as BlogPost["status"],
                    }))
                  }
                  className={inputCls}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              {/* Cover Image */}
              <div>
                <label className={labelCls}>Cover Image URL</label>
                <input
                  value={formData.coverImage}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, coverImage: e.target.value }))
                  }
                  placeholder="https://..."
                  className={inputCls}
                />
              </div>

              {/* Tags */}
              <div className="col-span-2">
                <label className={labelCls}>Tags</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {formData.tags.map((t) => (
                    <TagBadge
                      key={t}
                      tag={t}
                      onRemove={() =>
                        setFormData((f) => ({
                          ...f,
                          tags: f.tags.filter((x) => x !== t),
                        }))
                      }
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    ref={tagRef}
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTag())
                    }
                    placeholder="Add tag and press Enter"
                    className={`${inputCls} flex-1`}
                  />
                  <button
                    onClick={addTag}
                    className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-500 hover:border-[#C89A3D]/40 hover:text-[#C89A3D] transition-all text-sm font-medium"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Excerpt */}
              <div className="col-span-2">
                <label className={labelCls}>Excerpt</label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, excerpt: e.target.value }))
                  }
                  rows={2}
                  placeholder="Short description shown in listings..."
                  className={`${inputCls} resize-none`}
                />
              </div>

              {/* Content */}
              <div className="col-span-2">
                <label className={labelCls}>Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, content: e.target.value }))
                  }
                  rows={6}
                  placeholder="Full post content..."
                  className={`${inputCls} resize-y`}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-7 py-5 border-t border-gray-100 sticky bottom-0 bg-white rounded-b-3xl">
              <button
                onClick={closeModal}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#C89A3D] hover:bg-[#b78930] text-white font-semibold rounded-xl text-sm transition-all duration-200 shadow hover:shadow-lg hover:shadow-[#C89A3D]/25"
              >
                {modalMode === "create" ? "Create Post" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── View Modal ── */}
      {modalMode === "view" && selectedPost && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[85vh] overflow-y-auto">
            {selectedPost.coverImage && (
              <img
                src={selectedPost.coverImage}
                alt=""
                className="w-full h-44 object-cover rounded-t-3xl"
              />
            )}
            <div className="p-7">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border capitalize
                    ${
                      selectedPost.status === "published"
                        ? "bg-green-50 text-green-700 border-green-100"
                        : selectedPost.status === "draft"
                          ? "bg-amber-50 text-amber-700 border-amber-100"
                          : "bg-gray-50 text-gray-600 border-gray-200"
                    }
                  `}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${selectedPost.status === "published" ? "bg-green-500" : selectedPost.status === "draft" ? "bg-amber-400" : "bg-gray-400"}`}
                    />
                    {selectedPost.status}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#C89A3D]/8 text-[#C89A3D] text-xs font-medium border border-[#C89A3D]/15">
                    {selectedPost.category}
                  </span>
                </div>
                <button
                  onClick={closeModal}
                  className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {selectedPost.title}
              </h2>
              <p className="text-xs text-gray-400 mb-1">
                By{" "}
                <span className="text-[#C89A3D] font-semibold">
                  {selectedPost.author}
                </span>
                {" · "}
                {formatDate(selectedPost.updatedAt)}
                {" · "}
                {selectedPost.views.toLocaleString()} views
              </p>
              <p className="text-xs text-gray-300 mb-4 font-mono">
                /{selectedPost.slug}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-5">
                {selectedPost.tags.map((t) => (
                  <TagBadge key={t} tag={t} />
                ))}
              </div>

              <p className="text-sm text-gray-500 leading-relaxed mb-4">
                {selectedPost.excerpt}
              </p>
              {selectedPost.content && (
                <p className="text-sm text-gray-400 leading-relaxed">
                  {selectedPost.content}
                </p>
              )}

              <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-gray-100">
                <button
                  onClick={closeModal}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50 transition-all"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    closeModal();
                    openEdit(selectedPost);
                  }}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#C89A3D] hover:bg-[#b78930] text-white font-semibold rounded-xl text-sm transition-all duration-200 shadow hover:shadow-[#C89A3D]/25"
                >
                  Edit Post
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
              <Trash2Icon className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Delete this post?
            </h3>
            <p className="text-sm text-gray-400 mb-7">
              This action cannot be undone. The post will be permanently
              removed.
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

// Inline icon (avoids extra import just for delete modal)
function Trash2Icon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"
      />
    </svg>
  );
}

export default BlogsAdmin;
