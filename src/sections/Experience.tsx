import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Doodle from '../components/Doodle';

gsap.registerPlugin(ScrollTrigger);

const experiences = [
  {
    title: 'Full-Stack Engineer & Team Lead',
    company: 'Saylani Tech Labs',
    period: 'Jul 2026 – Present',
    description: 'Leading team collaboration, task distribution, and development workflow. Building and integrating full-stack features across frontend and backend. Contributing to system architecture, technical decisions, and problem-solving.',
    emoji: '💼',
  },
  {
    title: 'MERN Stack Team Lead',
    company: 'Ads Results 24/7',
    period: 'May 2026 – Present',
    description: 'Leading a small MERN stack team on live client deliverables. Owning sprint scope and code review, shipping features on schedule. Remote role based in Lahore.',
    emoji: '🚀',
  },
  {
    title: 'Core Team Member',
    company: 'Computing Students Society (CSS UOP)',
    period: 'Feb 2026 – Present',
    description: 'Built and shipped the CSS Society UOP Portal (cssuop.org) as part of a student dev team — frontend ownership from wireframe to deployment.',
    emoji: '🎓',
  },
  {
    title: 'Freelance Web Developer',
    company: 'Digital Dream Web and Graphic',
    period: 'Jan 2025 – Present',
    description: 'Delivering client websites end-to-end on the React/MERN stack and integrating AI-based features into builds. Remote work.',
    emoji: '💻',
  },
  {
    title: 'BS Software Engineering',
    company: 'University of Peshawar',
    period: '2024 – 2028',
    description: 'Building a strong foundation in software engineering principles, data structures, algorithms, and system design.',
    emoji: '📖',
  },
  {
    title: 'MERN Stack Development',
    company: 'Saylani Mass IT Training (SMIT)',
    period: 'Dec 2024 – Apr 2026',
    description: '15-Month intensive Web & Mobile App Development course. Graduated with hands-on MERN stack expertise.',
    emoji: '🏅',
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
            <div key={i} className="exp-card fcard">
              <span className="ic"><Doodle emoji={exp.emoji} /></span>
              <span className="exp-period">{exp.period}</span>
              <h3>{exp.title}</h3>
              <p className="exp-company">{exp.company}</p>
              <p>{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
