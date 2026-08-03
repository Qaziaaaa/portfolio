import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reasons = [
  {
    emoji: '🧹',
    title: 'Clean, Scalable Code',
    description: 'Every project is built with maintainability in mind — typed, documented, and structured for growth.',
  },
  {
    emoji: '⏱️',
    title: 'Fast & Reliable Delivery',
    description: 'I ship on time without cutting corners. Production-ready from day one.',
  },
  {
    emoji: '✨',
    title: 'Modern UI/UX Design',
    description: 'Pixel-perfect interfaces that look great and feel intuitive on every device.',
  },
  {
    emoji: '🤖',
    title: 'AI-Powered Solutions',
    description: 'I integrate AI tools — chatbots, automation, smart APIs — to give your product a real edge.',
  },
  {
    emoji: '🛡️',
    title: 'Security-First Mindset',
    description: 'JWT auth, CSRF protection, rate limiting, input validation — security is never an afterthought.',
  },
  {
    emoji: '💬',
    title: 'Clear Communication',
    description: "You always know what's happening. Regular updates, honest timelines, no surprises.",
  },
];

const WhyWorkWithMe = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px)', () => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 80%',
        onEnter: () => {
          gsap.fromTo('.why-header', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' });
          gsap.fromTo('.why-card', { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'expo.out', delay: 0.2 });
        },
        once: true,
      });
    });

    return () => { mm.revert(); };
  }, []);

  return (
    <section id="testimonials" ref={sectionRef}>
      <div className="wrap">
        <div className="sec-head why-header">
          <span className="eyebrow">why choose me</span>
          <h2>Why Work With Me</h2>
          <p>What you get when you work with Qazi Farhan Ahmad</p>
        </div>

        <div className="grid3">
          {reasons.map((reason, i) => (
            <div key={i} className="why-card fcard">
              <span className="ic">{reason.emoji}</span>
              <h3>{reason.title}</h3>
              <p style={{ margin: 0 }}>{reason.description}</p>
            </div>
          ))}
        </div>

        <div className="center" style={{ marginTop: 40 }}>
          <p style={{ color: 'var(--ink-soft)', fontSize: '.95rem', marginBottom: 18 }}>
            Currently open to internships, freelance projects, and collaborations.
          </p>
          <a
            href="https://wa.me/923141935787"
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
            style={{ fontSize: '.95rem' }}
          >
            Let&apos;s Build Something Together →
          </a>
        </div>
      </div>
    </section>
  );
};

export default WhyWorkWithMe;
