import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Code2,
  Smartphone,
  Palette,
  ShoppingCart,
  Image,
  Brain,
  CheckCircle,
  Headphones,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Services = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.service-card', {
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: cardsRef.current,
          start: 'top 80%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const services = [
    {
      icon: Code2,
      title: 'Web Development',
      description:
        'Custom web applications built with modern technologies for optimal performance',
    },
    {
      icon: Smartphone,
      title: 'Mobile Development',
      description:
        'Native and cross-platform mobile apps that deliver exceptional user experiences',
    },
    {
      icon: Palette,
      title: 'UI/UX Development',
      description:
        'Beautiful, intuitive interfaces designed to engage and delight your users',
    },
    {
      icon: ShoppingCart,
      title: 'E-commerce Development',
      description:
        'Scalable online stores with secure payment integration and inventory management',
    },
    {
      icon: Image,
      title: 'Social Graphic Development',
      description:
        'Eye-catching graphics and visual content for social media platforms',
    },
    {
      icon: Brain,
      title: 'AI/ML',
      description:
        'Intelligent solutions powered by machine learning and artificial intelligence',
    },
    {
      icon: CheckCircle,
      title: 'Quality Assurance',
      description:
        'Comprehensive testing to ensure flawless functionality and user experience',
    },
    {
      icon: Headphones,
      title: 'Dedicated Support',
      description:
        '24/7 technical support and maintenance to keep your systems running smoothly',
    },
  ];

  return (
    <section
      id="services"
      ref={sectionRef}
      className="py-20 bg-gradient-to-br from-slate-50 to-blue-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Our Services
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Delivering end-to-end software, web, and mobile solutions that accelerate
            business innovation
          </p>
        </div>

        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="service-card group bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-slate-100"
              >
                <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                  <Icon className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
