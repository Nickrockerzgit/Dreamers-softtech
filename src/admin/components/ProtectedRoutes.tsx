import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn, isLoading } = useAuth();

  // ── Still checking session ───────────────────────────────────
  // show spinner while getMe() is running on app load
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0c1117] flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Checking session...</span>
        </div>
      </div>
    );
  }

  // ── Not logged in → redirect to login ───────────────────────
  if (!isLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  // ── Logged in → show page ────────────────────────────────────
  return <>{children}</>;
};

export default ProtectedRoute;
