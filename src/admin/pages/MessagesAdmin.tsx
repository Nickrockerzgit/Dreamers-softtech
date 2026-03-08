import { useState } from "react";
import AdminHeader from "../components/AdminHeader";
import {
  Search,
  Trash2,
  Mail,
  MailOpen,
  Phone,
  Clock,
  CheckCircle2,
  X,
  ChevronRight,
  Inbox,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type MessageStatus = "unread" | "read";
type FilterType = "all" | "unread" | "read";

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  receivedAt: string;
  status: MessageStatus;
}

// ─── Seed Data ────────────────────────────────────────────────────────────────
const SEED_MESSAGES: Message[] = [
  {
    id: "1",
    name: "Ravi Mehta",
    email: "ravi.mehta@gmail.com",
    phone: "+91 98765 43210",
    subject: "Need a custom billing software",
    message:
      "Hi, I run a restaurant chain with 3 outlets and we're looking for a custom billing and inventory management system. Could you share your pricing and timeline? We need it to be integrated with our existing POS hardware.",
    receivedAt: "2026-03-08T09:15:00",
    status: "unread",
  },
  {
    id: "2",
    name: "Sneha Joshi",
    email: "sneha.joshi@nexuscorp.in",
    phone: "+91 91234 56789",
    subject: "Website redesign for our company",
    message:
      "Hello, we are Nexus Corp and we're looking to redesign our corporate website. We want a modern look with animations and a CMS for blog management. Please let us know your availability.",
    receivedAt: "2026-03-07T14:30:00",
    status: "unread",
  },
  {
    id: "3",
    name: "Arjun Patel",
    email: "arjun@medcareclinic.com",
    phone: "+91 87654 32109",
    subject: "Patient portal follow up",
    message:
      "Hi team, just following up on the patient portal project. Could you share the latest build link for review? Our doctors are waiting to test the appointment module.",
    receivedAt: "2026-03-06T11:00:00",
    status: "read",
  },
  {
    id: "4",
    name: "Priya Sharma",
    email: "priya.sharma@freshmart.in",
    phone: "+91 99887 76655",
    subject: "Dashboard bug report",
    message:
      "Hello, we noticed that the inventory dashboard is showing incorrect stock counts for our Pune outlet. The numbers don't match after we updated the stock manually. Please look into this at the earliest.",
    receivedAt: "2026-03-05T16:45:00",
    status: "read",
  },
  {
    id: "5",
    name: "Karan Verma",
    email: "karan.v@startupx.io",
    phone: "+91 70011 22334",
    subject: "Mobile app development inquiry",
    message:
      "Hey Dreamers team! We are a startup based in Bangalore and we need a cross-platform mobile app for our logistics platform. Looking for React Native developers. Can we schedule a call this week?",
    receivedAt: "2026-03-04T10:20:00",
    status: "read",
  },
  {
    id: "6",
    name: "Anita Desai",
    email: "anita.desai@edulearn.org",
    phone: "+91 82233 44556",
    subject: "E-learning platform quote",
    message:
      "We are an NGO working in education and we want to build an e-learning platform for underprivileged students. We have limited budget but would love to discuss options. Please get in touch.",
    receivedAt: "2026-03-03T08:55:00",
    status: "unread",
  },
];

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0)
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

