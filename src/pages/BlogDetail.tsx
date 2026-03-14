import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Calendar, Share2, Copy, Check } from "lucide-react";
import { DBBlog } from "../components/blogs/BlogsGrid";

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<DBBlog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/blogs/slug/${slug}`);
        const data = await res.json();
        if (!res.ok) {
          setError("Blog not found.");
          return;
        }
        setBlog(data.data);
      } catch {
        setError("Could not connect to server.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  // Add this useEffect right after your existing fetchBlog useEffect
  useEffect(() => {
    if (!blog) return;
    fetch(`${import.meta.env.VITE_API_URL}/api/blogs/slug/${blog.slug}/view`, {
      method: "PATCH",
    }).catch(() => {}); // silently fail, views are non-critical
  }, [blog?.slug]);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading)
    return (
      <section
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#f8f6f1" }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#C89A3D] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400 font-medium tracking-wide">
            Loading article...
          </p>
        </div>
      </section>
    );

  if (error || !blog)
    return (
      <section
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#f8f6f1" }}
      >
        <div className="text-center">
          <p className="text-6xl mb-5">⚠️</p>
          <p className="text-gray-800 font-bold text-lg mb-2">
            {error || "Blog not found."}
          </p>
          <p className="text-gray-400 text-sm mb-6">
            The article you're looking for doesn't exist or was removed.
          </p>
          <button
            onClick={() => navigate("blogs")}
            className="px-6 py-2.5 bg-[#C89A3D] text-white rounded-xl text-sm font-semibold hover:bg-[#b78930] transition-all"
          >
            Back to Blogs
          </button>
        </div>
      </section>
    );

  return (
    <>
      <style>{`
        .blog-content { color: #1a1a1a !important; }
        .blog-content *:not(pre):not(pre *):not(code) { color: inherit; }
        .blog-content h1 { font-size: 2rem !important; font-weight: 800 !important; color: #111111 !important; margin: 2.5rem 0 1rem !important; line-height: 1.2 !important; }
        .blog-content h2 { font-size: 1.45rem !important; font-weight: 700 !important; color: #111111 !important; margin: 2.5rem 0 0.9rem !important; padding-bottom: 0.5rem !important; border-bottom: 2px solid #C89A3D44 !important; line-height: 1.3 !important; }
        .blog-content h3 { font-size: 1.15rem !important; font-weight: 700 !important; color: #1a1a1a !important; margin: 2rem 0 0.7rem !important; }
        .blog-content h4, .blog-content h5, .blog-content h6 { font-weight: 700 !important; color: #1a1a1a !important; margin: 1.5rem 0 0.5rem !important; }
        .blog-content p { font-size: 1.0625rem !important; color: #1a1a1a !important; line-height: 1.9 !important; margin: 0 0 1.4rem !important; }
        .blog-content ul, .blog-content ol { margin: 0.5rem 0 1.5rem 1.2rem !important; }
        .blog-content li { font-size: 1rem !important; color: #1a1a1a !important; line-height: 1.8 !important; margin-bottom: 0.4rem !important; }
        .blog-content ul li { list-style: none !important; padding-left: 1.2rem !important; position: relative !important; }
        .blog-content ul li::before { content: '' !important; position: absolute !important; left: 0 !important; top: 0.75rem !important; width: 6px !important; height: 6px !important; background: #C89A3D !important; border-radius: 50% !important; }
        .blog-content ol li { list-style: decimal !important; }
        .blog-content pre { background: #1e1e1e !important; color: #e8e8e8 !important; border-radius: 12px !important; padding: 1.4rem 1.6rem !important; overflow-x: auto !important; margin: 1.8rem 0 !important; font-size: 0.875rem !important; line-height: 1.7 !important; border-left: 3px solid #C89A3D !important; }
        .blog-content pre * { color: #e8e8e8 !important; }
        .blog-content code { font-family: 'JetBrains Mono', 'Fira Code', monospace !important; font-size: 0.85em !important; background: #C89A3D18 !important; color: #b07a20 !important; padding: 0.15em 0.45em !important; border-radius: 5px !important; }
        .blog-content pre code { background: transparent !important; color: #e8e8e8 !important; padding: 0 !important; font-size: inherit !important; }
        .blog-content blockquote { border-left: 4px solid #C89A3D !important; margin: 2rem 0 !important; padding: 1rem 1.5rem !important; background: #C89A3D0a !important; border-radius: 0 12px 12px 0 !important; }
        .blog-content blockquote p { color: #444444 !important; font-style: italic !important; }
        .blog-content a { color: #C89A3D !important; text-decoration: underline !important; text-underline-offset: 3px !important; }
        .blog-content a:hover { color: #b07a20 !important; }
        .blog-content strong, .blog-content b { font-weight: 700 !important; color: #111111 !important; }
        .blog-content em, .blog-content i { color: #333333 !important; }
        .blog-content table { width: 100% !important; border-collapse: collapse !important; margin: 2rem 0 !important; font-size: 0.9rem !important; }
        .blog-content th { background: #C89A3D !important; color: #ffffff !important; font-weight: 600 !important; text-align: left !important; padding: 0.75rem 1rem !important; }
        .blog-content td { padding: 0.7rem 1rem !important; border-bottom: 1px solid #e5e5e5 !important; color: #1a1a1a !important; }
        .blog-content tr:nth-child(even) td { background: #fafafa !important; }
        .blog-content hr { border: none !important; border-top: 1px solid #e0dbd0 !important; margin: 2.5rem 0 !important; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.7s cubic-bezier(0.4,0,0.2,1) both; }
        .fade-up-1 { animation-delay: 0.05s; }
        .fade-up-2 { animation-delay: 0.13s; }
        .fade-up-3 { animation-delay: 0.22s; }
        .fade-up-4 { animation-delay: 0.32s; }
        .fade-up-5 { animation-delay: 0.42s; }
      `}</style>

      <div style={{ background: "#f8f6f1", minHeight: "100vh" }}>
        {/* ── HERO IMAGE ── */}
        <div className="relative h-[60vh] min-h-[420px] overflow-hidden">
          {blog.coverImage ? (
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-700" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

          <button
            onClick={() => navigate("/blogs")}
            className="absolute top-8 left-8 inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white text-sm font-semibold rounded-xl transition-all duration-200 z-10"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <button
            onClick={handleCopy}
            className="absolute top-8 right-8 inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white text-sm font-semibold rounded-xl transition-all duration-200 z-10"
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            {copied ? "Copied!" : "Copy link"}
          </button>

          <div className="absolute bottom-0 left-0 right-0 px-8 pb-12 max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-block bg-[#C89A3D] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                {blog.category}
              </span>
              {blog.readTime && (
                <span className="flex items-center gap-1.5 text-white/60 text-xs font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  {blog.readTime}
                </span>
              )}
            </div>

            <h1
              className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4"
              style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
            >
              {blog.title}
            </h1>

            {blog.excerpt && (
              <p className="text-white/70 text-base max-w-2xl leading-relaxed mb-5">
                {blog.excerpt}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#C89A3D] flex items-center justify-center text-white text-xs font-bold">
                  {blog.author?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">
                    {blog.author}
                  </p>
                  <p className="text-[10px] text-white/50">Author</p>
                </div>
              </div>
              <div className="w-px h-6 bg-white/20" />
              <div className="flex items-center gap-1.5 text-white/60 text-xs">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(blog.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── ARTICLE BODY + SIDEBAR ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* ── LEFT SIDEBAR ── */}
            <BlogDetailSidebar
              currentSlug={blog.slug}
              currentCategory={blog.category}
            />

            {/* ── VERTICAL DIVIDER ── */}
            <div className="hidden lg:flex justify-center">
              <div className="w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent" />
            </div>

            {/* ── ARTICLE CONTENT ── */}
            <div className="lg:col-span-8 pl-0 lg:pl-10 fade-up fade-up-1">
              {/* Accent accent line + share icon */}
              <div className="hidden lg:flex items-start gap-4 mb-8">
                <div className="flex flex-col items-center">
                  <div
                    className="w-px bg-gradient-to-b from-[#C89A3D] via-[#C89A3D]/20 to-transparent"
                    style={{ height: "80px" }}
                  />
                  <button
                    onClick={handleCopy}
                    title="Copy link"
                    className="mt-3 w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:text-[#C89A3D] hover:border-[#C89A3D]/40 transition-all"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div
                className="blog-content"
                style={{ color: "#1a1a1a" }}
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />

              {/* Bottom footer */}
              <div className="mt-16 pt-8 border-t border-gray-200">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#C89A3D] flex items-center justify-center text-white text-xs font-bold">
                      {blog.author?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        Written by {blog.author}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(blog.createdAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate("/blogs")}
                    className="flex items-center gap-2 text-sm font-semibold text-[#C89A3D] hover:text-[#b07a20] transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    More Articles
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ── Sidebar sub-component ──────────────────────────────────────

interface SidebarProps {
  currentSlug: string;
  currentCategory: string;
}

const BlogDetailSidebar = ({ currentSlug, currentCategory }: SidebarProps) => {
  const navigate = useNavigate();
  const [allBlogs, setAllBlogs] = useState<DBBlog[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/blogs`);
        const data = await res.json();
        if (res.ok) {
          const published = (data.data as DBBlog[]).filter(
            (b) => b.status === "published",
          );
          const sorted = published.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );
          setAllBlogs(sorted);
        }
      } catch {
        // silently fail — sidebar is non-critical
      }
    };
    fetchBlogs();
  }, []);

  // Exclude the current article from "latest" list
  const latestBlogs = allBlogs
    .filter((b) => b.slug !== currentSlug)
    .slice(0, 3);

  const categories = [...new Set(allBlogs.map((b) => b.category))];

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="lg:col-span-3 pr-0 lg:pr-6 mb-12 lg:mb-0">
      {/* ── Latest Posts ── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-5 h-px bg-[#C89A3D]" />
          <p className="text-[10px] uppercase tracking-widest text-[#C89A3D] font-semibold">
            Don't Miss
          </p>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Latest Posts</h2>
        <div className="w-8 h-0.5 bg-[#C89A3D] rounded-full mb-5" />

        <div className="space-y-4">
          {latestBlogs.length > 0 ? (
            latestBlogs.map((b, index) => (
              <div key={b.id}>
                <div
                  className="flex gap-3 group cursor-pointer"
                  onClick={() => navigate(`/blogs/${b.slug}`)}
                >
                  <div className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-[#C89A3D]/10 flex items-center justify-center">
                    {b.coverImage ? (
                      <img
                        src={b.coverImage}
                        alt={b.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    ) : (
                      <span className="text-[#C89A3D] text-xs font-bold uppercase">
                        {b.category?.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-xs font-semibold text-gray-800 leading-snug line-clamp-2 group-hover:text-[#C89A3D] transition-colors duration-200">
                      {b.excerpt.split(" ").slice(0, 7).join(" ")}...
                    </p>
                    <p className="mt-1 text-[10px] text-gray-400">
                      {formatDate(b.createdAt)}
                    </p>
                  </div>
                </div>
                {index < latestBlogs.length - 1 && (
                  <div className="mt-4 border-b border-dashed border-gray-200" />
                )}
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-400 italic">No other posts yet.</p>
          )}
        </div>
      </div>

      {/* ── Categories ── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-5 h-px bg-[#C89A3D]" />
          <p className="text-[10px] uppercase tracking-widest text-[#C89A3D] font-semibold">
            Browse
          </p>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Categories</h2>
        <div className="w-8 h-0.5 bg-[#C89A3D] rounded-full mb-5" />

        <div className="flex flex-col gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => navigate("/blogs", { state: { category: cat } })}
              className={`text-left text-xs px-3 py-2 rounded-lg border transition-all duration-200 font-medium
                ${
                  cat === currentCategory
                    ? "bg-[#C89A3D] text-white border-[#C89A3D]"
                    : "bg-white text-gray-600 border-gray-200 hover:border-[#C89A3D] hover:text-[#C89A3D]"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
