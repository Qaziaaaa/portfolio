import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: '10+',  label: 'Projects Shipped' },
  { value: '25+',  label: 'GitHub Repos'    },
  { value: '299+', label: 'Contributions'   },
];

const bullets = [
  'Generate leads and increase conversions',
  'Automate workflows with AI integrations',
  'Deliver fast, reliable user experiences',
];

const About = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px)', () => {
      const triggers: ScrollTrigger[] = [];
      triggers.push(
        ScrollTrigger.create({
          trigger: sectionRef.current, start: 'top 75%', once: true,
          onEnter: () => {
            gsap.fromTo('.about-polaroid', { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: .9, ease: 'expo.out' });
            gsap.fromTo('.about-text-col', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .7, ease: 'expo.out', delay: .15 });
          }
        })
      );
      return () => triggers.forEach(t => t.kill());
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef}>
      <div className="wrap">
        <div className="grid2 about-inner" style={{ alignItems: 'center', gap: 40 }}>
          {/* Polaroid */}
          <div className="about-polaroid photo-wrap">
            <div className="polaroid" style={{ transform: 'rotate(-3deg)', maxWidth: 260, width: '100%' }}>
              <img src="/profile.webp" alt="Qazi Farhan Ahmad" loading="lazy" />
              <div className="cap">hi again 👋</div>
            </div>
          </div>

          {/* Text */}
          <div className="about-text-col">
            <span className="eyebrow">about me</span>
            <h2 style={{ fontSize: '1.9rem', margin: '4px 0 14px' }}>
              A developer who builds solutions, not just websites
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, color: 'var(--ink-soft)', fontSize: '.98rem', lineHeight: 1.65 }}>
              <p>I'm Qazi Farhan Ahmad — an AI-focused Full Stack Web Developer based in Peshawar, Pakistan, specializing in building modern, scalable, and high-performance web applications.</p>
              <p>I work with React, TypeScript, Node.js, and MongoDB to create production-ready systems with clean architecture, strong security, and optimized performance.</p>
              <p>I don't just build websites — I build solutions that help businesses:</p>
              <ul style={{ paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6, margin: 0 }}>
                {bullets.map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <span style={{ color: 'var(--coral)', marginTop: 2, flexShrink: 0 }}>▸</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p>Currently open to internships and freelance opportunities where I can contribute to real-world products and grow fast.</p>
            </div>

            <div style={{ marginTop: 24, display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
              <a className="btn ghost" href="https://www.linkedin.com/in/qazi-farhan-ahmad/" target="_blank" rel="noopener noreferrer">
                Work with me
              </a>
              <div className="statstrip">
                {stats.map(s => (
                  <span key={s.label} className="m">
                    <b>{s.value}</b> {s.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-inner { grid-template-columns: 1fr !important; text-align: center; }
          .about-polaroid { margin-bottom: 32px; }
          .about-text-col ul { align-items: center; }
          .about-text-col > div { justify-content: center; }
        }
      `}</style>
    </section>
  );
};

export default About;
