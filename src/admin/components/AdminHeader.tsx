import { Bell, Search, User } from "lucide-react";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

const AdminHeader = ({ title, subtitle }: AdminHeaderProps) => {
  return (
    <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
      {/* Left: Page title */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            className="pl-8 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#C89A3D]/50 focus:bg-white transition-all duration-200 w-48 placeholder:text-gray-400"
            placeholder="Quick search..."
          />
        </div>

        {/* Notification bell */}
        <button className="relative w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center hover:border-[#C89A3D]/30 hover:bg-[#C89A3D]/5 transition-all duration-200">
          <Bell className="w-4 h-4 text-gray-400" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#C89A3D] rounded-full" />
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-gray-100">
          <div className="w-8 h-8 rounded-full bg-[#C89A3D]/10 border border-[#C89A3D]/20 flex items-center justify-center">
            <User className="w-4 h-4 text-[#C89A3D]" />
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-gray-800 leading-none">
              Admin
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">Dreamers</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
