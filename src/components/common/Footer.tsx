import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  MapPin,
  Phone,
  ArrowRight,
} from "lucide-react";

const quickLinks = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

const services = [
  "Web Development",
  "Mobile Development",
  "UI/UX Design",
  "E-commerce Solutions",
  "AI / ML Development",
  "DevOps & Cloud",
];

const socials = [
  { icon: <Facebook size={16} />, label: "Facebook" },
  { icon: <Twitter size={16} />, label: "Twitter" },
  { icon: <Linkedin size={16} />, label: "LinkedIn" },
  { icon: <Instagram size={16} />, label: "Instagram" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#0c1117] text-white overflow-hidden">
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, #C89A3D 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* Gold top border */}
      <div
        className="w-full h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, #C89A3D, transparent)",
        }}
      />

      {/* Gold glow top-left */}
      <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-[#C89A3D]/08 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">
          {/* Col 1 — Brand */}
          <div className="lg:col-span-1">
            {/* Logo / name */}
            <div className="mb-5">
              <h3 className="text-xl font-extrabold tracking-tight">
                Dreamers{" "}
                <span
                  className="text-transparent bg-clip-text"
                  style={{
                    backgroundImage: "linear-gradient(90deg, #C89A3D, #f0c46a)",
                  }}
                >
                  Softtech
                </span>
              </h3>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-0.5">
                LLP
              </p>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Transforming ideas into powerful digital solutions that drive
              business growth and innovation.
            </p>

            {/* Contact details */}
            <div className="space-y-2.5 mb-6">
              {[
                { icon: Mail, text: "info@dreamerssofttech.com" },
                { icon: Phone, text: "+91 98765 43210" },
                { icon: MapPin, text: "Bangalore, India" },
              ].map(({ icon: Icon, text }, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 text-slate-400 text-xs"
                >
                  <Icon className="w-3.5 h-3.5 text-[#C89A3D] flex-shrink-0" />
                  {text}
                </div>
              ))}
            </div>

            {/* Socials */}
            <div className="flex gap-2">
              {socials.map((s, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-[#C89A3D] hover:border-[#C89A3D] hover:text-white transition-all duration-300 hover:scale-110"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Quick Links */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-5 h-px bg-[#C89A3D]" />
              <h4 className="text-xs uppercase tracking-widest text-[#C89A3D] font-semibold">
                Navigate
              </h4>
            </div>
            <h4 className="text-base font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="group flex items-center gap-1.5 text-slate-400 hover:text-[#C89A3D] text-sm transition-colors duration-200"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Services */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-5 h-px bg-[#C89A3D]" />
              <h4 className="text-xs uppercase tracking-widest text-[#C89A3D] font-semibold">
                What We Do
              </h4>
            </div>
            <h4 className="text-base font-bold mb-4">Services</h4>
            <ul className="space-y-2.5">
              {services.map((s) => (
                <li
                  key={s}
                  className="flex items-center gap-1.5 text-slate-400 text-sm hover:text-[#C89A3D] transition-colors duration-200 cursor-default"
                >
                  <div className="w-1 h-1 rounded-full bg-[#C89A3D]/50 flex-shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Newsletter */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-5 h-px bg-[#C89A3D]" />
              <h4 className="text-xs uppercase tracking-widest text-[#C89A3D] font-semibold">
                Stay Updated
              </h4>
            </div>
            <h4 className="text-base font-bold mb-2">Newsletter</h4>
            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              Subscribe to get the latest updates, articles, and news delivered
              to your inbox.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 min-w-0 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#C89A3D]/50 focus:bg-white/8 transition-all duration-200"
              />
              <button className="px-3.5 py-2.5 bg-[#C89A3D] hover:bg-[#b78930] rounded-xl transition-all duration-200 flex-shrink-0 hover:shadow-lg hover:shadow-[#C89A3D]/25">
                <Mail size={16} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="mt-6 flex flex-wrap gap-2">
              {["120+ Projects", "98% Satisfaction", "6+ Years"].map(
                (badge) => (
                  <span
                    key={badge}
                    className="text-[10px] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400"
                  >
                    {badge}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          <p className="text-slate-500 text-xs">
            © {currentYear}{" "}
            <span className="text-slate-400 font-medium">
              Dreamers Softtech LLP
            </span>
            . All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <a
              href="#"
              className="hover:text-[#C89A3D] transition-colors duration-200"
            >
              Privacy Policy
            </a>
            <div className="w-px h-3 bg-slate-700" />
            <a
              href="#"
              className="hover:text-[#C89A3D] transition-colors duration-200"
            >
              Terms of Service
            </a>
            <div className="w-px h-3 bg-slate-700" />
            <a
              href="#"
              className="hover:text-[#C89A3D] transition-colors duration-200"
            >
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
