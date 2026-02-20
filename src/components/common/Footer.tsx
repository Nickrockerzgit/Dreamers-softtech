import { Facebook, Twitter, Linkedin, Instagram, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Dreamers Softtech LLP</h3>
            <p className="text-slate-400 mb-4">
              Transforming ideas into powerful digital solutions that drive business
              growth and innovation.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 bg-slate-800 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-slate-800 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-slate-800 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-slate-800 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-slate-400 hover:text-white transition">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="text-slate-400 hover:text-white transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="#services" className="text-slate-400 hover:text-white transition">
                  Services
                </a>
              </li>
              <li>
                <a href="#portfolio" className="text-slate-400 hover:text-white transition">
                  Portfolio
                </a>
              </li>
              <li>
                <a href="#contact" className="text-slate-400 hover:text-white transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li className="text-slate-400">Web Development</li>
              <li className="text-slate-400">Mobile Development</li>
              <li className="text-slate-400">UI/UX Design</li>
              <li className="text-slate-400">E-commerce Solutions</li>
              <li className="text-slate-400">AI/ML Development</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
            <p className="text-slate-400 mb-4">
              Subscribe to get the latest updates and news.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-white"
              />
              <button className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                <Mail size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 text-center">
          <p className="text-slate-400">
            &copy; {currentYear} Dreamers Softtech LLP. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
