import { useState, useMemo } from "react";
import { blogs } from "../../data/blogs";
import BlogCard from "./BlogCard";

const BlogsGrid = () => {
  const [search, setSearch] = useState("");

  // Sort blogs by date (latest first)
  const sortedBlogs = useMemo(() => {
    return [...blogs].sort(
      (a, b) => Number(new Date(b.date)) - Number(new Date(a.date)),
    );
  }, []);

  // Latest 3 blogs
  const latestBlogs = sortedBlogs.slice(0, 3);

  // Filter logic (search works on ALL blogs)
  const filteredBlogs = sortedBlogs.filter((blog) => {
    const query = search.toLowerCase();

    return (
      blog.title.toLowerCase().includes(query) ||
      blog.excerpt.toLowerCase().includes(query) ||
      blog.category.toLowerCase().includes(query) ||
      blog.author.toLowerCase().includes(query)
    );
  });

  return (
    <section className="pt-32 pb-20 bg-slate-50 min-h-screen text-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        {/* 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* LEFT SIDEBAR */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-semibold mb-6">Latest Blogs</h2>

            <div className="space-y-6">
              {latestBlogs.map((blog) => (
                <div
                  key={blog.id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer"
                >
                  {/* Image */}
                  <div className="h-28 overflow-hidden">
                    <img
                      src={blog.imageSmall}
                      alt={blog.title}
                      className="w-full h-full object-cover hover:scale-105 transition duration-500"
                    />
                  </div>

                  {/* Text Section */}
                  <div className="p-3">
                    <p className="text-sm font-medium text-slate-900 line-clamp-2">
                      {blog.excerpt.split(" ").slice(0, 3).join(" ")}...
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="lg:col-span-3">
            {/* Search Bar */}
            <div className="mb-10">
              <input
                type="text"
                placeholder="Search blogs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full max-w-xl px-5 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C89A3D]"
              />
            </div>

            {/* Grid */}
            {filteredBlogs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredBlogs.map((blog) => (
                  <BlogCard key={blog.id} blog={blog} />
                ))}
              </div>
            ) : (
              <div className="text-center text-slate-500">No blogs found.</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogsGrid;
