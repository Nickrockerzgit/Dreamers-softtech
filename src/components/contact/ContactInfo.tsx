import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
  FaEnvelope,
  FaGithub,
} from "react-icons/fa6";

const ContactSection = () => {
  return (
    <section className="relative min-h-screen flex items-center py-32 overflow-hidden">
      {/* TEXTURED BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1c1917] to-[#3a2a0f]" />

      {/* SOFT GOLD GLOWS */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-[#C89A3D]/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-[#C89A3D]/10 rounded-full blur-3xl" />

      {/* CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* LEFT CONTENT */}
          <div className="text-white">
            <h2 className="text-4xl font-bold leading-tight">
              GET IN TOUCH <br />
              <span className="text-[#C89A3D]">WITH US!</span>
            </h2>

            <div className="mt-6 space-y-4 text-sm text-slate-200">
              <p className="flex items-start gap-3">
                <span>📧</span> info@dreamerssofttech.com
              </p>
              <p className="flex items-start gap-3">
                <span>📍</span> 123 Tech Park, Cyber City, Bangalore, India
              </p>
              <p className="flex items-start gap-3">
                <span>📞</span> +91 98765 43210
              </p>
              <p className="mt-4 text-slate-300 max-w-md">
                Send us details about your project and feel free to ask
                questions. Our consultants will reach out shortly.
              </p>
            </div>

            {/* SOCIAL ICONS */}
            <div className="mt-6 flex gap-4">
              {[
                { icon: <FaFacebookF />, label: "Facebook" },
                { icon: <FaInstagram />, label: "Instagram" },
                { icon: <FaLinkedinIn />, label: "LinkedIn" },
                { icon: <FaXTwitter />, label: "X" },
                { icon: <FaGithub />, label: "GitHub" },
                { icon: <FaEnvelope />, label: "Email" },
              ].map((item, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label={item.label}
                  className="
                    w-11 h-11 flex items-center justify-center rounded-full
                    bg-white/10 backdrop-blur text-white
                    transition-all duration-300
                    hover:bg-[#C89A3D] hover:text-black hover:scale-110
                  "
                >
                  <span className="text-lg">{item.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="bg-white rounded-2xl shadow-2xl p-10">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="First name *"
                  className="input text-slate-900 placeholder:text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Last name *"
                  className="input text-slate-900 placeholder:text-slate-400"
                />
              </div>

              <input
                type="email"
                placeholder="Email Address *"
                className="input text-slate-900 placeholder:text-slate-400"
              />

              <input
                type="text"
                placeholder="Phone Number"
                className="input text-slate-900 placeholder:text-slate-400"
              />

              {/* SELECT FIXED */}
              <select
                defaultValue=""
                className="input text-slate-400"
                onChange={(e) => {
                  e.currentTarget.classList.remove("text-slate-400");
                  e.currentTarget.classList.add("text-slate-900");
                }}
              >
                <option value="" disabled hidden>
                  Please select subject
                </option>
                <option value="web">Web Development</option>
                <option value="mobile">Mobile App Development</option>
                <option value="ai">AI / ML</option>
                <option value="devops">DevOps</option>
                <option value="web3">Web3</option>
              </select>

              <textarea
                rows={4}
                placeholder="Message *"
                className="input resize-none text-slate-900 placeholder:text-slate-400"
              />

              <button
                type="submit"
                className="w-full py-4 rounded-full bg-[#C89A3D] text-white font-semibold hover:opacity-90 transition"
              >
                Submit Now
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
