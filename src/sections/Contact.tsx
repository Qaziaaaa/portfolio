import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
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
          gsap.fromTo('.contact-content', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' });
        },
        once: true,
      });
    });

    return () => { mm.revert(); };
  }, []);

  return (
    <section id="contact" ref={sectionRef}>
      <div className="wrap">
        <div className="closing tape contact-content">
          <span className="big">come say hi</span>
          <h2>Let&apos;s build something great.</h2>
          <p>
            I&apos;m open to internships, freelance projects, and collaboration opportunities. If you have an idea or need a developer — let&apos;s connect.
          </p>

          <div className="cta-row" style={{ justifyContent: 'center', marginBottom: 22 }}>
            <a
              href="https://wa.me/923141935787"
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
            >
              Let&apos;s Talk
            </a>
            <a
              href="https://www.linkedin.com/in/qazi-farhan-ahmad/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn ghost"
            >
              Connect on LinkedIn
            </a>
          </div>

          <a
            href="mailto:qazithekingston@gmail.com"
            style={{ fontFamily: 'var(--print)', color: 'var(--terra)', fontSize: '1rem' }}
          >
            qazithekingston@gmail.com
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;
