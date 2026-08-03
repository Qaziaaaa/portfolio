import { useEffect } from 'react';
import { gsap } from 'gsap';
import { FileDown } from 'lucide-react';

const stats = [
  { value: '10+', label: 'Projects Shipped' },
  { value: '25+', label: 'GitHub Repos' },
  { value: '299+', label: 'Contributions' },
];

const Hero = () => {
  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px)', () => {
      const tl = gsap.timeline({ delay: 0.4 });

      tl.fromTo('.hero-label',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' }
      )
        .fromTo('.hero-heading',
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' },
          '-=0.3'
        )
        .fromTo('.hero-badge',
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out' },
          '-=0.4'
        )
        .fromTo('.hero-description',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' },
          '-=0.3'
        )
        .fromTo('.hero-ctas',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out' },
          '-=0.3'
        )
        .fromTo('.hero-stats',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out' },
          '-=0.2'
        )
        .fromTo('.hero-polaroid',
          { opacity: 0, rotate: -4, y: 30 },
          { opacity: 1, rotate: 2, y: 0, duration: 0.9, ease: 'expo.out' },
          '-=0.8'
        );

      const handleRestartAnimation = () => { tl.restart(); };
      window.addEventListener('triggerHeroAnimation', handleRestartAnimation);
      return () => {
        window.removeEventListener('triggerHeroAnimation', handleRestartAnimation);
      };
    });

    return () => { mm.revert(); };
  }, []);

  const scrollToWork = () => {
    document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="bg-cream-100 min-h-screen flex items-center pt-[72px]"
    >
      <div className="max-w-6xl mx-auto px-6 py-16 lg:py-24 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — Text Content */}
          <div>
            <p className="hero-label font-hand text-terra-500 text-2xl mb-2">
              hi, I&apos;m
            </p>

            <h1 className="hero-heading font-serif text-5xl sm:text-6xl lg:text-7xl font-semibold text-charcoal-900 leading-tight mb-4">
              Qazi Farhan Ahmad
            </h1>

            <div className="hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cream-400 text-charcoal-800 text-sm mb-6 bg-white/60">
              <span className="w-2 h-2 rounded-full bg-terra-500 flex-shrink-0" />
              AI Web Developer &amp; MERN Stack Expert
            </div>

            <p className="hero-description text-charcoal-800/70 text-lg leading-relaxed mb-8 max-w-lg">
              I build high-performance websites and AI-powered web applications that help businesses grow, automate, and increase conversions.
            </p>

            {/* CTA Buttons */}
            <div className="hero-ctas flex flex-wrap gap-3">
              <button
                onClick={scrollToWork}
                className="bg-terra-500 text-white rounded-full px-7 py-3.5 font-medium hover:bg-terra-600 transition-colors text-sm sm:text-base"
              >
                View My Work
              </button>
              <button
                onClick={scrollToContact}
                className="border border-charcoal-900/20 text-charcoal-900 rounded-full px-7 py-3.5 font-medium hover:bg-cream-200 transition-colors text-sm sm:text-base"
              >
                Hire Me
              </button>
              <a
                href="/CV.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-charcoal-900/20 text-charcoal-900 rounded-full px-7 py-3.5 font-medium hover:bg-cream-200 transition-colors flex items-center gap-2 text-sm sm:text-base"
                aria-label="Download CV"
              >
                <FileDown className="w-4 h-4" />
                Download CV
              </a>
            </div>

            {/* Stats Row */}
            <div className="hero-stats flex gap-8 mt-10 pt-8 border-t border-cream-300">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="font-serif text-2xl font-semibold text-charcoal-900">
                    {stat.value}
                  </div>
                  <div className="text-xs text-charcoal-800/60 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Polaroid Photo */}
          <div className="hidden lg:flex justify-center items-center">
            <div className="hero-polaroid bg-white p-3 pb-10 shadow-[0_8px_40px_rgba(0,0,0,0.12)] rotate-2 rounded-sm max-w-xs w-full">
              <img
                src="/profile.webp"
                alt="Qazi Farhan Ahmad — AI Web Developer"
                className="w-full aspect-[3/4] object-cover rounded-sm"
                loading="eager"
                fetchPriority="high"
              />
              <p className="font-hand text-charcoal-800 text-center mt-4 text-lg">
                AI Developer 👋
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