function formatFullDate(dateStr: string) {
  return new Date(dateStr).toLocaleString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ msg }: { msg: string }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-lg text-sm font-medium border bg-green-50 text-green-700 border-green-200">
      <CheckCircle2 className="w-4 h-4 text-green-500" />
      {msg}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const MessagesAdmin = () => {
  const [messages, setMessages] = useState<Message[]>(SEED_MESSAGES);
  const [selected, setSelected] = useState<Message | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // ── Derived ────────────────────────────────────────────────────────────────
  const filtered = messages.filter((m) => {
    const q = search.toLowerCase();
    const matchSearch =
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.subject.toLowerCase().includes(q);
    const matchFilter = filter === "all" || m.status === filter;
    return matchSearch && matchFilter;
  });

  const unreadCount = messages.filter((m) => m.status === "unread").length;

  // ── Helpers ────────────────────────────────────────────────────────────────
  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function openMessage(msg: Message) {
    // mark as read when opened
    if (msg.status === "unread") {
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, status: "read" } : m)),
      );
      setSelected({ ...msg, status: "read" });
    } else {
      setSelected(msg);
    }
  }

  function handleDelete(id: string) {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    if (selected?.id === id) setSelected(null);
    setDeleteConfirmId(null);
    showToast("Message deleted.");
  }

  function markUnread(msg: Message) {
    setMessages((prev) =>
      prev.map((m) => (m.id === msg.id ? { ...m, status: "unread" } : m)),
    );
    setSelected(null);
    showToast("Marked as unread.");
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50 min-h-screen">
      <AdminHeader
        title="Messages"
        subtitle="All incoming contact form messages"
      />

      <div className="flex-1 p-6 max-w-[1400px] w-full mx-auto">
        {/* ── Inbox Layout ── */}
        <div
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex"
          style={{ height: "calc(100vh - 148px)" }}
        >
          {/* ── LEFT: Message List ── */}
          <div
            className={`flex flex-col border-r border-gray-100 transition-all duration-200
            ${selected ? "w-80 min-w-[280px]" : "flex-1"}
          `}
          >
            {/* List Header */}
            <div className="px-4 py-4 border-b border-gray-100 space-y-3">
              {/* Title + unread badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Inbox className="w-4 h-4 text-[#C89A3D]" />
                  <span className="text-sm font-bold text-gray-800">Inbox</span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-[#C89A3D] text-white text-[10px] font-bold">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-400">
                  {filtered.length} messages
                </span>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search messages..."
                  className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#C89A3D]/50 focus:bg-white transition-all placeholder:text-gray-400"
                />
              </div>

              {/* Filter tabs */}
              <div className="flex gap-1 p-1 bg-gray-50 rounded-xl border border-gray-100">
                {(["all", "unread", "read"] as FilterType[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all duration-150
                      ${
                        filter === f
                          ? "bg-white text-[#C89A3D] shadow-sm border border-gray-100"
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Message List */}
            <div className="flex-1 overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <Mail className="w-8 h-8 text-gray-200 mb-3" />
                  <p className="text-sm text-gray-400">No messages found</p>
                </div>
              ) : (
                filtered.map((msg) => (
                  <div
                    key={msg.id}
                    onClick={() => openMessage(msg)}
                    className={`flex items-start gap-3 px-4 py-3.5 cursor-pointer border-b border-gray-50 transition-all duration-150
                      ${
                        selected?.id === msg.id
                          ? "bg-[#C89A3D]/6 border-l-2 border-l-[#C89A3D]"
                          : "hover:bg-gray-50/80 border-l-2 border-l-transparent"
                      }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold
                      ${
                        msg.status === "unread"
                          ? "bg-[#C89A3D] text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {msg.name[0].toUpperCase()}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span
                          className={`text-sm truncate ${msg.status === "unread" ? "font-bold text-gray-900" : "font-medium text-gray-700"}`}
                        >
                          {msg.name}
                        </span>
                        <span className="text-[10px] text-gray-400 flex-shrink-0">
                          {formatDate(msg.receivedAt)}
                        </span>
                      </div>
                      <p
                        className={`text-xs truncate mb-0.5 ${msg.status === "unread" ? "text-gray-700 font-semibold" : "text-gray-500"}`}
                      >
                        {msg.subject}
                      </p>
                      <p className="text-[11px] text-gray-400 truncate">
                        {msg.message}
                      </p>
                    </div>

                    {/* Unread dot */}
                    {msg.status === "unread" && (
                      <div className="w-2 h-2 rounded-full bg-[#C89A3D] flex-shrink-0 mt-1.5" />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ── RIGHT: Message Detail ── */}
          {selected ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Detail Header */}
              <div className="px-7 py-5 border-b border-gray-100 flex items-start justify-between">
                <div className="flex-1 min-w-0 pr-4">
                  <h2 className="text-lg font-bold text-gray-900 mb-1 truncate">
                    {selected.subject}
                  </h2>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-sm font-semibold text-[#C89A3D]">
                      {selected.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      {selected.email}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {selected.phone}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-1.5">
                    <Clock className="w-3 h-3 text-gray-300" />
                    <span className="text-[11px] text-gray-400">
                      {formatFullDate(selected.receivedAt)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => markUnread(selected)}
                    title="Mark as unread"
                    className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#C89A3D] hover:border-[#C89A3D]/30 transition-all"
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(selected.id)}
                    title="Delete"
                    className="w-8 h-8 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-400 hover:bg-red-100 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setSelected(null)}
                    className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-all"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Message Body */}
              <div className="flex-1 overflow-y-auto px-7 py-6">
                {/* Sender card */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 mb-6">
                  <div className="w-12 h-12 rounded-full bg-[#C89A3D]/10 border border-[#C89A3D]/20 flex items-center justify-center text-lg font-bold text-[#C89A3D] flex-shrink-0">
                    {selected.name[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">
                      {selected.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {selected.email}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {selected.phone}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border bg-green-50 text-green-700 border-green-100">
                      <MailOpen className="w-3 h-3" /> Read
                    </span>
                  </div>
                </div>

                {/* Message bubble */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-5 h-px bg-[#C89A3D]" />
                    <span className="text-[10px] uppercase tracking-widest text-[#C89A3D] font-semibold">
                      Message
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {selected.message}
                  </p>
                </div>

                {/* Reply hint */}
                <div className="mt-4 p-4 bg-[#C89A3D]/5 border border-[#C89A3D]/15 rounded-2xl">
                  <p className="text-xs text-[#C89A3D] font-semibold mb-1">
                    Reply via Email
                  </p>
                  <p className="text-xs text-gray-500">
                    Click below to open your email client and reply directly to{" "}
                    <a
                      href={`mailto:${selected.email}`}
                      className="text-[#C89A3D] underline font-medium"
                    >
                      {selected.email}
                    </a>
                  </p>
                  <a
                    href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                    className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-[#C89A3D] hover:bg-[#b78930] text-white text-xs font-semibold rounded-xl transition-all duration-200 shadow hover:shadow-[#C89A3D]/25"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Reply to {selected.name}
                  </a>
                </div>
              </div>
            </div>
          ) : (
            /* Empty state */
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
              <div className="w-16 h-16 rounded-2xl bg-[#C89A3D]/8 border border-[#C89A3D]/15 flex items-center justify-center mb-4">
                <MailOpen className="w-7 h-7 text-[#C89A3D]/60" />
              </div>
              <p className="text-base font-semibold text-gray-700 mb-1">
                Select a message
              </p>
              <p className="text-sm text-gray-400">
                Click any message from the inbox to read it here
              </p>
              {unreadCount > 0 && (
                <div className="mt-4 flex items-center gap-1.5 px-3 py-1.5 bg-[#C89A3D]/8 border border-[#C89A3D]/20 rounded-xl">
                  <ChevronRight className="w-3.5 h-3.5 text-[#C89A3D]" />
                  <span className="text-xs text-[#C89A3D] font-semibold">
                    {unreadCount} unread message{unreadCount > 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Delete Confirm ── */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-5">
              <Trash2 className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Delete this message?
            </h3>
            <p className="text-sm text-gray-400 mb-7">
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-all shadow hover:shadow-red-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && <Toast msg={toast} />}
    </div>
  );
};

export default MessagesAdmin;
