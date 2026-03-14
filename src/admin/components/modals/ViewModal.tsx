import { X } from "lucide-react";
import type { BlogPost } from "../../types/blog.types";
import TagBadge from "../TagBadge";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

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

interface Props {
  post: BlogPost;
  onClose: () => void;
  onEdit: (post: BlogPost) => void;
}

const ViewModal = ({ post, onClose, onEdit }: Props) => {
  const s = statusStyles[post.status];
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[999] p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[85vh] overflow-y-auto">
        {post.coverImage && (
          <img
            src={post.coverImage}
            alt=""
            className="w-full h-44 object-cover rounded-t-3xl"
          />
        )}
        <div className="p-7">
          {/* Header row */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border capitalize ${s.bg} ${s.text} ${s.border}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                {post.status}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#C89A3D]/8 text-[#C89A3D] text-xs font-medium border border-[#C89A3D]/15">
                {post.category}
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h2>
          <p className="text-xs text-gray-400 mb-1">
            By{" "}
            <span className="text-[#C89A3D] font-semibold">{post.author}</span>
            {" · "}
            {formatDate(post.updatedAt)}
            {" · "}
            {post.views.toLocaleString()} views
          </p>
          <p className="text-xs text-gray-300 mb-4 font-mono">/{post.slug}</p>

          <div className="flex flex-wrap gap-1.5 mb-5">
            {(post.tags || []).map((t) => (
              <TagBadge key={t} tag={t} />
            ))}
          </div>

          <p className="text-sm text-gray-500 leading-relaxed mb-4">
            {post.excerpt}
          </p>

          {post.content && (
            <div
              className="text-sm text-gray-600 leading-relaxed prose max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          )}

          <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-gray-100">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50 transition-all"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onEdit(post);
              }}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#C89A3D] hover:bg-[#b78930] text-white font-semibold rounded-xl text-sm transition-all shadow hover:shadow-[#C89A3D]/25"
            >
              Edit Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;
