import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Settings,
  ChevronLeft,
  ChevronRight,
  Mail,
  Users,
  BarChart2,
  MessageSquareQuote,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { messageApi } from "../../api/messageApi";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/admin" },
  { icon: FileText, label: "Blogs", to: "/admin/blogs" },
  { icon: FileText, label: "Proposals", to: "/admin/proposals" },
  { icon: Briefcase, label: "Portfolio", to: "/admin/portfolio" },

  { icon: Mail, label: "Messages", to: "/admin/messages" },
  { icon: BarChart2, label: "Site Overview", to: "/admin/overview" },
  { icon: MessageSquareQuote, label: "Create Quote", to: "/admin/create-quote" },
  { icon: Settings, label: "Settings", to: "/admin/settings" },
  {
    icon: MessageSquareQuote,
    label: "Testimonials",
    to: "/admin/testimonials",
  },
  {
    icon: Users,
    label: "Admin Requests",
    to: "/admin/requests",
    superadminOnly: true,
  },
];

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  const { admin } = useAuth(); // ← ADD (import useAuth at top)

  // Fetch unread count on mount and when navigating
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await messageApi.getUnreadCount();
        if (res.data.success) {
          setUnreadCount(res.data.data.count);
        }
      } catch (err) {
        console.error("Failed to fetch unread count:", err);
      }
    };

    fetchUnreadCount();

    // Poll every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [location.pathname]);

  return (
    <aside
      className={`
        relative flex flex-col bg-white border-r border-gray-100
        shadow-sm transition-all duration-300 ease-in-out min-h-screen
        ${collapsed ? "w-16" : "w-56"}
      `}
    >
      {/* Logo */}
      <div
        className={`flex items-center gap-3 px-4 py-5 border-b border-gray-100 ${collapsed ? "justify-center" : ""}`}
      >
        <div className="w-8 h-8 rounded-xl bg-[#C89A3D] flex items-center justify-center flex-shrink-0">
          <span className="text-white font-extrabold text-sm">D</span>
        </div>
        {!collapsed && (
          <div>
            <p className="text-gray-900 font-bold text-sm leading-none">
              Dreamers
            </p>
            <p className="text-[#C89A3D] text-[10px] font-semibold uppercase tracking-widest mt-0.5">
              Admin
            </p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-0.5 px-2">
        {navItems
          .filter(
            (item) => !item.superadminOnly || admin?.role === "superadmin",
          )
          .map(({ icon: Icon, label, to }) => {
            const active = location.pathname === to;
            const isMessages = label === "Messages";

            return (
              <Link
                key={to}
                to={to}
                className={`
                relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-200 group
                ${
                  active
                    ? "bg-[#C89A3D]/10 text-[#C89A3D]"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                }
                ${collapsed ? "justify-center" : ""}
              `}
              >
                <div className="relative flex-shrink-0">
                  <Icon
                    className={`w-4 h-4 ${active ? "text-[#C89A3D]" : "text-gray-400 group-hover:text-gray-600"}`}
                  />
                  {isMessages && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#C89A3D] border border-white" />
                  )}
                </div>

                {!collapsed && (
                  <span className="flex-1 flex items-center justify-between">
                    {label}
                    {isMessages && unreadCount > 0 && (
                      <span className="text-[10px] font-bold bg-[#C89A3D] text-white px-1.5 py-0.5 rounded-md">
                        {unreadCount}
                      </span>
                    )}
                  </span>
                )}
              </Link>
            );
          })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-16 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200 text-gray-400 hover:text-[#C89A3D]"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </button>

      {/* Bottom branding */}
      {!collapsed && (
        <div className="px-4 py-4 border-t border-gray-100">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">
            Dreamers Softtech
          </p>
          <p className="text-[10px] text-gray-300 mt-0.5">v1.0.0</p>
        </div>
      )}
    </aside>
  );
};

export default AdminSidebar;
