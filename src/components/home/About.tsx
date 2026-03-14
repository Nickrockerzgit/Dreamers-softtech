import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import aboutBg from "../../assets/about-bg.png";
import aboutBg2 from "../../assets/about-bg2.png";
import { usePublicStats } from "../../hooks/usePublicStats";

const highlights = [
  "Custom software tailored to your business needs",
  "Expert team of developers and designers",
  "End-to-end support from ideation to deployment",
  "Transparent communication and agile delivery",
];

const About = () => {
  const { stats } = usePublicStats();

  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = [
      { el: contentRef.current },
      { el: imageRef.current },
    ];

    els.forEach(({ el }) => {
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            el.style.opacity = "1";
            el.style.transform = "translateX(0) translateY(0)";
            observer.disconnect();
          }
        },
        { threshold: 0.15 },
      );
      observer.observe(el);
    });

    if (statsRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            statsRef.current!.style.opacity = "1";
            statsRef.current!.style.transform = "translateY(0)";
            observer.disconnect();
          }
        },
        { threshold: 0.2 },
      );
      observer.observe(statsRef.current);
    }
  }, []);

  const statCards = [
    { value: `${stats?.projectsCompleted || 0}+`, label: "Projects Delivered" },
    { value: `${stats?.happyClients || 0}+`, label: "Happy Clients" },
    { value: `${stats?.yearsExperience || 1}+`, label: "Years Experience" },
    { value: `${stats?.satisfactionRate || 98}%`, label: "Satisfaction Rate" },
  ];

  return (
    <section id="about" className="relative py-28 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${aboutBg2})` }}
      />
      <div className="absolute inset-0 bg-gray-50/90" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* ── LEFT: Content ── */}
          <div
            ref={contentRef}
            style={{
              opacity: 0,
              transform: "translateX(-32px)",
              transition:
                "opacity 0.9s cubic-bezier(0.4,0,0.2,1), transform 0.9s cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            {/* Label */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-[#C89A3D]" />
              <span className="text-xs uppercase tracking-widest text-[#C89A3D] font-semibold">
                About Us
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
              Who We <span className="text-[#C89A3D]">Are?</span>
            </h2>

            <p className="text-gray-500 text-base leading-relaxed mb-4">
              Dreamers Softtech LLP is the foundation of professional and
              innovative digital solutions. Our mission is to empower businesses
              through cutting-edge technology and strategic development.
            </p>
            <p className="text-gray-500 text-base leading-relaxed mb-8">
              We don't just build software — we build lasting partnerships that
              help businesses thrive and scale in the digital landscape.
            </p>

            {/* Highlights */}
            <ul className="space-y-3 mb-10">
              {highlights.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#C89A3D] mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 text-sm">{item}</span>
                </li>
              ))}
            </ul>

            <Link to="/about">
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-[#C89A3D] hover:bg-[#b78930] text-white font-semibold rounded-xl text-sm transition-all duration-200 shadow hover:shadow-lg hover:shadow-[#C89A3D]/25 group">
                Learn More About Us
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </Link>
          </div>

          {/* ── RIGHT: Image ── */}
          <div
            ref={imageRef}
            className="relative"
            style={{
              opacity: 0,
              transform: "translateX(32px)",
              transition:
                "opacity 0.9s cubic-bezier(0.4,0,0.2,1) 150ms, transform 0.9s cubic-bezier(0.4,0,0.2,1) 150ms",
            }}
          >
            {/* Main image */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/5]">
              <img
                src={aboutBg}
                alt="About Dreamers Softtech"
                className="w-full h-full object-cover"
              />
              {/* Gradient overlay at bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>

            {/* Floating experience badge */}
            <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl px-5 py-4 border border-gray-100">
              <p className="text-3xl font-extrabold text-[#C89A3D] leading-none">
                {stats?.yearsExperience || 1}+
              </p>
              <p className="text-xs text-gray-500 mt-1 font-medium">
                Years of
                <br />
                Excellence
              </p>
            </div>

            {/* Floating projects badge */}
            <div className="absolute -top-5 -right-5 bg-[#C89A3D] rounded-2xl shadow-xl px-5 py-4 text-white">
              <p className="text-3xl font-extrabold leading-none">{stats?.projectsCompleted || 0}+</p>
              <p className="text-xs opacity-80 mt-1 font-medium">
                Projects
                <br />
                Delivered
              </p>
            </div>

            {/* Gold border accent */}
            <div className="absolute inset-0 rounded-3xl ring-1 ring-[#C89A3D]/20 pointer-events-none" />
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div
          ref={statsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20"
          style={{
            opacity: 0,
            transform: "translateY(32px)",
            transition:
              "opacity 0.9s cubic-bezier(0.4,0,0.2,1) 300ms, transform 0.9s cubic-bezier(0.4,0,0.2,1) 300ms",
          }}
        >
          {statCards.map((s, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 px-6 py-6 shadow-sm hover:shadow-md hover:border-[#C89A3D]/20 transition-all duration-300 text-center group"
            >
              <p className="text-3xl font-extrabold text-[#C89A3D] group-hover:scale-110 transition-transform duration-300 origin-center">
                {s.value}
              </p>
              <p className="text-gray-500 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
