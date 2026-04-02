import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Mail } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Background gradient animation
    const bgTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 80%',
      onEnter: () => {
        gsap.fromTo('.contact-bg',
          { opacity: 0 },
          { opacity: 1, duration: 1, ease: 'smooth' }
        );
      },
      once: true
    });
    triggersRef.current.push(bgTrigger);

    // Floating shapes animation
    const shapesTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 75%',
      onEnter: () => {
        gsap.fromTo('.contact-shape',
          { y: 50, opacity: 0, rotate: () => gsap.utils.random(-30, 30) },
          {
            y: 0,
            opacity: 1,
            rotate: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'expo.out',
            delay: 0.1
          }
        );
      },
      once: true
    });
    triggersRef.current.push(shapesTrigger);

    // Headline word-by-word clip reveal
    const headlineTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 70%',
      onEnter: () => {
        gsap.fromTo('.contact-word',
          { clipPath: 'inset(0 100% 0 0)' },
          {
            clipPath: 'inset(0 0% 0 0)',
            duration: 0.7,
            stagger: 0.15,
            ease: 'expo.out',
            delay: 0.3
          }
        );
      },
      once: true
    });
    triggersRef.current.push(headlineTrigger);

    // Subheadline animation
    const subheadlineTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 65%',
      onEnter: () => {
        gsap.fromTo('.contact-subheadline',
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out', delay: 1.2 }
        );
      },
      once: true
    });
    triggersRef.current.push(subheadlineTrigger);

    // CTA button animation
    const ctaTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 60%',
      onEnter: () => {
        gsap.fromTo('.contact-cta',
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: 'elastic.out(1, 0.5)', delay: 1.4 }
        );
      },
      once: true
    });
    triggersRef.current.push(ctaTrigger);

    // Email link animation
    const emailTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 55%',
      onEnter: () => {
        gsap.fromTo('.contact-email',
          { opacity: 0 },
          { opacity: 1, duration: 0.4, ease: 'smooth', delay: 1.6 }
        );
      },
      once: true
    });
    triggersRef.current.push(emailTrigger);

    // Scroll-based parallax for shapes
    const parallaxTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        gsap.set('.contact-shape-1', { rotate: progress * 45, y: progress * -50 });
        gsap.set('.contact-shape-2', { rotate: -progress * 30, y: progress * -30 });
        gsap.set('.contact-shape-3', { rotate: progress * 20, y: progress * -40 });
      }
    });
    triggersRef.current.push(parallaxTrigger);

    return () => {
      triggersRef.current.forEach(trigger => trigger.kill());
      triggersRef.current = [];
    };
  }, []);

  const headlineWords = ["Let's", 'Create', 'Something', 'Amazing', 'Together'];

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative bg-[#010101] py-20 md:py-32 min-h-[60vh] flex items-center overflow-hidden"
    >
      {/* Animated Background Gradient */}
      <div className="contact-bg absolute inset-0 opacity-0">
        <div
          className="absolute inset-0 animate-gradient-shift"
          style={{
            background: 'linear-gradient(135deg, #010101 0%, #0a0a0a 25%, #010101 50%, #0a0a0a 75%, #010101 100%)',
            backgroundSize: '400% 400%'
          }}
        />
      </div>

      {/* Floating Shapes */}
      <div className="contact-shape contact-shape-1 absolute top-[20%] left-[10%] w-16 h-16 border border-white/10 rounded-lg hidden lg:block" />
      <div className="contact-shape contact-shape-2 absolute top-[30%] right-[15%] w-12 h-12 border border-white/10 rounded-full hidden lg:block" />
      <div className="contact-shape contact-shape-3 absolute bottom-[25%] left-[20%] w-24 h-[1px] bg-white/20 hidden lg:block" />
      <div className="contact-shape absolute bottom-[30%] right-[10%] w-8 h-8 border border-white/10 rotate-45 hidden lg:block" />

      {/* Content */}
      <div className="relative z-10 w-[95%] max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Headline */}
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium text-white leading-tight tracking-tight mb-6">
          {headlineWords.map((word, index) => (
            <span
              key={index}
              className="contact-word inline-block mr-[0.2em]"
            >
              {word}
            </span>
          ))}
        </h2>

        {/* Subheadline */}
        <p className="contact-subheadline text-lg md:text-xl text-white/60 max-w-xl mx-auto mb-10">
          Have a project in mind? I&apos;d love to hear about it.
        </p>

        {/* CTA Button */}
        <div className="contact-cta mb-8 gap-4 flex flex-col md:flex-row justify-center items-center">
          <a
            href="mailto:qazithekingston@gmail.com"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-medium rounded-full hover:scale-105 transition-all duration-300 animate-pulse-glow group"
          >
            Start a Conversation
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="https://wa.me/03141935787"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 border border-white/20 text-white font-medium rounded-full hover:bg-white/10 transition-all duration-300 group"
          >
            WhatsApp Me
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
            </svg>
          </a>
        </div>

        {/* Alternative Contact */}
        <div className="contact-email px-2 sm:px-0">
          <a
            href="mailto:qazithekingston@gmail.com"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors group max-w-full"
          >
            <Mail className="w-4 h-4" />
            <span className="relative break-all text-sm sm:text-base">
              Or email me at qazithekingston@gmail.com
              <span className="absolute -bottom-1 left-1/2 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full group-hover:left-0" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;
