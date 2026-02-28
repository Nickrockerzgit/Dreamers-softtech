import { Blog } from "../../data/blogs";

interface Props {
  blog: Blog;
}

const BlogCard = ({ blog }: Props) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300">
      <img
        src={blog.image}
        alt={blog.title}
        className="w-full h-[210px] object-cover"
      />

      <div className="p-6">
        <span className="text-xs text-[#C89A3D] font-semibold">
          {blog.category}
        </span>

        <h3 className="text-lg font-bold mt-2">{blog.title}</h3>

        <p className="text-sm text-slate-600 mt-2">{blog.excerpt}</p>

        <div className="mt-4 text-xs text-slate-500">
          {blog.author} • {blog.readTime}
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
