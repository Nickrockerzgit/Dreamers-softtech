import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Portfolio = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.portfolio-item', {
        scale: 0.8,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: projectsRef.current,
          start: 'top 80%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const projects = [
    {
      title: 'E-commerce Platform',
      category: 'Web Development',
      description: 'A comprehensive online shopping solution with advanced features',
      color: 'from-blue-400 to-blue-600',
    },
    {
      title: 'Healthcare App',
      category: 'Mobile Development',
      description: 'Patient management and telemedicine platform',
      color: 'from-teal-400 to-cyan-600',
    },
    {
      title: 'Financial Dashboard',
      category: 'Web Application',
      description: 'Real-time analytics and reporting system',
      color: 'from-slate-400 to-slate-600',
    },
    {
      title: 'Social Media Platform',
      category: 'Full Stack',
      description: 'Community-driven content sharing application',
      color: 'from-orange-400 to-red-500',
    },
    {
      title: 'Educational Portal',
      category: 'Web Development',
      description: 'Online learning management system',
      color: 'from-green-400 to-emerald-600',
    },
    {
      title: 'Food Delivery App',
      category: 'Mobile Development',
      description: 'On-demand food ordering and delivery solution',
      color: 'from-pink-400 to-rose-600',
    },
  ];

  return (
    <section id="portfolio" ref={sectionRef} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Our Portfolio
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Showcasing innovative software and digital solutions that deliver
            measurable business impact
          </p>
        </div>

        <div
          ref={projectsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {projects.map((project, index) => (
            <div
              key={index}
              className="portfolio-item group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
            >
              <div
                className={`aspect-[4/3] bg-gradient-to-br ${project.color} flex items-center justify-center relative`}
              >
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all"></div>
                <div className="relative z-10 text-white text-center p-6">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <ExternalLink className="w-8 h-8" />
                  </div>
                  <div className="text-sm font-medium mb-2 opacity-90">
                    {project.category}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{project.title}</h3>
                  <p className="text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {project.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
