import { useState } from "react";
import AdminHeader from "../components/AdminHeader";
import { Send, User, Mail, Phone, Building2, Briefcase, IndianRupee, Clock, FileText, Loader2, CheckCircle2 } from "lucide-react";
import Toast from "../components/Toast";
import emailjs from "@emailjs/browser";
import { messageApi } from "../../api/messageApi";
import { proposalApi } from "../../api/proposalApi";

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_QUOTE_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_QUOTE_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const CreateQuoteAdmin = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    projectType: "",
    budgetRange: "",
    timeline: "",
    description: "",
  });

  const [isPreview, setIsPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSendGmail = (token?: string) => {
    // Generate the secure token-based link
    const baseUrl = window.location.origin;
    const magicLink = `${baseUrl}/services?quote_token=${token || "VERIFY_ON_SITE"}`;

    const subject = encodeURIComponent(`Project Proposal: ${formData.projectType} - Dreamers Softtech`);
    const body = encodeURIComponent(`
Dear ${formData.fullName},

Thank you for reaching out to Dreamers Softtech. We have reviewed your requirements and prepared a formal proposal for your ${formData.projectType} project.

You can review and proceed with this proposal directly on our website by clicking the link below:

PROCEED TO PROPOSAL:
${magicLink}

--- PROJECT SUMMARY ---
Project: ${formData.projectType}
Estimated Budget: ${formData.budgetRange}
Timeline: ${formData.timeline}

---

We are excited about the possibility of working together. If you have any questions, feel free to reply to this email or use the "Proceed" link above to confirm your interest.

Best regards,

The Dreamers Softtech Team
www.dreamerssofttech.com
    `.trim());

    window.location.href = `mailto:${formData.email}?subject=${subject}&body=${body}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // 1. Save to Proposal Database FIRST to generate the Token
      const response = await proposalApi.create({
        ...formData,
        source: "admin",
      });

      const token = response.data.data.magicToken;
      const proposalId = response.data.data.id;

      // 2. Optional EmailJS Notification (For internal tracking)
      if (EMAILJS_SERVICE_ID && EMAILJS_QUOTE_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_QUOTE_TEMPLATE_ID,
          {
            ...formData,
            magic_link: `${window.location.origin}/services?quote_token=${token}`,
          },
          EMAILJS_PUBLIC_KEY,
        ).catch(e => console.warn("EmailJS failed, continuing...", e));
      }

      setToast({ msg: "Proposal created and token generated!", type: "success" });
      
      // Prompt to send via Gmail
      setTimeout(() => {
          if (confirm("Proposal saved to database! Would you like to open Gmail to send the professional magic link now?")) {
              // Mark as officially sent in DB
              proposalApi.updateStatus(proposalId, "sent");
              handleSendGmail(token);
          }
      }, 500);

    } catch (err: any) {
      console.error("Create Quote Error:", err);
      setToast({ 
        msg: err?.response?.data?.message || "Failed to create quote. Check console.", 
        type: "error" 
      });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setToast(null), 4000);
    }
  };

  const inputCls = "w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl outline-none focus:border-[#C89A3D] focus:ring-4 focus:ring-[#C89A3D]/5 transition-all text-sm text-gray-700 placeholder:text-gray-400";
  const labelCls = "block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1";
  const iconCls = "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-colors group-focus-within:text-[#C89A3D]";

  return (
    <div className="flex-1 flex flex-col bg-gray-50 min-h-screen">
      <AdminHeader 
        title="Create Quote" 
        subtitle={isPreview ? "Review your professional proposal" : "Manually generate a quote request for a client"} 
      />

      <div className="flex-1 p-6 max-w-4xl w-full mx-auto">
        {/* --- Header Controls --- */}
        <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2 p-1 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <button 
                    onClick={() => setIsPreview(false)}
                    className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${!isPreview ? 'bg-[#C89A3D] text-white shadow-md shadow-[#C89A3D]/20' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    Edit Form
                </button>
                <button 
                    onClick={() => setIsPreview(true)}
                    className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${isPreview ? 'bg-[#C89A3D] text-white shadow-md shadow-[#C89A3D]/20' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    Preview Proposal
                </button>
            </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden relative min-h-[600px]">
          {/* Decorative Background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C89A3D]/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
          
          {!isPreview ? (
            <form onSubmit={handleSubmit} className="relative p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* --- Client Information --- */}
                <div className="md:col-span-2">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-xl bg-[#C89A3D]/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-[#C89A3D]" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">Client Information</h3>
                  </div>
                </div>

                {/* Full Name */}
                <div className="group">
                  <label className={labelCls}>Full Name *</label>
                  <div className="relative">
                    <User className={iconCls} />
                    <input
                      required
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter client's full name"
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="group">
                  <label className={labelCls}>Email Address *</label>
                  <div className="relative">
                    <Mail className={iconCls} />
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="client@example.com"
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="group">
                  <label className={labelCls}>Phone Number</label>
                  <div className="relative">
                    <Phone className={iconCls} />
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 00000 00000"
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* Company */}
                <div className="group">
                  <label className={labelCls}>Company / Organization</label>
                  <div className="relative">
                    <Building2 className={iconCls} />
                    <input
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Company name (optional)"
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* --- Project Details --- */}
                <div className="md:col-span-2 mt-4">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-xl bg-[#C89A3D]/10 flex items-center justify-center">
                      <Briefcase className="w-4 h-4 text-[#C89A3D]" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">Project Details</h3>
                  </div>
                </div>

                {/* Project Type */}
                <div className="group">
                  <label className={labelCls}>Project Type *</label>
                  <div className="relative">
                    <Briefcase className={iconCls} />
                    <select
                      required
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleChange}
                      className={`${inputCls} appearance-none`}
                    >
                      <option value="">Select Category</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Mobile App">Mobile App</option>
                      <option value="UI/UX Design">UI/UX Design</option>
                      <option value="Cloud & DevOps">Cloud & DevOps</option>
                      <option value="AI & ML">AI & ML</option>
                      <option value="Consulting">Consulting</option>
                    </select>
                  </div>
                </div>

                {/* Budget */}
                <div className="group">
                  <label className={labelCls}>Budget Range *</label>
                  <div className="relative">
                    <IndianRupee className={iconCls} />
                    <select
                      required
                      name="budgetRange"
                      value={formData.budgetRange}
                      onChange={handleChange}
                      className={`${inputCls} appearance-none`}
                    >
                      <option value="">Select Budget</option>
                      <option value="₹10k–25k">₹10k–25k</option>
                      <option value="₹25k–50k">₹25k–50k</option>
                      <option value="₹50k–1L">₹50k–1L</option>
                      <option value="₹1L+">₹1L+</option>
                    </select>
                  </div>
                </div>

                {/* Timeline */}
                <div className="group md:col-span-2">
                  <label className={labelCls}>Timeline *</label>
                  <div className="relative">
                    <Clock className={iconCls} />
                    <select
                      required
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleChange}
                      className={`${inputCls} appearance-none`}
                    >
                      <option value="">Select Timeline</option>
                      <option value="Less than 1 month">Less than 1 month</option>
                      <option value="1–3 months">1–3 months</option>
                      <option value="3–6 months">3–6 months</option>
                      <option value="6+ months">6+ months</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div className="group md:col-span-2">
                  <label className={labelCls}>Project Description *</label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-4 w-4 h-4 text-gray-400 group-focus-within:text-[#C89A3D]" />
                    <textarea
                      required
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Briefly describe the project requirements..."
                      className={`${inputCls} pl-11 pt-3.5 resize-none`}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-12 flex items-center justify-end gap-4 border-t border-gray-50 pt-8">
                <button
                  type="button"
                  onClick={() => setFormData({
                      fullName: "", email: "", phone: "", company: "",
                      projectType: "", budgetRange: "", timeline: "", description: ""
                  })}
                  className="px-6 py-3 text-gray-400 hover:text-gray-600 text-sm font-semibold transition-colors"
                >
                  Clear Form
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-10 py-3.5 bg-[#C89A3D] hover:bg-[#b78930] text-white font-bold rounded-2xl text-sm transition-all shadow-lg shadow-[#C89A3D]/20 flex items-center gap-2 disabled:opacity-70 group"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Save to Database
                      <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* --- PREVIEW MODE --- */
            <div className="relative p-8 md:p-16 flex flex-col min-h-full">
               <div className="max-w-2xl mx-auto w-full bg-white border border-gray-100 p-10 md:p-16 shadow-xl rounded-2xl relative overflow-hidden">
                  {/* Proposal Background Decoration */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#C89A3D]/5 rounded-full blur-2xl -mr-16 -mt-16" />
                  
                  {/* Proposal Header */}
                  <div className="flex justify-between items-start mb-12 border-b border-gray-50 pb-8">
                    <div>
                      <h2 className="text-2xl font-black text-[#C89A3D] tracking-tighter mb-1">DREAMERS SOFTTECH</h2>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em]">Official Proposal</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-gray-800">{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric'})}</p>
                      <p className="text-[10px] text-gray-400 mt-1 uppercase">Proposal ID: #DS-{Math.floor(1000 + Math.random() * 9000)}</p>
                    </div>
                  </div>

                  {/* Proposal Content */}
                  <div className="space-y-8">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Dear <span className="font-bold text-gray-800">{formData.fullName || "[Client Name]"}</span>,
                    </p>
                    
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Thank you for choosing Dreamers Softtech. We have reviewed your requirements and prepared the following proposal for your <span className="font-bold text-[#C89A3D]">{formData.projectType || "[Project Type]"}</span> project:
                    </p>

                    <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 grid grid-cols-2 gap-y-4">
                        <div>
                            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">Company</p>
                            <p className="text-sm font-bold text-gray-800">{formData.company || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">Project Category</p>
                            <p className="text-sm font-bold text-gray-800">{formData.projectType || "General"}</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">Estimated Budget</p>
                            <p className="text-sm font-bold text-[#C89A3D]">{formData.budgetRange || "To be discussed"}</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">Timeline</p>
                            <p className="text-sm font-bold text-gray-800">{formData.timeline || "TBD"}</p>
                        </div>
                    </div>

                    <div>
                       <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-3">Project Requirements</p>
                       <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap italic bg-gray-50/30 p-4 rounded-xl border-l-2 border-[#C89A3D]/30">
                         {formData.description || "Project details will be listed here..."}
                       </p>
                    </div>

                    <div className="pt-8 border-t border-gray-50 space-y-4">
                        <p className="text-sm text-gray-600">Best regards,</p>
                        <div>
                          <p className="text-sm font-black text-gray-800 tracking-tight">THE DREAMERS SOFTTECH TEAM</p>
                          <p className="text-xs text-[#C89A3D] font-bold">www.dreamerssofttech.com</p>
                        </div>
                    </div>
                  </div>
               </div>

               {/* Preview Footer Actions */}
               <div className="mt-12 flex items-center justify-center gap-6">
                   <button 
                      onClick={() => setIsPreview(false)}
                      className="px-8 py-3 bg-white border border-gray-200 text-gray-500 rounded-2xl text-sm font-bold hover:bg-gray-50 transition-all flex items-center gap-2"
                   >
                      <FileText className="w-4 h-4" /> Edit Details
                   </button>
                   <button 
                      onClick={handleSendGmail}
                      className="px-10 py-4 bg-[#C89A3D] hover:bg-[#b78930] text-white rounded-2xl text-sm font-bold shadow-xl shadow-[#C89A3D]/20 flex items-center gap-3 transition-all transform hover:-translate-y-1"
                   >
                      <Mail className="w-4 h-4" /> Open in Gmail Compose
                   </button>
               </div>
            </div>
          )}
        </div>
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
};

export default CreateQuoteAdmin;
