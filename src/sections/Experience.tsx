import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Code, Database, Layout } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const experiences = [
  {
    title: 'Full Stack Developer',
    company: 'Freelance & Open Source',
    period: '2023 - Present',
    description:
      'Built and deployed full-stack web applications including e-commerce platforms with Stripe payments, OTP authentication, real-time inventory, and admin dashboards. Focused on scalable architecture, security-first development, performance optimization, and clean maintainable code.',
    icon: Code,
  },
  {
    title: 'BS Software Engineering',
    company: 'University of Peshawar',
    period: '2023 - Present',
    description:
      'Currently in 4th Semester — building a strong foundation in software engineering principles, data structures, algorithms, and system design. Applying academic knowledge directly to real-world projects and open source contributions.',
    icon: Database,
  },
  {
    title: 'Self-Taught Frontend Developer',
    company: 'Independent Learning',
    period: '2022 - 2023',
    description:
      'Mastered React, TypeScript, and modern frontend tooling through hands-on project building. Developed a strong eye for design, animation, and responsive layouts — building portfolio sites, agency landing pages, and UI-heavy applications.',
    icon: Layout,
  },
];

const Experience = () => {
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
          start: 'top 80%',
          onEnter: () => {
            gsap.fromTo('.experience-header',
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' }
            );
          },
          once: true,
        })
      );

      const cards = gsap.utils.toArray('.experience-card') as HTMLElement[];
      cards.forEach((card) => {
        triggers.push(
          ScrollTrigger.create({
            trigger: card,
            start: 'top 85%',
            onEnter: () => {
              gsap.fromTo(card,
                { opacity: 0, y: 40 },
                { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' }
              );
            },
            once: true,
          })
        );
      });

      return () => { triggers.forEach(t => t.kill()); };
    });

    return () => { mm.revert(); };
  }, []);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="bg-cream-100 py-24"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="experience-header text-center mb-16">
          <p className="font-hand text-terra-500 text-xl mb-2">journey</p>
          <h2 className="font-serif text-4xl sm:text-5xl font-semibold text-charcoal-900">
            Education &amp; Experience
          </h2>
        </div>

        {/* Timeline Cards */}
        <div className="max-w-4xl mx-auto space-y-6">
          {experiences.map((exp, index) => {
            const Icon = exp.icon;
            return (
              <div
                key={index}
                className="experience-card bg-white rounded-2xl p-6 sm:p-8 border-l-4 border-terra-500 shadow-warm hover:shadow-warm-lg transition-shadow duration-300"
              >
                <div className="flex flex-col md:flex-row gap-5 items-start md:items-center">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-terra-500/10 flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6 text-terra-500" />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-1.5">
                      <h3 className="font-serif text-xl font-semibold text-charcoal-900">
                        {exp.title}
                      </h3>
                      <span className="text-xs font-medium text-charcoal-800 px-3 py-1 bg-cream-200 rounded-full mt-2 md:mt-0 w-fit border border-cream-300">
                        {exp.period}
                      </span>
                    </div>
                    <h4 className="text-sm font-medium text-terra-500 mb-3">{exp.company}</h4>
                    <p className="text-charcoal-800/70 leading-relaxed text-sm sm:text-base">
                      {exp.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Experience;
