import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(contentRef.current, {
        x: -100,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
        },
      });

      gsap.from(imageRef.current, {
        x: 100,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-16 text-center">
          Who We Are?
        </h2>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div ref={contentRef}>
            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              Dreamers Softtech LLP is the foundation of professional and innovative
              digital solutions. Our mission is to empower businesses through
              cutting-edge technology and strategic development.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              We specialize in creating custom software, web applications, and mobile
              solutions that drive growth and efficiency. With our team of expert
              developers and designers, we transform ideas into reality.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              Our commitment to excellence and client satisfaction sets us apart. We
              don't just build software; we build lasting partnerships that help
              businesses thrive in the digital landscape.
            </p>
            <div className="flex gap-8 mt-8">
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
                <div className="text-slate-600">Projects Delivered</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">40+</div>
                <div className="text-slate-600">Happy Clients</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">5+</div>
                <div className="text-slate-600">Years Experience</div>
              </div>
            </div>
          </div>

          <div ref={imageRef} className="relative">
            <div className="aspect-square bg-gradient-to-br from-blue-100 to-slate-100 rounded-2xl shadow-2xl flex items-center justify-center">
              <div className="text-center p-8">
                <div className="text-6xl mb-4">💡</div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">
                  Innovation Driven
                </h3>
                <p className="text-slate-600">
                  Transforming ideas into powerful digital solutions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
