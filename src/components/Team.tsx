import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Linkedin, Github, Twitter } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Team = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const membersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.team-member', {
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        scrollTrigger: {
          trigger: membersRef.current,
          start: 'top 80%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const team = [
    {
      name: 'Rajesh Kumar',
      role: 'CEO & Founder',
      bio: 'Visionary leader with 10+ years in tech',
    },
    {
      name: 'Priya Sharma',
      role: 'CTO',
      bio: 'Tech innovator and architecture expert',
    },
    {
      name: 'Amit Patel',
      role: 'Lead Developer',
      bio: 'Full-stack wizard with passion for code',
    },
    {
      name: 'Sneha Gupta',
      role: 'UX/UI Designer',
      bio: 'Creative mind behind beautiful interfaces',
    },
    {
      name: 'Vikram Singh',
      role: 'Project Manager',
      bio: 'Orchestrating success, one project at a time',
    },
  ];

  return (
    <section id="team" ref={sectionRef} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Meet Our Team
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            The minds behind everything, driving innovation and excellence
          </p>
        </div>

        <div
          ref={membersRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8"
        >
          {team.map((member, index) => (
            <div
              key={index}
              className="team-member group text-center"
            >
              <div className="relative mb-6">
                <div className="w-40 h-40 mx-auto rounded-full bg-gradient-to-br from-blue-400 to-slate-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl group-hover:shadow-2xl transition-all group-hover:scale-105">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {member.name}
              </h3>
              <div className="text-blue-600 font-medium mb-3">{member.role}</div>
              <p className="text-sm text-slate-600 mb-4">{member.bio}</p>
              <div className="flex justify-center gap-3">
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-blue-600 flex items-center justify-center transition-colors group"
                >
                  <Linkedin size={16} className="text-slate-600 group-hover:text-white" />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-blue-600 flex items-center justify-center transition-colors group"
                >
                  <Github size={16} className="text-slate-600 group-hover:text-white" />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-blue-600 flex items-center justify-center transition-colors group"
                >
                  <Twitter size={16} className="text-slate-600 group-hover:text-white" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
