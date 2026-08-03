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

    return () => { mm.revert(); };
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-cream-100/95 backdrop-blur-sm border-b border-cream-300 shadow-warm'
            : 'bg-cream-100/80 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-18 flex items-center justify-between" style={{ height: '72px' }}>
          {/* Logo */}
          <button
            onClick={() => {
              scrollToSection('hero');
              window.dispatchEvent(new Event('triggerHeroAnimation'));
            }}
            className="nav-logo font-serif text-xl font-semibold text-charcoal-900 hover:text-terra-500 transition-colors"
          >
            Qazi.
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="nav-link relative text-sm font-medium text-charcoal-800 hover:text-terra-500 transition-colors group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-1/2 w-0 h-[1.5px] bg-terra-500 transition-all duration-300 group-hover:w-full group-hover:left-0" />
              </button>
            ))}
          </div>

          {/* CTA Button */}
          <button
            onClick={() => scrollToSection('contact')}
            className="nav-cta hidden md:block bg-terra-500 text-white text-sm font-medium rounded-full px-5 py-2.5 hover:bg-terra-600 transition-colors"
          >
            Let&apos;s Talk
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-charcoal-900"
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div
          className="absolute inset-0 bg-charcoal-900/30 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 h-full w-[80%] max-w-sm bg-cream-100 border-l border-cream-300 shadow-warm-lg transform transition-transform duration-500 ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col items-start gap-6 p-8 pt-24">
            <p className="font-hand text-terra-500 text-2xl mb-2">navigation</p>
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="font-serif text-2xl font-semibold text-charcoal-900 hover:text-terra-500 transition-colors"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => scrollToSection('contact')}
              className="mt-4 bg-terra-500 text-white font-medium rounded-full px-6 py-3 hover:bg-terra-600 transition-colors"
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
