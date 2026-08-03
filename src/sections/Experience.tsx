import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const experiences = [
  {
    title: 'Full Stack Developer',
    company: 'Freelance & Open Source',
    period: '2023 – Present',
    description: 'Built and deployed full-stack web applications including e-commerce platforms with Stripe payments, OTP authentication, real-time inventory, and admin dashboards. Focused on scalable architecture, security-first development, and clean TypeScript code.',
    emoji: '💻',
  },
  {
    title: 'BS Software Engineering',
    company: 'University of Peshawar',
    period: '2023 – Present',
    description: '4th Semester — building a strong foundation in software engineering principles, data structures, algorithms, and system design. Applying academic knowledge directly to real-world projects and open source contributions.',
    emoji: '🎓',
  },
  {
    title: 'Self-Taught Frontend Developer',
    company: 'Independent Learning',
    period: '2022 – 2023',
    description: 'Mastered React, TypeScript, and modern frontend tooling through hands-on project building. Developed a strong eye for design, animation, and responsive layouts.',
    emoji: '🚀',
  },
];

const Experience = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px)', () => {
      ScrollTrigger.create({
        trigger: sectionRef.current, start: 'top 78%', once: true,
        onEnter: () => {
          gsap.fromTo('.exp-header', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .6, ease: 'expo.out' });
          gsap.fromTo('.exp-card',   { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: .55, stagger: .12, ease: 'expo.out', delay: .15, clearProps: 'transform' });
        },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="experience" ref={sectionRef}>
      <div className="wrap">
        <div className="sec-head exp-header">
          <span className="eyebrow">my journey</span>
          <h2>Education &amp; Experience</h2>
          <p>How I got here — the roles, studies, and skills that shaped how I build for the real world.</p>
        </div>

        <div className="grid3">
          {experiences.map((exp, i) => (
            <div key={i} className="exp-card fcard" style={{ borderTop: '4px solid var(--coral)' }}>
              <span className="ic">{exp.emoji}</span>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
                <h3 style={{ margin: 0 }}>{exp.title}</h3>
                <span style={{
                  fontFamily: 'var(--print)', fontSize: '.82rem',
                  color: 'var(--terra)', background: 'var(--paper)',
                  border: '1px solid var(--line)', borderRadius: 20, padding: '3px 12px',
                  whiteSpace: 'nowrap',
                }}>
                  {exp.period}
                </span>
              </div>
              <p style={{ fontFamily: 'var(--print)', color: 'var(--terra)', fontSize: '.9rem', marginBottom: 10 }}>{exp.company}</p>
              <p style={{ margin: 0 }}>{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
