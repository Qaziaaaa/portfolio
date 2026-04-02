import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Linkedin, Github } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    // Border line draw animation
    const borderTrigger = ScrollTrigger.create({
      trigger: footer,
      start: 'top 90%',
      onEnter: () => {
        gsap.fromTo('.footer-border',
          { scaleX: 0 },
          { scaleX: 1, duration: 0.8, ease: 'expo.out' }
        );
      },
      once: true
    });
    triggersRef.current.push(borderTrigger);

    // Brand name animation
    const brandTrigger = ScrollTrigger.create({
      trigger: footer,
      start: 'top 85%',
      onEnter: () => {
        gsap.fromTo('.footer-brand',
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out', delay: 0.2 }
        );
      },
      once: true
    });
    triggersRef.current.push(brandTrigger);

    // Tagline animation
    const taglineTrigger = ScrollTrigger.create({
      trigger: footer,
      start: 'top 80%',
      onEnter: () => {
        gsap.fromTo('.footer-tagline',
          { opacity: 0 },
          { opacity: 1, duration: 0.4, ease: 'smooth', delay: 0.4 }
        );
      },
      once: true
    });
    triggersRef.current.push(taglineTrigger);

    // Navigation links animation
    const navTrigger = ScrollTrigger.create({
      trigger: footer,
      start: 'top 75%',
      onEnter: () => {
        gsap.fromTo('.footer-nav-link',
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'expo.out', delay: 0.5 }
        );
      },
      once: true
    });
    triggersRef.current.push(navTrigger);

    // Social icons animation
    const socialTrigger = ScrollTrigger.create({
      trigger: footer,
      start: 'top 70%',
      onEnter: () => {
        gsap.fromTo('.footer-social',
          { scale: 0 },
          { scale: 1, duration: 0.3, stagger: 0.08, ease: 'elastic.out(1, 0.5)', delay: 0.8 }
        );
      },
      once: true
    });
    triggersRef.current.push(socialTrigger);

    // Copyright animation
    const copyrightTrigger = ScrollTrigger.create({
      trigger: footer,
      start: 'top 65%',
      onEnter: () => {
        gsap.fromTo('.footer-copyright',
          { opacity: 0 },
          { opacity: 1, duration: 0.4, ease: 'smooth', delay: 1.2 }
        );
      },
      once: true
    });
    triggersRef.current.push(copyrightTrigger);

    return () => {
      triggersRef.current.forEach(trigger => trigger.kill());
      triggersRef.current = [];
    };
  }, []);

  const navLinks = [
    { label: 'Work', href: '#work' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
    { label: 'Resume', href: '#' },
  ];

  const socialLinks = [
    { icon: Linkedin, href: 'https://www.linkedin.com/in/qazi-farhan-ahmad-7a3b3432b/', label: 'LinkedIn' },
    { icon: Github, href: 'https://github.com/Qaziaaaa', label: 'GitHub' },
    {
      // Using a custom SVG component as WhatsApp isn't consistently in lucide-react across versions yet.
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
        </svg>
      ),
      href: 'https://wa.me/03141935787',
      label: 'WhatsApp'
    },
  ];

  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.getElementById(href.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer
      ref={footerRef}
      className="relative bg-[#0a0a0a] pt-16 pb-8"
    >
      {/* Animated Border */}
      <div
        className="footer-border absolute top-0 left-1/2 -translate-x-1/2 w-[95%] max-w-[90rem] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"
        style={{ transformOrigin: 'center', transform: 'translateX(-50%) scaleX(0)' }}
      />

      <div className="w-[95%] max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="text-center mb-12">
          {/* Brand */}
          <h3 className="footer-brand inline-flex items-center gap-3 text-3xl md:text-4xl font-semibold text-white mb-4 tracking-tight">
            <span
              aria-hidden="true"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm"
            >
              <svg viewBox="0 0 40 40" fill="none" className="h-7 w-7">
                <circle cx="20" cy="20" r="14" stroke="white" strokeWidth="2.5" />
                <path d="M16 16L20 20L16 24" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="22" y1="24" x2="26" y2="24" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M28 28L34 34" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </span>
            PORTFOLIO
          </h3>

          {/* Tagline */}
          <p className="footer-tagline text-white/50 text-sm md:text-base">
            Creating digital experiences that matter.
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex flex-wrap justify-center gap-6 md:gap-10 mb-10">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => scrollToSection(link.href)}
              className="footer-nav-link text-sm text-white/70 hover:text-white transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </nav>

        {/* Social Links */}
        <div className="flex justify-center gap-4 mb-12">
          {socialLinks.map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="footer-social w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 hover:scale-110 hover:rotate-[10deg] transition-all duration-300 group"
              >
                <Icon className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
              </a>
            );
          })}
        </div>

        {/* Bottom Section */}
        <div className="footer-copyright flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/10">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} Qazi Farhan. All rights reserved.
          </p>

          <div className="flex gap-6">
            <a href="#" className="text-xs text-white/40 hover:text-white/70 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-xs text-white/40 hover:text-white/70 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
