import { useEffect, useRef } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
  FaEnvelope,
  FaGithub,
} from "react-icons/fa6";
import { Mail, MapPin, Phone, Send } from "lucide-react";

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

const ContactSection = () => {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

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

              <form className="space-y-4">
                {/* Name row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="First name *"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#C89A3D]/60 focus:bg-white/8 transition-all duration-200"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Last name *"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#C89A3D]/60 focus:bg-white/8 transition-all duration-200"
                    />
                  </div>
                </div>

                <input
                  type="email"
                  placeholder="Email Address *"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#C89A3D]/60 focus:bg-white/8 transition-all duration-200"
                />

                <input
                  type="text"
                  placeholder="Phone Number"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#C89A3D]/60 focus:bg-white/8 transition-all duration-200"
                />

                <select
                  defaultValue=""
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-500 focus:outline-none focus:border-[#C89A3D]/60 focus:bg-white/8 transition-all duration-200 appearance-none"
                  style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                  onChange={(e) => {
                    e.currentTarget.classList.remove("text-slate-500");
                    e.currentTarget.classList.add("text-white");
                  }}
                >
                  <option value="" disabled hidden className="bg-[#0c1117]">
                    Select a subject
                  </option>
                  <option value="web" className="bg-[#0c1117] text-white">
                    Web Development
                  </option>
                  <option value="mobile" className="bg-[#0c1117] text-white">
                    Mobile App Development
                  </option>
                  <option value="ai" className="bg-[#0c1117] text-white">
                    AI / ML
                  </option>
                  <option value="devops" className="bg-[#0c1117] text-white">
                    DevOps & Cloud
                  </option>
                  <option value="web3" className="bg-[#0c1117] text-white">
                    Web3
                  </option>
                </select>

                <textarea
                  rows={4}
                  placeholder="Your message *"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#C89A3D]/60 focus:bg-white/8 transition-all duration-200 resize-none"
                />

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#C89A3D] hover:bg-[#b78930] text-white font-semibold text-sm transition-all duration-200 shadow-lg hover:shadow-[#C89A3D]/30 hover:shadow-xl flex items-center justify-center gap-2 group"
                >
                  Send Message
                  <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-200" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
