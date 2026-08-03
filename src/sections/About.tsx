import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: '10+', label: 'Projects Shipped' },
  { value: '25+', label: 'GitHub Repos' },
  { value: '299+', label: 'Contributions' },
];

const About = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px)', () => {
      const triggers: ScrollTrigger[] = [];

      triggers.push(
        ScrollTrigger.create({
          trigger: section,
          start: 'top 75%',
          onEnter: () => {
            gsap.fromTo('.about-polaroid',
              { opacity: 0, rotate: 0, x: -40 },
              { opacity: 1, rotate: -2, x: 0, duration: 0.9, ease: 'expo.out' }
            );
          },
          once: true,
        }),
        ScrollTrigger.create({
          trigger: section,
          start: 'top 70%',
          onEnter: () => {
            gsap.fromTo('.about-label',
              { opacity: 0, y: 15 },
              { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out' }
            );
            gsap.fromTo('.about-heading',
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out', delay: 0.1 }
            );
          },
          once: true,
        }),
        ScrollTrigger.create({
          trigger: section,
          start: 'top 65%',
          onEnter: () => {
            gsap.fromTo('.about-paragraph',
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: 'expo.out', delay: 0.2 }
            );
          },
          once: true,
        }),
        ScrollTrigger.create({
          trigger: section,
          start: 'top 60%',
          onEnter: () => {
            gsap.fromTo('.about-stat-card',
              { opacity: 0, y: 20, scale: 0.95 },
              { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1, ease: 'expo.out', delay: 0.3 }
            );
          },
          once: true,
        })
      );

      return () => { triggers.forEach(t => t.kill()); };
    });

    return () => { mm.revert(); };
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="bg-cream-200/50 py-24"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image column */}
          <div className="flex justify-center">
            <div className="about-polaroid bg-white p-3 pb-10 shadow-[0_8px_40px_rgba(0,0,0,0.10)] -rotate-2 rounded-sm">
              <img
                src="/profile.webp"
                alt="Qazi Farhan Ahmad"
                className="w-72 aspect-[3/4] object-cover rounded-sm"
                loading="lazy"
              />
              <p className="font-hand text-center mt-3 text-charcoal-800 text-lg">
                hi again 👋
              </p>
            </div>
          </div>

          {/* Content column */}
          <div>
            <p className="about-label font-hand text-terra-500 text-xl mb-2">about me</p>
            <h2 className="about-heading font-serif text-4xl font-semibold text-charcoal-900 mb-6 leading-tight">
              A developer who builds solutions, not just websites
            </h2>

            <div className="space-y-4 text-charcoal-800/70 leading-relaxed">
              <p className="about-paragraph">
                I'm Qazi Farhan Ahmad — an AI-focused Full Stack Web Developer based in Peshawar, Pakistan, specializing in building modern, scalable, and high-performance web applications.
              </p>
              <p className="about-paragraph">
                I work with React, TypeScript, Node.js, and MongoDB to create production-ready systems with clean architecture, strong security, and optimized performance.
              </p>
              <p className="about-paragraph">
                I don't just build websites — I build solutions that help businesses:
              </p>
              <ul className="about-paragraph space-y-2 pl-1">
                {[
                  'Generate leads and increase conversions',
                  'Automate workflows with AI integrations',
                  'Deliver fast, reliable user experiences',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-terra-500 mt-1 shrink-0">▸</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="about-paragraph">
                Currently open to internships and freelance opportunities where I can contribute to real-world products and grow fast.
              </p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="about-stat-card bg-white rounded-2xl p-4 text-center shadow-warm border border-cream-300"
                >
                  <div className="font-serif text-2xl font-semibold text-charcoal-900">
                    {stat.value}
                  </div>
                  <div className="text-xs text-charcoal-800/60 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
