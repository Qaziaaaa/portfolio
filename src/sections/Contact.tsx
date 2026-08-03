import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

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
          gsap.fromTo('.contact-content',
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }
          );
        },
        once: true,
      });
    });

    return () => { mm.revert(); };
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="bg-cream-300/50 py-24"
    >
      <div className="max-w-3xl mx-auto px-6 text-center">
        <div className="contact-content">
          <p className="font-hand text-terra-500 text-xl mb-3">come say hi</p>

          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-charcoal-900 leading-tight mb-5">
            Let&apos;s build something great.
          </h2>

          <p className="text-charcoal-800/70 text-lg leading-relaxed mb-8 max-w-xl mx-auto">
            I&apos;m open to internships, freelance projects, and collaboration opportunities. If you have an idea or need a developer — let&apos;s connect.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8">
            <a
              href="https://www.linkedin.com/in/qazi-farhan-ahmad/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-terra-500 text-white font-medium rounded-full hover:bg-terra-600 transition-colors group text-sm"
            >
              Connect on LinkedIn
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <a
              href="https://wa.me/923141935787"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-charcoal-900/20 text-charcoal-900 font-medium rounded-full hover:bg-cream-200 transition-colors group text-sm"
            >
              WhatsApp Me
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
              </svg>
            </a>
          </div>

          {/* Email link */}
          <a
            href="mailto:qazithekingston@gmail.com"
            className="text-sm text-charcoal-800/60 hover:text-terra-500 transition-colors"
          >
            qazithekingston@gmail.com
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;
