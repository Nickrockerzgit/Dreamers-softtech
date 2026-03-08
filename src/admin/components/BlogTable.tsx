import { Eye, Pencil, Trash2 } from "lucide-react";
import type { BlogPost } from "../types/blog.types";

const statusStyles = {
  published: {
    dot: "bg-green-500",
    text: "text-green-700",
    bg: "bg-green-50",
    border: "border-green-100",
  },
  draft: {
    dot: "bg-amber-400",
    text: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-100",
  },
  archived: {
    dot: "bg-gray-400",
    text: "text-gray-600",
    bg: "bg-gray-50",
    border: "border-gray-200",
  },
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

interface BlogTableProps {
  posts: BlogPost[];
  onView: (post: BlogPost) => void;
  onEdit: (post: BlogPost) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (post: BlogPost) => void;
}

const BlogTable = ({
  posts,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}: BlogTableProps) => {
  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-20 text-center">
        <p className="text-gray-400 text-sm">
          No posts found. Try adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Table head */}
      <div className="grid grid-cols-[2fr_1fr_1fr_90px_90px_110px] gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100">
        {["Post", "Author", "Category", "Views", "Status", "Actions"].map(
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

      {/* Rows */}
      {posts.map((post, idx) => {
        const s = statusStyles[post.status];
        return (
          <div
            key={post.id}
            className={`grid grid-cols-[2fr_1fr_1fr_90px_90px_110px] gap-4 px-5 py-4 items-center
              hover:bg-gray-50/70 transition-colors duration-150
              ${idx < posts.length - 1 ? "border-b border-gray-50" : ""}
            `}
          >
            {/* Post */}
            <div className="flex items-center gap-3 min-w-0">
              {post.coverImage ? (
                <img
                  src={post.coverImage}
                  alt=""
                  className="w-10 h-10 rounded-xl object-cover flex-shrink-0 border border-gray-100"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-[#C89A3D]/10 flex-shrink-0 flex items-center justify-center">
                  <span className="text-[#C89A3D] text-xs font-bold">
                    {post.title[0]}
                  </span>
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {post.title}
                </p>
                <p className="text-xs text-gray-400 truncate mt-0.5">
                  {post.excerpt}
                </p>
                <p className="text-[10px] text-gray-300 mt-0.5">
                  Updated {formatDate(post.updatedAt)}
                </p>
              </div>
            </div>

            {/* Author */}
            <span className="text-sm text-gray-500 truncate">
              {post.author}
            </span>

            {/* Category */}
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-lg bg-[#C89A3D]/8 text-[#C89A3D] text-xs font-medium border border-[#C89A3D]/15">
                {post.category}
              </span>
            </div>

            {/* Views */}
            <span className="text-sm text-gray-400">
              {post.views.toLocaleString()}
            </span>

            {/* Status */}
            <button
              onClick={() => onToggleStatus(post)}
              title="Click to toggle status"
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border cursor-pointer transition-all duration-150 hover:shadow-sm ${s.bg} ${s.text} ${s.border}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
              <span className="capitalize">{post.status}</span>
            </button>

            {/* Actions */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onView(post)}
                title="View"
                className="w-7 h-7 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:border-gray-200 transition-all duration-150"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onEdit(post)}
                title="Edit"
                className="w-7 h-7 rounded-lg bg-[#C89A3D]/8 border border-[#C89A3D]/15 flex items-center justify-center text-[#C89A3D] hover:bg-[#C89A3D]/15 transition-all duration-150"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDelete(post.id)}
                title="Delete"
                className="w-7 h-7 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-red-400 hover:bg-red-100 transition-all duration-150"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BlogTable;
