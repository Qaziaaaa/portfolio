import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CheckCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const reasons = [
  {
    title: 'Clean, Scalable Code',
    description: 'Every project is built with maintainability in mind — typed, documented, and structured for growth.',
  },
  {
    title: 'Fast & Reliable Delivery',
    description: 'I ship on time without cutting corners. Production-ready from day one.',
  },
  {
    title: 'Modern UI/UX Design',
    description: 'Pixel-perfect interfaces that look great and feel intuitive on every device.',
  },
  {
    title: 'AI-Powered Solutions',
    description: 'I integrate AI tools — chatbots, automation, smart APIs — to give your product a real edge.',
  },
  {
    title: 'Security-First Mindset',
    description: 'JWT auth, CSRF protection, rate limiting, input validation — security is never an afterthought.',
  },
  {
    title: 'Clear Communication',
    description: 'You always know what\'s happening. Regular updates, honest timelines, no surprises.',
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
          gsap.fromTo('.why-title',
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' }
          );
          gsap.fromTo('.why-card',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'expo.out', delay: 0.2 }
          );
        },
        once: true
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="relative bg-[#010101] py-20 md:py-32 overflow-hidden"
    >
      <div className="w-[95%] max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14 md:mb-16">
          <span className="text-sm font-medium text-white/50 uppercase tracking-widest block mb-4">
            Why Choose Me
          </span>
          <h2 className="why-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-white tracking-tight">
            Why Work With Me
          </h2>
          <p className="mt-4 text-base md:text-lg text-white/50 max-w-xl mx-auto">
            What you get when you work with Qazi Farhan Ahmad
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {reasons.map((reason, i) => (
            <div
              key={i}
              className="why-card bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 sm:p-6 hover:bg-white/[0.06] hover:border-white/[0.14] transition-all duration-300"
            >
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-white/40 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-white mb-1.5">{reason.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{reason.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-white/40 text-sm mb-4">
            Currently open to internships, freelance projects, and collaborations.
          </p>
          <a
            href="https://wa.me/923141935787"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black text-sm font-medium rounded-full hover:bg-white/90 hover:scale-105 transition-all duration-300"
          >
            Let's Build Something Together
          </a>
        </div>
      </div>
    </section>
  );
};

export default WhyWorkWithMe;
