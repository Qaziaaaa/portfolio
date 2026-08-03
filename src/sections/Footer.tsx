import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Linkedin, Github } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px)', () => {
      ScrollTrigger.create({
        trigger: footer,
        start: 'top 90%',
        onEnter: () => {
          gsap.fromTo('.footer-content',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' }
          );
        },
        once: true,
      });
    });

    return () => { mm.revert(); };
  }, []);

  const navLinks = [
    { label: 'Work', id: 'work' },
    { label: 'About', id: 'about' },
    { label: 'Contact', id: 'contact' },
  ];

  const socialLinks = [
    {
      icon: Linkedin,
      href: 'https://www.linkedin.com/in/qazi-farhan-ahmad/',
      label: 'LinkedIn',
    },
    {
      icon: Github,
      href: 'https://github.com/Qaziaaaa',
      label: 'GitHub',
    },
    {
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
        </svg>
      ),
      href: 'https://wa.me/923141935787',
      label: 'WhatsApp',
    },
  ];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer
      ref={footerRef}
      role="contentinfo"
      className="bg-cream-200 border-t border-cream-300 pt-14 pb-8"
    >
      <div className="footer-content max-w-6xl mx-auto px-6">
        {/* Top */}
        <div className="text-center mb-10">
          <h3 className="font-serif text-3xl font-semibold text-charcoal-900 mb-2">Qazi.</h3>
          <p className="font-hand text-terra-500 text-lg mb-1">AI Web Developer</p>
          <p className="text-sm text-charcoal-800/60">
            Qazi Farhan Ahmad · Peshawar, Pakistan
          </p>
        </div>

        {/* Nav */}
        <nav className="flex flex-wrap justify-center gap-6 md:gap-10 mb-8">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => scrollToSection(link.id)}
              className="text-sm text-charcoal-800/70 hover:text-terra-500 transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-terra-500 transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </nav>

        {/* Social icons */}
        <div className="flex justify-center gap-3 mb-10">
          {socialLinks.map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white border border-cream-300 flex items-center justify-center hover:border-terra-400 hover:text-terra-500 text-charcoal-800/60 transition-all duration-300"
              >
                <Icon className="w-4 h-4" />
              </a>
            );
          })}
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-6 border-t border-cream-300">
          <p className="text-xs text-charcoal-800/50">
            &copy; {new Date().getFullYear()} Qazi Farhan. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-charcoal-800/50 hover:text-charcoal-800/80 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-xs text-charcoal-800/50 hover:text-charcoal-800/80 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
