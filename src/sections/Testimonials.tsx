import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  quote: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'CEO',
    company: 'TechStart Inc.',
    quote: 'Working with this team was an absolute pleasure. They delivered beyond our expectations and the results speak for themselves. Our website conversion rate increased by 40% within the first month.',
    avatar: '/avatar-1.jpg'
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Product Manager',
    company: 'InnovateCo',
    quote: 'The attention to detail and technical expertise is unmatched. Our conversion rates increased by 60% after the redesign. I highly recommend their services to anyone looking for top-tier development.',
    avatar: '/avatar-2.jpg'
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Marketing Director',
    company: 'GrowthLabs',
    quote: 'Professional, creative, and always on time. I couldn\'t recommend them more highly for any digital project. They understood our vision and brought it to life beautifully.',
    avatar: '/avatar-3.jpg'
  }
];

const Testimonials = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px)', () => {
      // Title animation
      const titleTrigger = ScrollTrigger.create({
        trigger: section,
        start: 'top 80%',
        onEnter: () => {
          gsap.fromTo('.testimonials-title',
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' }
          );
        },
        once: true
      });

      // Quote marks animation
      const quotesTrigger = ScrollTrigger.create({
        trigger: section,
        start: 'top 75%',
        onEnter: () => {
          gsap.fromTo('.quote-left',
            { scale: 0, rotate: -45 },
            { scale: 1, rotate: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)', delay: 0.3 }
          );
          gsap.fromTo('.quote-right',
            { scale: 0, rotate: 45 },
            { scale: 1, rotate: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)', delay: 0.4 }
          );
        },
        once: true
      });

      // Card animation
      const cardTrigger = ScrollTrigger.create({
        trigger: section,
        start: 'top 70%',
        onEnter: () => {
          gsap.fromTo('.testimonial-card',
            { y: 100, rotateX: 30, opacity: 0 },
            { y: 0, rotateX: 0, opacity: 1, duration: 0.8, ease: 'expo.out', delay: 0.5 }
          );
          gsap.fromTo('.testimonial-avatar',
            { scale: 0 },
            { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.5)', delay: 0.9 }
          );
        },
        once: true
      });

      return () => {
        titleTrigger.kill();
        quotesTrigger.kill();
        cardTrigger.kill();
      };
    });

    return () => {
      mm.revert();
    };
  }, []);

  const goToSlide = (index: number) => {
    if (isAnimating || index === activeIndex) return;
    setIsAnimating(true);

    const direction = index > activeIndex ? 1 : -1;

    gsap.to('.testimonial-content', {
      opacity: 0,
      x: -50 * direction,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        setActiveIndex(index);
        gsap.fromTo('.testimonial-content',
          { opacity: 0, x: 50 * direction },
          { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out', onComplete: () => setIsAnimating(false) }
        );
      }
    });

    gsap.to('.testimonial-avatar', {
      scale: 0.8,
      opacity: 0.5,
      duration: 0.3,
      onComplete: () => {
        gsap.to('.testimonial-avatar', {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          ease: 'elastic.out(1, 0.5)'
        });
      }
    });
  };

  const nextSlide = () => {
    const next = (activeIndex + 1) % testimonials.length;
    goToSlide(next);
  };

  const prevSlide = () => {
    const prev = (activeIndex - 1 + testimonials.length) % testimonials.length;
    goToSlide(prev);
  };

  const currentTestimonial = testimonials[activeIndex];

  return (
    <section 
      id="testimonials" 
      ref={sectionRef}
      className="relative bg-[#010101] py-20 md:py-32 overflow-hidden"
    >
      <div className="w-[95%] max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="testimonials-title text-4xl sm:text-5xl md:text-6xl font-medium text-white tracking-tight">
            What Clients Say
          </h2>
        </div>

        {/* Testimonial Card */}
        <div className="max-w-4xl mx-auto relative" style={{ perspective: '1200px' }}>
          {/* Quote Marks */}
          <div className="quote-left absolute -top-8 -left-4 md:-top-12 md:-left-12 text-white/10 animate-float">
            <Quote className="w-16 h-16 md:w-24 md:h-24" />
          </div>
          <div className="quote-right absolute -bottom-8 -right-4 md:-bottom-12 md:-right-12 text-white/10 rotate-180 animate-float-delayed">
            <Quote className="w-16 h-16 md:w-24 md:h-24" />
          </div>

          {/* Card */}
          <div className="testimonial-card relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12">
            <div className="testimonial-content">
              {/* Quote Text */}
              <p className="text-lg md:text-2xl text-white/90 leading-relaxed mb-8 text-center">
                &ldquo;{currentTestimonial.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex flex-col items-center">
                <div className="testimonial-avatar w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-white/20 mb-4">
                  <img
                    src={currentTestimonial.avatar}
                    alt={currentTestimonial.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-lg md:text-xl font-medium text-white">
                  {currentTestimonial.name}
                </h4>
                <p className="text-sm text-white/60">
                  {currentTestimonial.role}, {currentTestimonial.company}
                </p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={prevSlide}
                disabled={isAnimating}
                className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>

              {/* Dots */}
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === activeIndex 
                        ? 'w-8 bg-white' 
                        : 'bg-white/30 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                disabled={isAnimating}
                className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors disabled:opacity-50"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
