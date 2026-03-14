import React, { useEffect, useState } from "react";
import { X, Send, Loader2 } from "lucide-react";
import Toast from "../../admin/components/Toast";
// import { messageApi } from "../../api/messageApi";
import { proposalApi } from "../../api/proposalApi";
import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_QUOTE_TEMPLATE_ID = import.meta.env
  .VITE_EMAILJS_QUOTE_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    fullName: string;
    email: string;
    projectType: string;
    company: string;
  };
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  projectType: string;
  budgetRange: string;
  timeline: string;
  description: string;
}

const initialFormData: FormData = {
  fullName: "",
  email: "",
  phone: "",
  company: "",
  projectType: "",
  budgetRange: "",
  timeline: "",
  description: "",
};

const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData((prev) => ({
        ...prev,
        ...initialData,
      }));
    }
  }, [isOpen, initialData]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleEsc);
      return () => {
        window.removeEventListener("keydown", handleEsc);
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  if (!isOpen && !toast) return null;

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.projectType)
      newErrors.projectType = "Project type is required";
    if (!formData.budgetRange)
      newErrors.budgetRange = "Budget range is required";
    if (!formData.timeline) newErrors.timeline = "Timeline is required";
    if (!formData.description.trim())
      newErrors.description = "Project description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // 1. Send Email via EmailJS
      if (
        EMAILJS_SERVICE_ID &&
        EMAILJS_QUOTE_TEMPLATE_ID &&
        EMAILJS_PUBLIC_KEY
      ) {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_QUOTE_TEMPLATE_ID,
          {
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone || "Not provided",
            company: formData.company || "N/A",
            project_type: formData.projectType,
            budget: formData.budgetRange,
            timeline: formData.timeline,
            description: formData.description,
          },
          EMAILJS_PUBLIC_KEY,
        );
      }

      // 2. Save to Proposal Database (New dedicated table)
      await proposalApi.create({
        ...formData,
        source: "client",
      });

      setToast({
        msg: `Thank you ${formData.fullName.split(" ")[0]}! Your request has been received. We'll get back to you within 24 hours.`,
        type: "success",
      });

      // Reset and close after a short delay
      setTimeout(() => {
        setFormData(initialFormData);
        onClose();
      }, 500);
    } catch (err: any) {
      setToast({
        msg:
          err?.response?.data?.message ||
          "Something went wrong. Please try again later.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const inputCls = (field: keyof FormData) => `
    w-full px-4 py-3 bg-white/5 border rounded-xl outline-none transition-all duration-300 text-white placeholder:text-slate-500 text-sm
    ${errors[field] ? "border-red-500/50 bg-red-500/5 focus:border-red-500" : "border-white/10 focus:border-[#C89A3D]/50 focus:bg-white/10"}
  `;

  const labelCls =
    "block text-[11px] font-semibold text-[#C89A3D] uppercase tracking-[0.15em] mb-2 ml-1";
  const errorMsgCls = "text-[10px] text-red-400 mt-1 ml-1 font-medium";

  return (
    <>
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop - Glassy/Transparent look */}
          <div
            className="absolute inset-0 bg-[#0c1117]/70 backdrop-blur-[8px] transition-opacity duration-300"
            onClick={onClose}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-2xl bg-[#12181f] border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C89A3D]/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#C89A3D]/5 rounded-full blur-[80px] -ml-32 -mb-32 pointer-events-none" />

            {/* Header */}
            <div className="relative px-8 pt-8 pb-4 flex items-center justify-between border-b border-white/5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C89A3D] animate-pulse" />
                  <span className="text-[#C89A3D] text-[10px] font-bold uppercase tracking-widest">
                    Start a Project
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Get a{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C89A3D] to-[#f0c46a]">
                    Quote
                  </span>
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="relative p-8 max-h-[75vh] overflow-y-auto custom-scrollbar"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className={labelCls}>Full Name *</label>
                  <input
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={inputCls("fullName")}
                  />
                  {errors.fullName && (
                    <p className={errorMsgCls}>{errors.fullName}</p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label className={labelCls}>Email Address *</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className={inputCls("email")}
                  />
                  {errors.email && (
                    <p className={errorMsgCls}>{errors.email}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label className={labelCls}>Phone Number</label>
                  <input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 00000 00000"
                    className={inputCls("phone")}
                  />
                </div>

                {/* Company Name */}
                <div>
                  <label className={labelCls}>Company / Business</label>
                  <input
                    name="company"
                    type="text"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Your Company Name"
                    className={inputCls("company")}
                  />
                </div>

                {/* Project Type */}
                <div>
                  <label className={labelCls}>Project Type *</label>
                  <select
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    className={inputCls("projectType")}
                  >
                    <option value="" disabled className="bg-[#12181f]">
                      Select Type
                    </option>
                    <option value="Web Development" className="bg-[#12181f]">
                      Web Development
                    </option>
                    <option value="Mobile App" className="bg-[#12181f]">
                      Mobile App
                    </option>
                    <option value="UI/UX Design" className="bg-[#12181f]">
                      UI/UX Design
                    </option>
                    <option value="Cloud & DevOps" className="bg-[#12181f]">
                      Cloud & DevOps
                    </option>
                    <option value="AI & ML" className="bg-[#12181f]">
                      AI & ML
                    </option>
                    <option value="Consulting" className="bg-[#12181f]">
                      Consulting
                    </option>
                  </select>
                  {errors.projectType && (
                    <p className={errorMsgCls}>{errors.projectType}</p>
                  )}
                </div>

                {/* Budget Range */}
                <div>
                  <label className={labelCls}>Budget Range *</label>
                  <select
                    name="budgetRange"
                    value={formData.budgetRange}
                    onChange={handleChange}
                    className={inputCls("budgetRange")}
                  >
                    <option value="" disabled className="bg-[#12181f]">
                      Select Range
                    </option>
                    <option value="₹10k–25k" className="bg-[#12181f]">
                      ₹10k–25k
                    </option>
                    <option value="₹25k–50k" className="bg-[#12181f]">
                      ₹25k–50k
                    </option>
                    <option value="₹50k–1L" className="bg-[#12181f]">
                      ₹50k–1L
                    </option>
                    <option value="₹1L+" className="bg-[#12181f]">
                      ₹1L+
                    </option>
                  </select>
                  {errors.budgetRange && (
                    <p className={errorMsgCls}>{errors.budgetRange}</p>
                  )}
                </div>

                {/* Timeline */}
                <div className="md:col-span-2">
                  <label className={labelCls}>Timeline / Deadline *</label>
                  <select
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleChange}
                    className={inputCls("timeline")}
                  >
                    <option value="" disabled className="bg-[#12181f]">
                      Select Timeline
                    </option>
                    <option value="Less than 1 month" className="bg-[#12181f]">
                      Less than 1 month
                    </option>
                    <option value="1–3 months" className="bg-[#12181f]">
                      1–3 months
                    </option>
                    <option value="3–6 months" className="bg-[#12181f]">
                      3–6 months
                    </option>
                    <option value="6+ months" className="bg-[#12181f]">
                      6+ months
                    </option>
                  </select>
                  {errors.timeline && (
                    <p className={errorMsgCls}>{errors.timeline}</p>
                  )}
                </div>

                {/* Project Description */}
                <div className="md:col-span-2">
                  <label className={labelCls}>Project Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell us about your project goals and requirements..."
                    className={`${inputCls("description")} resize-none`}
                  />
                  {errors.description && (
                    <p className={errorMsgCls}>{errors.description}</p>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 flex items-center justify-end gap-4 border-t border-white/5 pt-6">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-6 py-3 text-slate-400 hover:text-white text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-[#C89A3D] hover:bg-[#b78930] text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-[#C89A3D]/20 flex items-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Request
                      <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <style>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 5px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: rgba(255, 255, 255, 0.02);
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: rgba(200, 154, 61, 0.2);
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: rgba(200, 154, 61, 0.4);
            }
          `}</style>
        </div>
      )}
    </>
  );
};

export default QuoteModal;
