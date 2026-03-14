// src/admin/pages/AdminRequests.tsx

import { useEffect, useRef, useState } from "react";
import AdminHeader from "../components/AdminHeader";
import {
  UserCheck,
  UserX,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  RefreshCw,
  ShieldCheck,
  Trash2,
  Shield,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PendingAdmin {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface ApprovedAdmin {
  id: string;
  name: string;
  email: string;
  role: string;
  twoFactorEnabled: boolean;
  createdAt: string;
}

type ActionStatus = "idle" | "loading" | "approved" | "rejected";

// ─── Main Page ────────────────────────────────────────────────────────────────

const AdminRequests = () => {
  const [requests, setRequests] = useState<PendingAdmin[]>([]);
  const [admins, setAdmins] = useState<ApprovedAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminsLoading, setAdminsLoading] = useState(true);
  const [error, setError] = useState("");
  const [adminsError, setAdminsError] = useState("");
  const [actionMap, setActionMap] = useState<Record<string, ActionStatus>>({});
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    name: string;
    type: "approved" | "rejected" | "deleted";
  } | null>(null);

  const sectionRef = useRef<HTMLDivElement>(null);

  // ── Fetch pending requests ───────────────────────────────────
  const fetchRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/requests`,
        {
          credentials: "include",
        },
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to fetch requests");
        return;
      }
      setRequests(data.data);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Fetch approved admins ────────────────────────────────────
  const fetchAdmins = async () => {
    setAdminsLoading(true);
    setAdminsError("");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/admins`,
        {
          credentials: "include",
        },
      );
      const data = await res.json();
      if (!res.ok) {
        setAdminsError(data.message || "Failed to fetch admins");
        return;
      }
      setAdmins(data.data.filter((a: ApprovedAdmin) => a.role === "admin"));
    } catch {
      setAdminsError("Something went wrong.");
    } finally {
      setAdminsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchAdmins();
  }, []);

  // ── Animate on load ──────────────────────────────────────────
  useEffect(() => {
    if (!sectionRef.current || loading) return;
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
  }, [loading]);

  // ── Show notification ────────────────────────────────────────
  const showNotification = (
    name: string,
    type: "approved" | "rejected" | "deleted",
  ) => {
    setNotification({ name, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // ── Approve ──────────────────────────────────────────────────
  const handleApprove = async (id: string, name: string) => {
    setActionMap((prev) => ({ ...prev, [id]: "loading" }));
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/requests/${id}/approve`,
        {
          method: "PUT",
          credentials: "include",
        },
      );
      if (!res.ok) {
        setActionMap((prev) => ({ ...prev, [id]: "idle" }));
        return;
      }
      setActionMap((prev) => ({ ...prev, [id]: "approved" }));
      showNotification(name, "approved");
      setTimeout(() => {
        setRequests((prev) => prev.filter((r) => r.id !== id));
        setActionMap((prev) => {
          const copy = { ...prev };
          delete copy[id];
          return copy;
        });
        fetchAdmins(); // refresh approved list
      }, 1000);
    } catch {
      setActionMap((prev) => ({ ...prev, [id]: "idle" }));
    }
  };

  // ── Reject ───────────────────────────────────────────────────
  const handleReject = async (id: string, name: string) => {
    setActionMap((prev) => ({ ...prev, [id]: "loading" }));
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/requests/${id}/reject`,
        {
          method: "PUT",
          credentials: "include",
        },
      );
      if (!res.ok) {
        setActionMap((prev) => ({ ...prev, [id]: "idle" }));
        return;
      }
      setActionMap((prev) => ({ ...prev, [id]: "rejected" }));
      showNotification(name, "rejected");
      setTimeout(() => {
        setRequests((prev) => prev.filter((r) => r.id !== id));
        setActionMap((prev) => {
          const copy = { ...prev };
          delete copy[id];
          return copy;
        });
      }, 1000);
    } catch {
      setActionMap((prev) => ({ ...prev, [id]: "idle" }));
    }
  };

  // ── Delete admin ─────────────────────────────────────────────
  const handleDelete = async (id: string, name: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/admins/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        setDeletingId(null);
        return;
      }
      setAdmins((prev) => prev.filter((a) => a.id !== id));
      setDeleteConfirmId(null);
      showNotification(name, "deleted");
    } catch {
      // ignore
    } finally {
      setDeletingId(null);
    }
  };

  // ── Format date ──────────────────────────────────────────────
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="flex-1 flex flex-col bg-gray-50 min-h-screen">
      <AdminHeader
        title="Admin Requests"
        subtitle="Review and approve pending admin access requests"
      />

      {/* ── Toast Notification ── */}
      {notification && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-lg border transition-all duration-300
          ${
            notification.type === "approved"
              ? "bg-green-50 border-green-100 text-green-800"
              : notification.type === "rejected"
                ? "bg-red-50 border-red-100 text-red-800"
                : "bg-gray-50 border-gray-200 text-gray-800"
          }`}
        >
          {notification.type === "approved" && (
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          )}
          {notification.type === "rejected" && (
            <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          )}
          {notification.type === "deleted" && (
            <Trash2 className="w-5 h-5 text-gray-500 flex-shrink-0" />
          )}
          <div>
            <p className="text-sm font-semibold">
              {notification.type === "approved"
                ? "Admin Approved"
                : notification.type === "rejected"
                  ? "Request Rejected"
                  : "Admin Removed"}
            </p>
            <p className="text-xs opacity-70 mt-0.5">
              {notification.name} has been {notification.type}.
              {notification.type === "approved" && " Approval email sent."}
            </p>
          </div>
        </div>
      )}

      <div
        ref={sectionRef}
        className="flex-1 p-6 space-y-6 max-w-[1400px] w-full mx-auto"
      >
        {/* ── Banner ── */}
        <div className="relative bg-white rounded-2xl border border-[#C89A3D]/20 shadow-sm px-7 py-6 overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C89A3D] rounded-l-2xl" />
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
                Superadmin Only
              </p>
              <h2 className="text-2xl font-extrabold text-gray-900">
                Admin <span className="text-[#C89A3D]">Management</span>
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Approve requests and manage your admin team.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-100 rounded-xl">
                <Users className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-semibold text-amber-600">
                  {requests.length} pending
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-[#C89A3D]/8 border border-[#C89A3D]/20 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-[#C89A3D]" />
                <span className="text-sm font-semibold text-[#C89A3D]">
                  {admins.length} active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Pending Requests Table ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-6 h-px bg-[#C89A3D]" />
                <span className="text-[10px] uppercase tracking-widest text-[#C89A3D] font-semibold">
                  Requests
                </span>
              </div>
              <h3 className="text-base font-bold text-gray-900">
                Awaiting Approval
              </h3>
            </div>
            <button
              onClick={fetchRequests}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-100 text-gray-600 text-xs font-semibold rounded-xl transition-all duration-200"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-16">
              <div className="w-6 h-6 border-2 border-[#C89A3D] border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {!loading && error && (
            <div className="flex items-center justify-center py-16">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}
          {!loading && !error && requests.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-gray-300" />
              </div>
              <p className="text-sm font-semibold text-gray-400">
                No pending requests
              </p>
              <p className="text-xs text-gray-300">
                All admin requests have been reviewed
              </p>
            </div>
          )}
          {!loading && !error && requests.length > 0 && (
            <>
              <div className="grid grid-cols-[2fr_2fr_1fr_180px] gap-4 px-6 py-3 bg-gray-50/60 border-b border-gray-50">
                {["Name", "Email", "Requested On", "Actions"].map((h) => (
                  <span
                    key={h}
                    className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider"
                  >
                    {h}
                  </span>
                ))}
              </div>
              {requests.map((req, idx) => {
                const status = actionMap[req.id] || "idle";
                const isActed = status === "approved" || status === "rejected";
                return (
                  <div
                    key={req.id}
                    className={`grid grid-cols-[2fr_2fr_1fr_180px] gap-4 px-6 py-4 items-center transition-all duration-300
                      ${idx < requests.length - 1 ? "border-b border-gray-50" : ""}
                      ${isActed ? "opacity-40" : "hover:bg-gray-50/70"}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-[#C89A3D]/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-[#C89A3D] text-xs font-bold uppercase">
                          {req.name?.charAt(0) || "?"}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-gray-800 truncate">
                        {req.name}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500 truncate">
                      {req.email}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                      <span className="text-sm text-gray-400">
                        {formatDate(req.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {status === "idle" && (
                        <>
                          <button
                            onClick={() => handleApprove(req.id, req.name)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 hover:bg-green-100 border border-green-100 text-green-700 text-xs font-semibold rounded-xl transition-all duration-200"
                          >
                            <UserCheck className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button
                            onClick={() => handleReject(req.id, req.name)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 border border-red-100 text-red-600 text-xs font-semibold rounded-xl transition-all duration-200"
                          >
                            <UserX className="w-3.5 h-3.5" /> Reject
                          </button>
                        </>
                      )}
                      {status === "loading" && (
                        <div className="w-5 h-5 border-2 border-[#C89A3D] border-t-transparent rounded-full animate-spin" />
                      )}
                      {status === "approved" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-100 text-green-700 text-xs font-semibold rounded-xl">
                          <CheckCircle className="w-3.5 h-3.5" /> Approved
                        </span>
                      )}
                      {status === "rejected" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-100 text-red-600 text-xs font-semibold rounded-xl">
                          <XCircle className="w-3.5 h-3.5" /> Rejected
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* ── Active Admins Table ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-6 h-px bg-[#C89A3D]" />
                <span className="text-[10px] uppercase tracking-widest text-[#C89A3D] font-semibold">
                  Team
                </span>
              </div>
              <h3 className="text-base font-bold text-gray-900">
                Active Admins
              </h3>
            </div>
            <button
              onClick={fetchAdmins}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-100 text-gray-600 text-xs font-semibold rounded-xl transition-all duration-200"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>

          {adminsLoading && (
            <div className="flex items-center justify-center py-16">
              <div className="w-6 h-6 border-2 border-[#C89A3D] border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {!adminsLoading && adminsError && (
            <div className="flex items-center justify-center py-16">
              <p className="text-sm text-red-500">{adminsError}</p>
            </div>
          )}
          {!adminsLoading && !adminsError && admins.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-gray-300" />
              </div>
              <p className="text-sm font-semibold text-gray-400">
                No active admins yet
              </p>
              <p className="text-xs text-gray-300">
                Approved admins will appear here
              </p>
            </div>
          )}
          {!adminsLoading && !adminsError && admins.length > 0 && (
            <>
              <div className="grid grid-cols-[2fr_2fr_1fr_1fr_120px] gap-4 px-6 py-3 bg-gray-50/60 border-b border-gray-50">
                {["Name", "Email", "2FA", "Joined", "Action"].map((h) => (
                  <span
                    key={h}
                    className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider"
                  >
                    {h}
                  </span>
                ))}
              </div>
              {admins.map((admin, idx) => (
                <div
                  key={admin.id}
                  className={`grid grid-cols-[2fr_2fr_1fr_1fr_120px] gap-4 px-6 py-4 items-center hover:bg-gray-50/70 transition-colors duration-150
                    ${idx < admins.length - 1 ? "border-b border-gray-50" : ""}`}
                >
                  {/* Name */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-[#C89A3D]/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-[#C89A3D] text-xs font-bold uppercase">
                        {admin.name?.charAt(0) || "?"}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-800 truncate">
                      {admin.name}
                    </span>
                  </div>

                  {/* Email */}
                  <span className="text-sm text-gray-500 truncate">
                    {admin.email}
                  </span>

                  {/* 2FA */}
                  <div>
                    {admin.twoFactorEnabled ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 border border-green-100 text-green-700 text-xs font-semibold rounded-lg">
                        <ShieldCheck className="w-3 h-3" /> On
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 border border-gray-200 text-gray-400 text-xs font-semibold rounded-lg">
                        <Shield className="w-3 h-3" /> Off
                      </span>
                    )}
                  </div>

                  {/* Joined */}
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                    <span className="text-sm text-gray-400">
                      {formatDate(admin.createdAt)}
                    </span>
                  </div>

                  {/* Delete */}
                  <div>
                    {deleteConfirmId === admin.id ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDelete(admin.id, admin.name)}
                          disabled={deletingId === admin.id}
                          className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-xl transition-all disabled:opacity-60"
                        >
                          {deletingId === admin.id ? "..." : "Confirm"}
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-500 text-xs font-semibold rounded-xl hover:bg-gray-100 transition-all"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(admin.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 border border-red-100 text-red-500 text-xs font-semibold rounded-xl transition-all duration-200"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminRequests;
