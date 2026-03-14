import { useEffect, useRef, useState } from "react";
import AdminHeader from "../components/AdminHeader";
import {
  Briefcase,
  Users,
  FileText,
  Clock,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  IndianRupee,
} from "lucide-react";
import { dashboardApi } from "../../api/dashboardApi";

// ─── Interfaces ───────────────────────────────────────────────────────────────

interface DashboardStats {
  totalBlogs: number;
  totalViews: number;
  totalProjects: number;
  totalAdmins: number;
}

interface RecentBlog {
  id: string; // the database ID
  title: string;
  status: string;
  createdAt: string;
  category?: string; // the API might not return this currently based on the select
}

interface RecentProject {
  id: string;
  title: string;
  category: string;
  createdAt: string;
  client?: string;
  status?: string;
}

// ─── Mini Bar Chart ───────────────────────────────────────────────────────────
const VisitorChart = () => {
  const [visitorData, setVisitorData] = useState<
    { month: string; year: number; visitors: number }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [totalGrowth, setTotalGrowth] = useState<string | null>(null);

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/visitors/monthly`,
        );
        const data = await res.json();
        if (data.success) {
          setVisitorData(data.data);
          // calculate growth % between last two months
          const len = data.data.length;
          if (len >= 2) {
            const prev = data.data[len - 2].visitors;
            const curr = data.data[len - 1].visitors;
            if (prev > 0) {
              const pct = (((curr - prev) / prev) * 100).toFixed(0);
              setTotalGrowth(`${Number(pct) >= 0 ? "+" : ""}${pct}%`);
            }
          }
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchVisitors();
  }, []);

  const maxVal = Math.max(...visitorData.map((d) => d.visitors), 1);
  const firstMonth = visitorData[0];
  const lastMonth = visitorData[visitorData.length - 1];
  const dateRange =
    visitorData.length > 0
      ? `${firstMonth.month} ${firstMonth.year} — ${lastMonth.month} ${lastMonth.year}`
      : "Loading...";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-px bg-[#C89A3D]" />
            <span className="text-[10px] uppercase tracking-widest text-[#C89A3D] font-semibold">
              Analytics
            </span>
          </div>
          <h3 className="text-lg font-bold text-gray-900">
            Visitors per Month
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">{dateRange}</p>
        </div>
        {totalGrowth && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-100 rounded-xl">
            <ArrowUpRight className="w-3.5 h-3.5 text-green-600" />
            <span className="text-xs font-semibold text-green-700">
              {totalGrowth} this month
            </span>
          </div>
        )}
      </div>

      {/* Bars */}
      {loading ? (
        <div className="flex items-center justify-center h-44">
          <div className="w-6 h-6 border-2 border-[#C89A3D] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="flex items-end gap-3" style={{ height: "176px" }}>
          {visitorData.map((d, i) => {
            const heightPct = (d.visitors / maxVal) * 100;
            const isLast = i === visitorData.length - 1;
            return (
              <div
                key={`${d.month}-${d.year}`}
                className="flex-1 flex flex-col items-center gap-2 group"
                style={{ height: "100%" }}
              >
                <div
                  className="flex flex-col items-center justify-end w-full"
                  style={{ height: "calc(100% - 20px)" }}
                >
                  <span className="text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity font-medium mb-1">
                    {d.visitors.toLocaleString()}
                  </span>
                  <div
                    className={`w-full rounded-t-lg transition-all duration-200 group-hover:opacity-90
                      ${isLast ? "bg-[#C89A3D]" : "bg-[#C89A3D]/20 group-hover:bg-[#C89A3D]/40"}`}
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
                <span className="text-[10px] text-gray-400 font-medium">
                  {d.month}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-xs text-gray-400">Total this period</span>
        </div>
        <span className="text-sm font-bold text-gray-800">
          {visitorData.reduce((a, b) => a + b.visitors, 0).toLocaleString()}{" "}
          visitors
        </span>
      </div>
    </div>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub: string;
  trend?: "up" | "down" | "neutral";
  trendVal?: string;
  gold?: boolean;
}

const StatCard = ({
  icon,
  label,
  value,
  sub,
  trend,
  trendVal,
  gold,
}: StatCardProps) => (
  <div
    className={`bg-white rounded-2xl border shadow-sm px-5 py-5 flex flex-col gap-3 hover:shadow-md transition-all duration-300 group
    ${gold ? "border-[#C89A3D]/20 hover:border-[#C89A3D]/40" : "border-gray-100 hover:border-gray-200"}
  `}
  >
    <div className="flex items-start justify-between">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center
        ${gold ? "bg-[#C89A3D]/10" : "bg-gray-50"}
      `}
      >
        <span className={gold ? "text-[#C89A3D]" : "text-gray-400"}>
          {icon}
        </span>
      </div>
      {trend && trendVal && (
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold
          ${trend === "up" ? "bg-green-50 text-green-600" : trend === "down" ? "bg-red-50 text-red-500" : "bg-gray-50 text-gray-500"}
        `}
        >
          {trend === "up" ? (
            <ArrowUpRight className="w-3 h-3" />
          ) : trend === "down" ? (
            <ArrowDownRight className="w-3 h-3" />
          ) : null}
          {trendVal}
        </div>
      )}
    </div>
    <div>
      <p
        className={`text-3xl font-extrabold leading-none group-hover:scale-105 transition-transform origin-left duration-300
        ${gold ? "text-[#C89A3D]" : "text-gray-900"}
      `}
      >
        {value}
      </p>
      <p className="text-sm font-semibold text-gray-700 mt-1">{label}</p>
      <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
    </div>
  </div>
);

// ─── Formatter ────────────────────────────────────────────────────────────────
const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateString));
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const Dashboard = () => {
  const [greeting, setGreeting] = useState("Good morning");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentBlogs, setRecentBlogs] = useState<RecentBlog[]>([]);
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const h = new Date().getHours();
    if (h >= 12 && h < 17) setGreeting("Good afternoon");
    else if (h >= 17) setGreeting("Good evening");
  }, []);

  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const response = await dashboardApi.getStats();
        if (response.data.success) {
          setStats(response.data.data.stats);
          setRecentBlogs(response.data.data.recentActivity.blogs);
          setRecentProjects(response.data.data.recentActivity.projects);
        } else {
          setError(response.data.message || "Failed to fetch dashboard data");
        }
      } catch (err: any) {
        console.error("Error fetching dashboard stats:", err);
        setError(
          err.response?.data?.message || err.message || "An error occurred",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (isLoading || !sectionRef.current) return;
    const children = Array.from(sectionRef.current.children) as HTMLElement[];
    children.forEach((el, i) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = `opacity 0.5s ease ${i * 80}ms, transform 0.5s ease ${i * 80}ms`;
      setTimeout(() => {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, 50);
    });
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col bg-gray-50 min-h-screen">
        <AdminHeader
          title="Dashboard"
          subtitle="Overview of your business at a glance"
        />
        <div className="flex-1 flex items-center justify-center">
          <span className="loading loading-spinner text-[#C89A3D] loading-lg"></span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col bg-gray-50 min-h-screen">
        <AdminHeader
          title="Dashboard"
          subtitle="Overview of your business at a glance"
        />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200">
            <h3 className="font-bold">Error loading dashboard</h3>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50 min-h-screen">
      <AdminHeader
        title="Dashboard"
        subtitle="Overview of your business at a glance"
      />

      <div
        ref={sectionRef}
        className="flex-1 p-6 space-y-6 max-w-[1400px] w-full mx-auto"
      >
        {/* ── Welcome Banner ── */}
        <div className="relative bg-white rounded-2xl border border-[#C89A3D]/20 shadow-sm px-7 py-6 overflow-hidden">
          {/* Gold accent line */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C89A3D] rounded-l-2xl" />
          {/* Subtle bg pattern */}
          <div
            className="absolute right-0 top-0 bottom-0 w-48 opacity-5"
            style={{
              background:
                "radial-gradient(circle at 100% 50%, #C89A3D 0%, transparent 70%)",
            }}
          />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#C89A3D] font-semibold uppercase tracking-widest mb-1">
                {greeting} 👋
              </p>
              <h2 className="text-2xl font-extrabold text-gray-900">
                Welcome back, <span className="text-[#C89A3D]">Admin</span>
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Here's what's happening with Dreamers Softtech today.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#C89A3D]/8 border border-[#C89A3D]/20 rounded-xl">
              <TrendingUp className="w-4 h-4 text-[#C89A3D]" />
              <span className="text-sm font-semibold text-[#C89A3D]">
                Business is growing
              </span>
            </div>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<IndianRupee className="w-5 h-5" />}
            label="Total Net Worth"
            value="₹75,000"
            sub="Overall business value"
            trend="up"
            trendVal="+18% this year"
            gold
          />
          <StatCard
            icon={<Briefcase className="w-5 h-5" />}
            label="Total Projects"
            value={stats?.totalProjects ?? 0}
            sub="All time delivered"
            trend="up"
            trendVal="+2 this year"
          />
          <StatCard
            icon={<Clock className="w-5 h-5" />}
            label="Total Blogs"
            value={stats?.totalBlogs ?? 0}
            sub="Currently published"
            trend="up"
            trendVal="+3 this month"
          />
          <StatCard
            icon={<Users className="w-5 h-5" />}
            label="Blog Views"
            value={stats?.totalViews ?? 0}
            sub="Total interactions"
            trend="up"
            trendVal="Active"
          />
        </div>

        {/* ── Chart + Quick Stats ── */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chart takes 2/3 */}
          <div className="lg:col-span-2">
            <VisitorChart />
          </div>

          {/* Quick info takes 1/3 */}
          <div className="flex flex-col gap-4">
            {/* Blog quick stats */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-5 h-px bg-[#C89A3D]" />
                <span className="text-[10px] uppercase tracking-widest text-[#C89A3D] font-semibold">
                  Blog
                </span>
              </div>
              <div className="space-y-3">
                {[
                  {
                    label: "Total Published",
                    value: stats?.totalBlogs ?? 0,
                    color: "text-green-600",
                  },
                  {
                    label: "Total Views",
                    value: stats?.totalViews ?? 0,
                    color: "text-[#C89A3D]",
                  },
                  {
                    label: "System Admins",
                    value: stats?.totalAdmins ?? 0,
                    color: "text-gray-900",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0"
                  >
                    <span className="text-sm text-gray-500">{item.label}</span>
                    <span className={`text-sm font-bold ${item.color}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
              <a
                href="/admin/blogs"
                className="mt-4 flex items-center gap-1.5 text-xs text-[#C89A3D] font-semibold hover:gap-2.5 transition-all duration-200"
              >
                Manage blogs <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>

            {/* Services quick info */}
            <div className="bg-[#C89A3D] rounded-2xl shadow-sm p-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-widest opacity-70 mb-1">
                Services
              </p>
              <p className="text-3xl font-extrabold leading-none mb-1">6+</p>
              <p className="text-sm opacity-80 font-medium">
                Active service offerings
              </p>
              <div className="mt-4 pt-3 border-t border-white/20">
                <p className="text-xs opacity-60">
                  Web Dev · UI/UX · Mobile · Cloud · AI · Consulting
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Recent Projects ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Section header */}
          <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-6 h-px bg-[#C89A3D]" />
                <span className="text-[10px] uppercase tracking-widest text-[#C89A3D] font-semibold">
                  Projects
                </span>
              </div>
              <h3 className="text-base font-bold text-gray-900">
                Recent Projects
              </h3>
            </div>
            <a
              href="/admin/portfolio"
              className="text-xs text-gray-400 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-xl font-medium hover:bg-gray-100 transition-colors"
            >
              View All
            </a>
          </div>

          {/* Table head */}
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr] md:grid-cols-[2fr_1fr_1fr_1fr_100px] gap-4 px-6 py-3 bg-gray-50/60 border-b border-gray-50">
            {["Project", "Client", "Category", "Completed", "Status"].map(
              (h, i) => (
                <span
                  key={h}
                  className={`text-[11px] font-semibold text-gray-400 uppercase tracking-wider ${i === 4 ? "hidden md:block" : ""}`}
                >
                  {h}
                </span>
              ),
            )}
          </div>

          {/* Rows */}
          {recentProjects.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-400 text-sm">
              No recent projects found.
            </div>
          ) : (
            recentProjects.map((project, idx) => (
              <div
                key={project.id}
                className={`grid grid-cols-[2fr_1fr_1fr_1fr] md:grid-cols-[2fr_1fr_1fr_1fr_100px] gap-4 px-6 py-4 items-center
                  hover:bg-gray-50/70 transition-colors duration-150
                  ${idx < recentProjects.length - 1 ? "border-b border-gray-50" : ""}
                `}
              >
                {/* Name */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-[#C89A3D]/10 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-3.5 h-3.5 text-[#C89A3D]" />
                  </div>
                  <span className="text-sm font-semibold text-gray-800 truncate">
                    {project.title}
                  </span>
                </div>

                {/* Client / Fallback */}
                <span className="text-sm text-gray-500 truncate">
                  {project.client || "Self-Hosted"}
                </span>

                {/* Category */}
                <span className="inline-block px-2.5 py-0.5 rounded-lg bg-[#C89A3D]/8 text-[#C89A3D] text-xs font-medium border border-[#C89A3D]/15 w-fit truncate">
                  {project.category}
                </span>

                {/* Date */}
                <span className="text-sm text-gray-400">
                  {formatDate(project.createdAt)}
                </span>

                {/* Status / Fallback */}
                <span
                  className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border w-fit
                  ${
                    project.status === "delivered" ||
                    project.status === "published" ||
                    !project.status
                      ? "bg-green-50 text-green-700 border-green-100"
                      : "bg-amber-50 text-amber-700 border-amber-100"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${project.status === "delivered" || project.status === "published" || !project.status ? "bg-green-500" : "bg-amber-400"}`}
                  />
                  {project.status === "delivered" ||
                  project.status === "published" ||
                  !project.status
                    ? "Delivered"
                    : "In Review"}
                </span>
              </div>
            ))
          )}
        </div>

        {/* ── Recent Blogs ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-6 h-px bg-[#C89A3D]" />
                <span className="text-[10px] uppercase tracking-widest text-[#C89A3D] font-semibold">
                  Content
                </span>
              </div>
              <h3 className="text-base font-bold text-gray-900">
                Recent Blog Posts
              </h3>
            </div>
            <a
              href="/admin/blogs"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#C89A3D] hover:bg-[#b78930] text-white text-xs font-semibold rounded-xl transition-all duration-200 shadow hover:shadow-[#C89A3D]/25"
            >
              <FileText className="w-3.5 h-3.5" />
              Manage All
            </a>
          </div>

          {recentBlogs.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-400 text-sm">
              No recent blogs found.
            </div>
          ) : (
            recentBlogs.map((blog, idx) => (
              <div
                key={blog.id}
                className={`flex items-center justify-between px-6 py-4 hover:bg-gray-50/70 transition-colors duration-150
                  ${idx < recentBlogs.length - 1 ? "border-b border-gray-50" : ""}
                `}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {blog.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {blog.category || "General"} ·{" "}
                      {formatDate(blog.createdAt)}
                    </p>
                  </div>
                </div>
                <span
                  className={`flex-shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border capitalize
                  ${
                    blog.status === "published"
                      ? "bg-green-50 text-green-700 border-green-100"
                      : "bg-amber-50 text-amber-700 border-amber-100"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${blog.status === "published" ? "bg-green-500" : "bg-amber-400"}`}
                  />
                  {blog.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
