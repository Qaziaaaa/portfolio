import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { gsap } from 'gsap';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px)', () => {
      // Entrance animation — desktop only
      const tl = gsap.timeline({ delay: 0.2 });

      tl.fromTo('.nav-logo',
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' }
      )
        .fromTo('.nav-link',
          { opacity: 0, y: -15 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'expo.out' },
          '-=0.4'
        )
        .fromTo('.nav-cta',
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.5)' },
          '-=0.3'
        );
    });

    return () => {
      mm.revert();
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: 'Work', id: 'work' },
    { label: 'About', id: 'about' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
          ? 'glass border-b border-white/10'
          : 'bg-transparent'
          }`}
      >
        <div className="w-[95%] max-w-[90rem] mx-auto h-20 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => {
              scrollToSection('hero');
              window.dispatchEvent(new Event('triggerHeroAnimation'));
            }}
            className="nav-logo inline-flex items-center gap-2 text-xl font-semibold tracking-tight text-white hover:opacity-80 transition-opacity"
          >
            <span
              aria-hidden="true"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm"
            >
              <svg viewBox="0 0 40 40" fill="none" className="h-6 w-6">
                <circle cx="20" cy="20" r="14" stroke="white" strokeWidth="2.5" />
                <path d="M16 16L20 20L16 24" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="22" y1="24" x2="26" y2="24" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M28 28L34 34" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </span>
            PORTFOLIO
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="nav-link relative text-sm font-medium text-white/80 hover:text-white transition-colors group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-1/2 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full group-hover:left-0" />
              </button>
            ))}
          </div>

          {/* CTA Button */}
          <button
            onClick={() => scrollToSection('contact')}
            className="nav-cta hidden md:block px-5 py-2.5 bg-white text-black text-sm font-medium rounded-full hover:bg-white/90 transition-all duration-300 hover:scale-105"
          >
            Let&apos;s Talk
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
      >
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-xl"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 h-full w-[80%] max-w-sm bg-[#0a0a0a] border-l border-white/10 transform transition-transform duration-500 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          <div className="flex flex-col items-start gap-6 p-8 pt-24">
            {navLinks.map((link, index) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="text-2xl font-medium text-white/80 hover:text-white transition-colors"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => scrollToSection('contact')}
              className="mt-4 px-6 py-3 bg-white text-black font-medium rounded-full"
            >
              Let&apos;s Talk
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
