import { useEffect } from 'react';
import { gsap } from 'gsap';
import { FileDown } from 'lucide-react';

const stats = [
  { value: '10+',  label: 'Projects Shipped' },
  { value: '25+',  label: 'GitHub Repos'    },
  { value: '299+', label: 'Contributions'   },
];

const Hero = () => {
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px)', () => {
      const tl = gsap.timeline({ delay: 0.3 });
      tl.fromTo('.hero-hi',      { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .5, ease: 'expo.out' })
        .fromTo('.hero-h1',      { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .7, ease: 'expo.out' }, '-=.2')
        .fromTo('.hero-tag',     { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .5, ease: 'expo.out' }, '-=.3')
        .fromTo('.hero-lead',    { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .5, ease: 'expo.out' }, '-=.3')
        .fromTo('.hero-ctas',    { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .5, ease: 'expo.out' }, '-=.2')
        .fromTo('.hero-note',    { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .45, ease: 'expo.out' }, '-=.2')
        .fromTo('.hero-stats',   { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .4, ease: 'expo.out' }, '-=.2')
        .fromTo('.hero-polaroid',{ opacity: 0, rotate: 0, y: 24 }, { opacity: 1, rotate: 3.5, y: 0, duration: .9, ease: 'expo.out' }, '-=.8');
    });
    return () => mm.revert();
  }, []);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: 0 }}>
      <div className="wrap" style={{ width: '100%' }}>
        <div className="hero hero-grid">
          {/* Left */}
          <div>
            <span className="hero-hi hi">hi, I&apos;m</span>

            <h1 className="hero-h1">
              Qazi Farhan <span className="u">Ahmad</span>
            </h1>

            <span className="hero-tag tagline">
              AI web apps you can actually use, built in the real world
            </span>

            <p className="hero-lead lead">
              I build high-performance websites and AI-powered web applications that help businesses grow, automate processes, and increase conversions.
            </p>

            {/* CTA row */}
            <div className="hero-ctas cta-row">
              <button className="btn" onClick={() => scrollTo('work')}>
                View My Work
              </button>
              <button className="btn ghost" onClick={() => scrollTo('contact')}>
                Hire Me
              </button>
              <a className="btn ghost" href="/CV.pdf" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                <FileDown size={15} />
                Download CV
              </a>
            </div>

            <button className="hero-note" onClick={() => scrollTo('contact')}>
              p.s. I&apos;m open to freelance &amp; internships right now →
            </button>

            {/* Stat pills */}
            <div className="hero-stats statstrip">
              {stats.map(s => (
                <span key={s.label} className="m">
                  <b>{s.value}</b> {s.label}
                </span>
              ))}
            </div>
          </div>

          {/* Right — Polaroid */}
          <div className="hero-polaroid photo-wrap" style={{ display: 'flex' }}>
            <div className="polaroid" style={{ width: '100%' }}>
              <div className="sticker s2">AI Developer ✨</div>
              <img src="/profile.webp" alt="Qazi Farhan Ahmad" loading="eager" fetchPriority="high" />
              <div className="cap">Full Stack Dev 👋</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            padding: 44px 0 18px;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;
