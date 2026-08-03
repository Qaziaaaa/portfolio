import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CheckCircle, ArrowRight } from 'lucide-react';

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
    description: "You always know what's happening. Regular updates, honest timelines, no surprises.",
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
          gsap.fromTo('.why-header',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' }
          );
          gsap.fromTo('.why-card',
            { opacity: 0, y: 25 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'expo.out', delay: 0.2 }
          );
        },
        once: true,
      });
    });

    return () => { mm.revert(); };
  }, []);

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="bg-cream-100 py-24"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="why-header text-center mb-16">
          <p className="font-hand text-terra-500 text-xl mb-2">why choose me</p>
          <h2 className="font-serif text-4xl sm:text-5xl font-semibold text-charcoal-900 mb-4">
            Why Work With Me
          </h2>
          <p className="text-charcoal-800/60 max-w-md mx-auto">
            What you get when you work with Qazi Farhan Ahmad
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {reasons.map((reason, i) => (
            <div
              key={i}
              className="why-card bg-white rounded-2xl p-5 sm:p-6 shadow-warm hover:shadow-warm-lg transition-shadow duration-300 border border-cream-300/60"
            >
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-terra-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-serif text-sm font-semibold text-charcoal-900 mb-1.5">
                    {reason.title}
                  </h3>
                  <p className="text-sm text-charcoal-800/70 leading-relaxed">
                    {reason.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-charcoal-800/60 text-sm mb-5">
            Currently open to internships, freelance projects, and collaborations.
          </p>
          <a
            href="https://wa.me/923141935787"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-terra-500 text-white text-sm font-medium rounded-full hover:bg-terra-600 transition-colors group"
          >
            Let&apos;s Build Something Together
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default WhyWorkWithMe;
