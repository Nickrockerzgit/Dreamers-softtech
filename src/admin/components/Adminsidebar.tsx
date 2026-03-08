import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Settings,
  ChevronLeft,
  ChevronRight,
  Mail,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/admin" },
  { icon: FileText, label: "Blog Posts", to: "/admin/blogs" },
  { icon: Briefcase, label: "Portfolio", to: "/admin/portfolio" },
  { icon: Mail, label: "Messages", to: "/admin/messages" },
  { icon: Settings, label: "Settings", to: "/admin/settings" },
];

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

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
        {navItems.map(({ icon: Icon, label, to }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-200 group
                ${
                  active
                    ? "bg-[#C89A3D]/10 text-[#C89A3D]"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                }
                ${collapsed ? "justify-center" : ""}
              `}
            >
              <Icon
                className={`w-4 h-4 flex-shrink-0 ${active ? "text-[#C89A3D]" : "text-gray-400 group-hover:text-gray-600"}`}
              />
              {!collapsed && <span>{label}</span>}
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
