import { useEffect, useState } from "react";
import AdminHeader from "../components/AdminHeader";
import { 
  Search, Trash2, Clock, CheckCircle2, X, ChevronRight, 
  FileText, User, Briefcase, IndianRupee, Calendar, 
  ExternalLink, Send, Inbox, Filter, Building2,
  Mail, Phone
} from "lucide-react";
import { proposalApi } from "../../api/proposalApi";
import Toast from "../components/Toast";

type ProposalStatus = "pending" | "sent" | "confirmed" | "rejected";

interface Proposal {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  projectType: string;
  budgetRange: string;
  timeline: string;
  description: string;
  source: "client" | "admin";
  status: ProposalStatus;
  createdAt: string;
  sentAt?: string;
  confirmedAt?: string;
  magicToken: string;
}

const ProposalsAdmin = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [selected, setSelected] = useState<Proposal | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ProposalStatus | "all">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      setIsLoading(true);
      const res = await proposalApi.getAll();
      setProposals(res.data.data);
    } catch (err) {
      console.error(err);
      showToast("Failed to fetch proposals", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleUpdateStatus = async (id: string, status: ProposalStatus) => {
    try {
      await proposalApi.updateStatus(id, status);
      setProposals(prev => prev.map(p => p.id === id ? { ...p, status } : p));
      if (selected?.id === id) setSelected({ ...selected, status });
      showToast(`Proposal marked as ${status}`);
    } catch (err) {
      showToast("Update failed", "error");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await proposalApi.delete(id);
      setProposals(prev => prev.filter(p => p.id !== id));
      if (selected?.id === id) setSelected(null);
      setDeleteConfirmId(null);
      showToast("Proposal deleted");
    } catch (err) {
      showToast("Delete failed", "error");
    }
  };

  const filtered = proposals.filter(p => {
    const q = search.toLowerCase();
    const matchesSearch = p.fullName.toLowerCase().includes(q) || p.email.toLowerCase().includes(q) || p.projectType.toLowerCase().includes(q);
    const matchesFilter = filter === "all" || p.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: ProposalStatus) => {
    switch (status) {
      case "pending": return "bg-amber-100 text-amber-700 border-amber-200";
      case "sent": return "bg-blue-100 text-blue-700 border-blue-200";
      case "confirmed": return "bg-green-100 text-green-700 border-green-200";
      case "rejected": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 min-h-screen">
      <AdminHeader title="Project Proposals" subtitle="Manage project inquiries and formal quotes" />

      <div className="flex-1 p-6 max-w-[1400px] w-full mx-auto">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex h-[calc(100vh-148px)]">
          
          {/* --- Sidebar: Proposal List --- */}
          <div className={`flex flex-col border-r border-gray-100 ${selected ? 'w-80 min-w-[320px]' : 'flex-1'}`}>
            <div className="p-4 border-b border-gray-100 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search proposals..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#C89A3D]/50 focus:bg-white transition-all text-sm"
                />
              </div>
              <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
                {["all", "pending", "sent", "confirmed", "rejected"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f as any)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider whitespace-nowrap border transition-all ${filter === f ? 'bg-[#C89A3D] text-white border-[#C89A3D]' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="p-12 text-center"><span className="loading loading-spinner text-[#C89A3D]"></span></div>
              ) : filtered.length === 0 ? (
                <div className="p-12 text-center text-gray-400 text-sm">No proposals found</div>
              ) : (
                filtered.map(p => (
                  <div 
                    key={p.id}
                    onClick={() => setSelected(p)}
                    className={`p-4 border-b border-gray-50 cursor-pointer transition-all ${selected?.id === p.id ? 'bg-[#C89A3D]/5 border-l-4 border-l-[#C89A3D]' : 'hover:bg-gray-50 border-l-4 border-l-transparent'}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-bold text-gray-800 truncate pr-2">{p.fullName}</span>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${getStatusColor(p.status)}`}>{p.status}</span>
                    </div>
                    <p className="text-xs text-[#C89A3D] font-semibold mb-1">{p.projectType}</p>
                    <div className="flex justify-between items-center text-[10px] text-gray-400">
                      <span>{p.source === 'admin' ? 'Outbound' : 'Inbound'}</span>
                      <span>{formatDate(p.createdAt)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* --- Detail View --- */}
          {selected ? (
            <div className="flex-1 overflow-y-auto bg-gray-50/30 p-8">
              <div className="max-w-3xl mx-auto space-y-6">
                
                {/* Status Bar */}
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${getStatusColor(selected.status)}`}>
                         <Clock className="w-5 h-5" />
                      </div>
                      <div>
                         <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Current Status</p>
                         <p className="text-sm font-bold text-gray-800 capitalize">{selected.status}</p>
                      </div>
                   </div>
                   <div className="flex gap-2">
                      {selected.status !== 'confirmed' && (
                        <button 
                          onClick={() => handleUpdateStatus(selected.id, 'confirmed')}
                          className="px-4 py-2 bg-green-500 text-white text-xs font-bold rounded-lg hover:bg-green-600 transition-all flex items-center gap-2"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Mark Confirmed
                        </button>
                      )}
                      {selected.status === 'pending' && (
                        <button 
                          onClick={() => handleUpdateStatus(selected.id, 'rejected')}
                          className="px-4 py-2 bg-red-50 text-red-500 text-xs font-bold rounded-lg hover:bg-red-100 transition-all"
                        >
                          Reject
                        </button>
                      )}
                      <button 
                        onClick={() => setDeleteConfirmId(selected.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                   </div>
                </div>

                {/* Client Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                         <User className="w-4 h-4 text-[#C89A3D]" />
                         <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Client Details</h3>
                      </div>
                      <div className="space-y-3">
                         <div>
                            <p className="text-xs text-gray-400">Full Name</p>
                            <p className="text-sm font-bold text-gray-800">{selected.fullName}</p>
                         </div>
                         <div>
                            <p className="text-xs text-gray-400">Email Address</p>
                            <div className="flex items-center gap-2">
                               <p className="text-sm font-bold text-gray-800">{selected.email}</p>
                               <a href={`mailto:${selected.email}`} className="text-[#C89A3D]"><Mail className="w-3 h-3" /></a>
                            </div>
                         </div>
                         {selected.phone && (
                           <div>
                              <p className="text-xs text-gray-400">Phone</p>
                              <p className="text-sm font-bold text-gray-800">{selected.phone}</p>
                           </div>
                         )}
                         {selected.company && (
                           <div>
                              <p className="text-xs text-gray-400">Company</p>
                              <p className="text-sm font-bold text-gray-800">{selected.company}</p>
                           </div>
                         )}
                      </div>
                   </div>

                   <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                         <Briefcase className="w-4 h-4 text-[#C89A3D]" />
                         <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Project Specs</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div>
                            <p className="text-xs text-gray-400">Budget</p>
                            <p className="text-sm font-bold text-[#C89A3D]">{selected.budgetRange}</p>
                         </div>
                         <div>
                            <p className="text-xs text-gray-400">Timeline</p>
                            <p className="text-sm font-bold text-gray-800">{selected.timeline}</p>
                         </div>
                         <div className="col-span-2">
                            <p className="text-xs text-gray-400">Created At</p>
                            <p className="text-sm font-bold text-gray-800">{formatDate(selected.createdAt)}</p>
                         </div>
                         <div className="col-span-2">
                            <p className="text-xs text-gray-400">Magic Token</p>
                            <code className="text-[10px] bg-gray-50 p-1 rounded border text-gray-500">{selected.magicToken}</code>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Description */}
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                   <div className="flex items-center gap-2 mb-4">
                      <FileText className="w-4 h-4 text-[#C89A3D]" />
                      <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Project Description</h3>
                   </div>
                   <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{selected.description}</p>
                </div>

                {/* Actions & Tracking */}
                <div className="bg-[#C89A3D]/5 border border-[#C89A3D]/20 p-6 rounded-2xl space-y-4">
                   <h3 className="text-sm font-bold text-[#C89A3D]">Proposal Tracking</h3>
                   <div className="flex items-center gap-8">
                      <div className="flex items-center gap-2">
                         <div className={`w-2 h-2 rounded-full ${selected.createdAt ? 'bg-[#C89A3D]' : 'bg-gray-200'}`} />
                         <span className="text-[10px] font-bold text-gray-500">Drafted</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <div className={`w-2 h-2 rounded-full ${selected.sentAt ? 'bg-[#C89A3D]' : 'bg-gray-200'}`} />
                         <span className="text-[10px] font-bold text-gray-500">Sent to Client {selected.sentAt && `(${formatDate(selected.sentAt)})`}</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <div className={`w-2 h-2 rounded-full ${selected.confirmedAt ? 'bg-green-500' : 'bg-gray-200'}`} />
                         <span className="text-[10px] font-bold text-gray-500">Client Confirmed {selected.confirmedAt && `(${formatDate(selected.confirmedAt)})`}</span>
                      </div>
                   </div>
                   {selected.source === 'admin' && selected.status === 'pending' && (
                     <div className="pt-4 flex justify-end">
                        <button 
                          onClick={() => {
                            const baseUrl = window.location.origin;
                            const link = `${baseUrl}/services?quote_token=${selected.magicToken}`;
                            navigator.clipboard.writeText(link);
                            showToast("Link copied to clipboard!");
                          }}
                          className="px-4 py-2 bg-white border border-[#C89A3D]/30 text-[#C89A3D] text-[10px] font-black uppercase rounded-lg hover:bg-white/50 transition-all flex items-center gap-2"
                        >
                          <ExternalLink className="w-3 h-3" /> Copy Magic Link
                        </button>
                     </div>
                   )}
                </div>

              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-gray-50/20">
               <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-gray-300" />
               </div>
               <h3 className="text-lg font-bold text-gray-700">Select a proposal</h3>
               <p className="text-sm text-gray-400 max-w-xs mx-auto">Choose an item from the list to view full client details and manage the status.</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#0c1117]/80 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Proposal?</h3>
            <p className="text-sm text-gray-400 mb-8">This action is permanent and cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-3 border border-gray-200 text-gray-500 font-bold rounded-xl text-xs hover:bg-gray-50">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirmId)} className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl text-xs hover:bg-red-600 shadow-lg shadow-red-200">Delete</button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
};

export default ProposalsAdmin;
