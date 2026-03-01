import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { blogs } from "../../data/blogs";
import BlogCard from "./BlogCard";

const BlogsGrid = () => {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 4;

  const sortedBlogs = useMemo(() => {
    return [...blogs].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, []);

  const latestBlogs = useMemo(() => sortedBlogs.slice(0, 3), [sortedBlogs]);

  const filteredBlogs = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return sortedBlogs;
    return sortedBlogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(query) ||
        blog.excerpt.toLowerCase().includes(query) ||
        blog.category.toLowerCase().includes(query) ||
        blog.author.toLowerCase().includes(query),
    );
  }, [search, sortedBlogs]);

  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  const paginatedBlogs = useMemo(() => {
    const startIndex = (currentPage - 1) * blogsPerPage;
    return filteredBlogs.slice(startIndex, startIndex + blogsPerPage);
  }, [currentPage, filteredBlogs]);

  const handleSearchSubmit = () => {
    setSearch(searchInput);
    setCurrentPage(1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearchSubmit();
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getPaginationPages = (): (number | "...")[] => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, "...", totalPages];
    if (currentPage >= totalPages - 2)
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", currentPage, "...", totalPages];
  };

  const categories = useMemo(() => {
    return [...new Set(blogs.map((b) => b.category))];
  }, []);

  const clearSearch = () => {
    setSearch("");
    setSearchInput("");
    setCurrentPage(1);
  };

  return (
    <section className="pt-32 pb-20 bg-gray-50 min-h-screen text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-0">
          {/* ───── LEFT SIDEBAR ───── */}
          <div className="lg:col-span-2 pr-6 mb-12 lg:mb-0">
            {/* Latest Posts */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-5 h-px bg-[#C89A3D]" />
                <p className="text-[10px] uppercase tracking-widest text-[#C89A3D] font-semibold">
                  Don't Miss
                </p>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                Latest Posts
              </h2>
              <div className="w-8 h-0.5 bg-[#C89A3D] rounded-full mb-5" />

              <div className="space-y-4">
                {latestBlogs.map((blog, index) => (
                  <div key={blog.id}>
                    <div className="flex gap-3 group cursor-pointer">
                      <div className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden">
                        <img
                          src={blog.imageSmall}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <p className="text-xs font-semibold text-gray-800 leading-snug line-clamp-2 group-hover:text-[#C89A3D] transition-colors duration-200">
                          {blog.excerpt.split(" ").slice(0, 7).join(" ")}...
                        </p>
                        <p className="mt-1 text-[10px] text-gray-400">
                          {new Date(blog.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    {index < latestBlogs.length - 1 && (
                      <div className="mt-4 border-b border-dashed border-gray-200" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-5 h-px bg-[#C89A3D]" />
                <p className="text-[10px] uppercase tracking-widest text-[#C89A3D] font-semibold">
                  Browse
                </p>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                Categories
              </h2>
              <div className="w-8 h-0.5 bg-[#C89A3D] rounded-full mb-5" />

              <div className="flex flex-col gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSearchInput(cat);
                      setSearch(cat);
                      setCurrentPage(1);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`text-left text-xs px-3 py-2 rounded-lg border transition-all duration-200 font-medium
                      ${
                        search === cat
                          ? "bg-[#C89A3D] text-white border-[#C89A3D]"
                          : "bg-white text-gray-600 border-gray-200 hover:border-[#C89A3D] hover:text-[#C89A3D]"
                      }`}
                  >
                    {cat}
                  </button>
                ))}
                {search && (
                  <button
                    onClick={clearSearch}
                    className="text-left text-xs px-3 py-2 rounded-lg border border-dashed border-gray-300 text-gray-400 hover:text-red-400 hover:border-red-300 transition-all duration-200 mt-1"
                  >
                    ✕ Clear filter
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ───── VERTICAL DIVIDER ───── */}
          <div className="hidden lg:flex justify-center">
            <div className="w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent" />
          </div>

          {/* ───── RIGHT SIDE ───── */}
          <div className="lg:col-span-7 pl-0 lg:pl-8">
            {/* Search Bar */}
            <div className="mb-8 flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by title, category, author..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-11 pr-5 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#C89A3D]/40 focus:border-[#C89A3D] text-gray-800 placeholder-gray-400 bg-white shadow-sm text-sm transition-all duration-200"
                />
              </div>
              <button
                onClick={handleSearchSubmit}
                className="px-6 py-3.5 bg-[#C89A3D] text-white font-semibold rounded-2xl hover:bg-[#b78930] transition-all duration-200 shadow text-sm flex-shrink-0"
              >
                Search
              </button>
            </div>

            {/* Results count */}
            {search && (
              <p className="text-sm text-gray-400 mb-6">
                Showing{" "}
                <span className="text-gray-700 font-semibold">
                  {filteredBlogs.length}
                </span>{" "}
                result{filteredBlogs.length !== 1 ? "s" : ""} for{" "}
                <span className="text-[#C89A3D] font-semibold">"{search}"</span>
              </p>
            )}

            {/* Blog Grid */}
            {paginatedBlogs.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {paginatedBlogs.map((blog) => (
                    <BlogCard key={blog.id} blog={blog} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-3 mt-12">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="w-10 h-10 rounded-lg border border-gray-300 bg-white text-gray-600 text-sm font-medium transition-all duration-200 hover:border-[#C89A3D] hover:text-[#C89A3D] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      «
                    </button>

                    {getPaginationPages().map((page, idx) =>
                      page === "..." ? (
                        <span
                          key={`ellipsis-${idx}`}
                          className="w-10 text-center text-gray-400 select-none"
                        >
                          ...
                        </span>
                      ) : (
                        <button
                          key={`page-${page}`}
                          onClick={() => handlePageChange(page)}
                          className={`w-10 h-10 rounded-lg border text-sm font-medium transition-all duration-200 cursor-pointer
                            ${
                              currentPage === page
                                ? "bg-[#C89A3D] text-white border-[#C89A3D] shadow-md"
                                : "bg-white text-gray-600 border-gray-300 hover:border-[#C89A3D] hover:text-[#C89A3D]"
                            }`}
                        >
                          {page}
                        </button>
                      ),
                    )}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="w-10 h-10 rounded-lg border border-gray-300 bg-white text-gray-600 text-sm font-medium transition-all duration-200 hover:border-[#C89A3D] hover:text-[#C89A3D] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      »
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <p className="text-5xl mb-4">🔍</p>
                <p className="text-gray-700 text-base font-semibold">
                  No blogs found
                </p>
                <p className="text-gray-400 text-sm mt-1 mb-5">
                  Try a different keyword or clear the filter
                </p>
                <button
                  onClick={clearSearch}
                  className="px-5 py-2 border border-[#C89A3D] text-[#C89A3D] rounded-full text-sm font-semibold hover:bg-[#C89A3D] hover:text-white transition-all duration-200"
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogsGrid;
