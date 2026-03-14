import { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
  FaEnvelope,
  FaGithub,
} from "react-icons/fa6";
import {
  Mail,
  MapPin,
  Phone,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

// ─── PASTE YOUR KEYS HERE ─────────────────────────────────────────────────────
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
// ─────────────────────────────────────────────────────────────────────────────

import { messageApi } from "../../api/messageApi";

const contactDetails = [
  { icon: Mail, text: "info@dreamerssofttech.com" },
  { icon: MapPin, text: "123 Tech Park, Cyber City, Bangalore, India" },
  { icon: Phone, text: "+91 98765 43210" },
];

const socials = [
  { icon: <FaFacebookF />, label: "Facebook" },
  { icon: <FaInstagram />, label: "Instagram" },
  { icon: <FaLinkedinIn />, label: "LinkedIn" },
  { icon: <FaXTwitter />, label: "X" },
  { icon: <FaGithub />, label: "GitHub" },
  { icon: <FaEnvelope />, label: "Email" },
];

const SUBJECTS = [
  { value: "web", label: "Web Development" },
  { value: "mobile", label: "Mobile App Development" },
  { value: "ai", label: "AI / ML" },
  { value: "devops", label: "DevOps & Cloud" },
  { value: "web3", label: "Web3" },
];

type Status = "idle" | "loading" | "success" | "error";

const ContactSection = () => {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  // ── Form state ──────────────────────────────────────────────────────────────
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [errMsg, setErrMsg] = useState("");

  // ── Intersection animation ───────────────────────────────────────────────────
  useEffect(() => {
    const els = [
      { el: leftRef.current, delay: 0 },
      { el: rightRef.current, delay: 150 },
    ];
    els.forEach(({ el, delay }) => {
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              el.style.opacity = "1";
              el.style.transform = "translateY(0)";
            }, delay);
            observer.disconnect();
          }
        },
        { threshold: 0.1 },
      );
      observer.observe(el);
    });
  }, []);

  // ── Handlers ─────────────────────────────────────────────────────────────────
  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Basic validation
    if (!form.firstName.trim()) {
      setErrMsg("First name is required.");
      setStatus("error");
      return;
    }
    if (!form.email.trim()) {
      setErrMsg("Email address is required.");
      setStatus("error");
      return;
    }
    if (!form.subject) {
      setErrMsg("Please select a subject.");
      setStatus("error");
      return;
    }
    if (!form.message.trim()) {
      setErrMsg("Message cannot be empty.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrMsg("");

    try {
      // 1. Send Email via EmailJS
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          name: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email,
          phone: form.phone || "Not provided",
          subject: form.subject,
          message: form.message,
        },
        EMAILJS_PUBLIC_KEY,
      );

      // 2. Save log to Backend Database for Admin Dashboard
      try {
        await messageApi.createMessage({
          name: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email,
          phone: form.phone || "Not provided",
          subject: form.subject,
          message: form.message,
        });
      } catch (dbErr) {
        console.error("Database save error (non-fatal):", dbErr);
      }

      setStatus("success");
      // Reset form
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

      // Auto reset success after 5s
      setTimeout(() => setStatus("idle"), 5000);
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus("error");
      setErrMsg("Something went wrong. Please try again.");
    }
  }

  // ── Shared input class ────────────────────────────────────────────────────────
  const inputCls =
    "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#C89A3D]/60 focus:bg-white/8 transition-all duration-200";

  return (
    <section className="relative min-h-screen flex items-center py-32 overflow-hidden">
      {/* ── Background ── */}
      <div className="absolute inset-0 bg-[#0c1117]" />

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #C89A3D 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* Gold glows */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-[#C89A3D]/12 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-[#C89A3D]/08 rounded-full blur-[100px] pointer-events-none" />

      {/* Vertical accent line */}
      <div
        className="absolute top-0 bottom-0 w-px hidden lg:block"
        style={{
          left: "50%",
          background:
            "linear-gradient(to bottom, transparent, #C89A3D22, transparent)",
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* ── LEFT ── */}
          <div
            ref={leftRef}
            className="text-white"
            style={{
              opacity: 0,
              transform: "translateY(40px)",
              transition:
                "opacity 0.85s cubic-bezier(0.4,0,0.2,1), transform 0.85s cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            {/* Label */}
            <div className="inline-flex items-center gap-2 bg-white/8 border border-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-[#C89A3D] animate-pulse" />
              <span className="text-[#C89A3D] text-xs font-semibold uppercase tracking-widest">
                Contact Us
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 tracking-tight">
              Let's Build
              <br />
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, #C89A3D, #f0c46a, #C89A3D)",
                }}
              >
                Something Great
              </span>
            </h2>

            {/* Divider */}
            <div
              className="mb-8 h-px w-16 rounded-full"
              style={{
                background: "linear-gradient(to right, #C89A3D, transparent)",
              }}
            />

            <p className="text-slate-400 text-sm leading-relaxed max-w-md mb-10">
              Send us details about your project and feel free to ask questions.
              Our consultants will reach out to you shortly.
            </p>

            {/* Contact details */}
            <div className="space-y-4 mb-10">
              {contactDetails.map(({ icon: Icon, text }, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 group cursor-default"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-[#C89A3D]/40 group-hover:bg-[#C89A3D]/10 transition-all duration-300">
                    <Icon className="w-4 h-4 text-[#C89A3D]" />
                  </div>
                  <span className="text-slate-300 text-sm group-hover:text-white transition-colors duration-200">
                    {text}
                  </span>
                </div>
              ))}
            </div>

            {/* Social icons */}
            <div className="flex gap-3 flex-wrap">
              {socials.map((item, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label={item.label}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/8 border border-white/10 text-white transition-all duration-300 hover:bg-[#C89A3D] hover:border-[#C89A3D] hover:scale-110 hover:text-black"
                >
                  <span className="text-sm">{item.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* ── RIGHT: FORM ── */}
          <div
            ref={rightRef}
            style={{
              opacity: 0,
              transform: "translateY(40px)",
              transition:
                "opacity 0.85s cubic-bezier(0.4,0,0.2,1) 150ms, transform 0.85s cubic-bezier(0.4,0,0.2,1) 150ms",
            }}
          >
            <div className="bg-white/[0.04] border border-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
              {/* Form header */}
              <div className="mb-7">
                <h3 className="text-white text-xl font-bold">Send a Message</h3>
                <p className="text-slate-500 text-xs mt-1">
                  We'll get back to you within 24 hours.
                </p>
              </div>

              {/* ── Success State ── */}
              {status === "success" ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-400" />
                  </div>
                  <h4 className="text-white font-bold text-lg mb-2">
                    Message Sent!
                  </h4>
                  <p className="text-slate-400 text-sm">
                    Thanks for reaching out. We'll get back to you within 24
                    hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Error message */}
                  {status === "error" && errMsg && (
                    <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {errMsg}
                    </div>
                  )}

                  {/* Name row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      placeholder="First name *"
                      className={inputCls}
                    />
                    <input
                      type="text"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      placeholder="Last name"
                      className={inputCls}
                    />
                  </div>

                  {/* Email */}
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email Address *"
                    className={inputCls}
                  />

                  {/* Phone */}
                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className={inputCls}
                  />

                  {/* Subject */}
                  <select
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className={`${inputCls} ${form.subject ? "text-white" : "text-slate-500"} appearance-none`}
                    style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                  >
                    <option value="" disabled hidden className="bg-[#0c1117]">
                      Select a subject *
                    </option>
                    {SUBJECTS.map((s) => (
                      <option
                        key={s.value}
                        value={s.label}
                        className="bg-[#0c1117] text-white"
                      >
                        {s.label}
                      </option>
                    ))}
                  </select>

                  {/* Message */}
                  <textarea
                    rows={4}
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Your message *"
                    className={`${inputCls} resize-none`}
                  />

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full py-3.5 rounded-xl bg-[#C89A3D] hover:bg-[#b78930] text-white font-semibold text-sm transition-all duration-200 shadow-lg hover:shadow-[#C89A3D]/30 hover:shadow-xl flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-200" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
