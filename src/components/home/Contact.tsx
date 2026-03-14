import { useEffect, useRef, useState } from "react";
import { Mail, Phone, MapPin, Send, Clock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import emailjs from "@emailjs/browser";
import { messageApi } from "../../api/messageApi";

// ─── PASTE YOUR KEYS HERE ─────────────────────────────────────────────────────
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
// ─────────────────────────────────────────────────────────────────────────────

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "info@dreamerssofttech.com",
    href: "mailto:info@dreamerssofttech.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91 98765 43210",
    href: "tel:+919876543210",
  },
  {
    icon: MapPin,
    label: "Address",
    value:
      "Veda Business Park, 221, Bhawar Kaun\nIndore 452001, MadhyaPradesh India",
    href: null,
  },
];

const hours = [
  { day: "Monday – Friday", time: "9:00 AM – 7:00 PM" },
  { day: "Saturday", time: "10:00 AM – 5:00 PM" },
  { day: "Sunday", time: "Closed" },
];

type Status = "idle" | "loading" | "success" | "error";

const Contact = () => {
  const formRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  
  const [status, setStatus] = useState<Status>("idle");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    const els = [
      { el: headingRef.current, delay: 0 },
      { el: formRef.current, delay: 150 },
      { el: infoRef.current, delay: 300 },
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrMsg("Please fill in all required fields.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrMsg("");

    try {
      // 1. Send Email via EmailJS
      if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            name: formData.name.trim(),
            email: formData.email,
            phone: formData.phone || "Not provided",
            subject: "Home Page Contact Form Submission", 
            message: formData.message,
          },
          EMAILJS_PUBLIC_KEY,
        );
      } else {
        console.warn("EmailJS credentials not configured.");
      }

      // 2. Save log to Backend Database for Admin Dashboard
      try {
        await messageApi.createMessage({
          name: formData.name.trim(),
          email: formData.email,
          phone: formData.phone || "Not provided",
          subject: "Home Page Contact Form Submission",
          message: formData.message,
        });
      } catch (dbErr) {
        console.error("Database save error (non-fatal):", dbErr);
      }

      setStatus("success");
      setFormData({ name: "", email: "", phone: "", message: "" });
      setTimeout(() => setStatus("idle"), 5000);
    } catch (err) {
      console.error("Submission error:", err);
      setStatus("error");
      setErrMsg("Something went wrong. Please try again.");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const inputClass =
    "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#C89A3D]/60 focus:ring-2 focus:ring-[#C89A3D]/10 transition-all duration-200";

  const labelClass =
    "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5";

  return (
    <section id="contact" className="py-28 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div
          ref={headingRef}
          className="mb-16"
          style={{
            opacity: 0,
            transform: "translateY(28px)",
            transition:
              "opacity 0.8s cubic-bezier(0.4,0,0.2,1), transform 0.8s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-[#C89A3D]" />
            <span className="text-xs uppercase tracking-widest text-[#C89A3D] font-semibold">
              Reach Out
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Get in <span className="text-[#C89A3D]">Touch</span>
            </h2>
            <p className="text-gray-500 text-sm max-w-md leading-relaxed">
              Let's discuss how we can help transform your business with
              innovative digital solutions.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* ── LEFT: Form ── */}
          <div
            ref={formRef}
            style={{
              opacity: 0,
              transform: "translateY(40px)",
              transition:
                "opacity 0.85s cubic-bezier(0.4,0,0.2,1) 150ms, transform 0.85s cubic-bezier(0.4,0,0.2,1) 150ms",
            }}
          >
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Send a Message
              </h3>
              <p className="text-xs text-gray-400 mb-7">
                We'll get back to you within 24 hours.
              </p>

              {status === "success" ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-[#C89A3D]/10 border border-[#C89A3D]/20 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8 text-[#C89A3D]" />
                  </div>
                  <h4 className="text-gray-900 font-bold text-lg mb-2">
                    Message Sent!
                  </h4>
                  <p className="text-gray-500 text-sm">
                    Thanks for reaching out. We'll get back to you within 24
                    hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {status === "error" && errMsg && (
                    <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {errMsg}
                    </div>
                  )}
                  
                  <div>
                    <label htmlFor="name" className={labelClass}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className={labelClass}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className={labelClass}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className={labelClass}>
                      Your Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Tell us about your project..."
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full py-3.5 bg-[#C89A3D] hover:bg-[#b78930] disabled:opacity-70 disabled:hover:bg-[#C89A3D] disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm transition-all duration-200 shadow hover:shadow-lg hover:shadow-[#C89A3D]/25 flex items-center justify-center gap-2 group"
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

          {/* ── RIGHT: Info ── */}
          <div
            ref={infoRef}
            className="space-y-5"
            style={{
              opacity: 0,
              transform: "translateY(40px)",
              transition:
                "opacity 0.85s cubic-bezier(0.4,0,0.2,1) 300ms, transform 0.85s cubic-bezier(0.4,0,0.2,1) 300ms",
            }}
          >
            {/* Contact details card */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                Contact Information
              </h3>
              <div className="space-y-5">
                {contactInfo.map(({ icon: Icon, label, value, href }, i) => (
                  <div key={i} className="flex items-start gap-4 group">
                    <div className="w-11 h-11 rounded-xl bg-[#C89A3D]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#C89A3D]/20 transition-colors duration-300">
                      <Icon className="w-4 h-4 text-[#C89A3D]" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-0.5">
                        {label}
                      </p>
                      {href ? (
                        <a
                          href={href}
                          className="text-sm text-gray-700 hover:text-[#C89A3D] transition-colors duration-200 font-medium"
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                          {value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Business hours card */}
            <div className="bg-[#0c1117] rounded-3xl p-8 text-white relative overflow-hidden">
              {/* Dot grid */}
              <div
                className="absolute inset-0 opacity-[0.05] pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, #C89A3D 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                }}
              />
              {/* Gold top border */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background:
                    "linear-gradient(to right, transparent, #C89A3D, transparent)",
                }}
              />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-[#C89A3D]/15 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-[#C89A3D]" />
                  </div>
                  <h3 className="text-base font-bold">Business Hours</h3>
                </div>

                <div className="space-y-3">
                  {hours.map(({ day, time }, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center text-sm"
                    >
                      <span className="text-slate-400">{day}</span>
                      <span
                        className={`font-semibold ${time === "Closed" ? "text-red-400" : "text-[#C89A3D]"}`}
                      >
                        {time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick CTA */}
            <div className="bg-gradient-to-br from-[#C89A3D] to-[#b78930] rounded-3xl p-6 text-white">
              <p className="text-sm font-bold mb-1">
                Ready to start a project?
              </p>
              <p className="text-xs opacity-80 mb-4">
                Our consultants are available for a free 30-minute discovery
                call.
              </p>
              <button className="w-full bg-white text-[#C89A3D] text-xs font-bold py-2.5 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                Book a Free Call →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
