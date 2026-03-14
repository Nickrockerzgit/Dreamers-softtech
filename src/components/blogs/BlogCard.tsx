import { useNavigate } from "react-router-dom";
import { ArrowRight, Clock, User } from "lucide-react";
import { DBBlog } from "./BlogsGrid";

interface Props {
  blog: DBBlog;
}

const BlogCard = ({ blog }: Props) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/blogs/${blog.slug}`)}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#C89A3D]/20 transition-all duration-400 flex flex-col cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-[#C89A3D]/5 flex items-center justify-center">
        {blog.coverImage ? (
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          // fallback when no cover image
          <div className="w-full h-full bg-gradient-to-br from-[#C89A3D]/10 to-[#C89A3D]/5 flex items-center justify-center">
            <span className="text-4xl font-extrabold text-[#C89A3D]/20 uppercase">
              {blog.category?.charAt(0)}
            </span>
          </div>
        )}
        {/* Category pill */}
        <span className="absolute top-3 left-3 bg-[#C89A3D] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
          {blog.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="text-base font-bold text-gray-900 leading-snug mb-2 group-hover:text-[#C89A3D] transition-colors duration-300 line-clamp-2">
          {blog.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 flex-grow">
          {blog.excerpt}
        </p>

        {/* Divider */}
        <div className="my-4 h-px bg-gray-100" />

        {/* Footer row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {blog.author}
            </span>
            {blog.readTime && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {blog.readTime}
              </span>
            )}
          </div>

          {/* Read more */}
          <span className="flex items-center gap-1 text-[#C89A3D] text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Read <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      {/* Bottom gold accent bar */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-[#C89A3D] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
};

export default BlogCard;
