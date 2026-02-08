import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Testimonials = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.testimonial-card', {
        y: 80,
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

  const testimonials = [
    {
      name: 'Rohit Verma',
      company: 'TechStart Solutions',
      role: 'CEO',
      text: 'Dreamers Softtech delivered exceptional results. Their team understood our vision and transformed it into a powerful digital solution. Highly recommended!',
    },
    {
      name: 'Anjali Mehta',
      company: 'E-Commerce Pro',
      role: 'Founder',
      text: 'Outstanding work! They built our e-commerce platform from scratch and it exceeded all expectations. Professional, timely, and innovative.',
    },
    {
      name: 'Karan Desai',
      company: 'HealthCare Plus',
      role: 'Product Manager',
      text: 'The mobile app they developed has transformed our patient engagement. Their attention to detail and commitment to quality is unmatched.',
    },
    {
      name: 'Neha Kapoor',
      company: 'FinTech Innovations',
      role: 'CTO',
      text: 'Working with Dreamers Softtech was a game-changer for us. Their technical expertise and problem-solving abilities are top-notch.',
    },
    {
      name: 'Siddharth Rao',
      company: 'Digital Marketing Hub',
      role: 'Director',
      text: 'They delivered our project on time and within budget. The team was responsive, skilled, and a pleasure to work with throughout the process.',
    },
  ];

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="py-20 bg-gradient-to-br from-slate-50 to-blue-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Proven success stories driving business transformation
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="testimonial-card bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 relative"
            >
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <Quote className="w-6 h-6 text-white" />
              </div>
              <p className="text-slate-600 leading-relaxed mb-6 italic">
                "{testimonial.text}"
              </p>
              <div className="border-t border-slate-200 pt-6">
                <div className="font-bold text-slate-900 text-lg">
                  {testimonial.name}
                </div>
                <div className="text-blue-600 font-medium">{testimonial.role}</div>
                <div className="text-sm text-slate-500">{testimonial.company}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
