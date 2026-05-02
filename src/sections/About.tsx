import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Stat {
  value: number;
  suffix: string;
  label: string;
}

const stats: Stat[] = [
  { value: 10, suffix: '+', label: 'Projects Shipped' },
  { value: 25, suffix: '+', label: 'GitHub Repos' },
  { value: 299, suffix: '+', label: 'Contributions' },
];

const CountUp = ({ end, suffix, duration = 1.5 }: { end: number; suffix: string; duration?: number }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const element = countRef.current;
    if (!element || hasAnimated.current) return;

    const trigger = ScrollTrigger.create({
      trigger: element,
      start: 'top 85%',
      onEnter: () => {
        if (hasAnimated.current) return;
        hasAnimated.current = true;

        gsap.to({ value: 0 }, {
          value: end,
          duration,
          ease: 'expo.out',
          onUpdate: function () {
            setCount(Math.round(this.targets()[0].value));
          }
        });
      }
    });

    return () => trigger.kill();
  }, [end, duration]);

  return (
    <span ref={countRef}>
      {count}{suffix}
    </span>
  );
};

const About = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px)', () => {
      const triggers: ScrollTrigger[] = [];

      // Section label typewriter effect
      const labelTrigger = ScrollTrigger.create({
        trigger: section,
        start: 'top 80%',
        onEnter: () => {
          gsap.fromTo('.about-label',
            { opacity: 0, width: 0 },
            { opacity: 1, width: 'auto', duration: 0.6, ease: 'none' }
          );
        },
        once: true
      });
      triggers.push(labelTrigger);

      // Headline word animation
      const headlineTrigger = ScrollTrigger.create({
        trigger: section,
        start: 'top 75%',
        onEnter: () => {
          gsap.fromTo('.about-word',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'expo.out', delay: 0.2 }
          );
        },
        once: true
      });
      triggers.push(headlineTrigger);

      // Image animation
      const imageTrigger = ScrollTrigger.create({
        trigger: section,
        start: 'top 70%',
        onEnter: () => {
          gsap.fromTo('.about-image',
            { x: -100, rotate: -5, opacity: 0 },
            { x: 0, rotate: -2, opacity: 1, duration: 1, ease: 'expo.out', delay: 0.4 }
          );
          gsap.fromTo('.about-image-overlay',
            { scaleY: 1, transformOrigin: 'top' },
            { scaleY: 0, duration: 0.8, ease: 'expo.out', delay: 0.4 }
          );
        },
        once: true
      });
      triggers.push(imageTrigger);

      // Paragraphs animation
      const paragraphsTrigger = ScrollTrigger.create({
        trigger: section,
        start: 'top 65%',
        onEnter: () => {
          gsap.fromTo('.about-paragraph',
            { opacity: 0, y: 25 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'expo.out', delay: 0.8 }
          );
        },
        once: true
      });
      triggers.push(paragraphsTrigger);

      // Stats cards animation
      const statsTrigger = ScrollTrigger.create({
        trigger: section,
        start: 'top 60%',
        onEnter: () => {
          gsap.fromTo('.stat-card',
            { scale: 0, rotateX: 45, z: -100 },
            { scale: 1, rotateX: 0, z: 0, duration: 0.6, stagger: 0.15, ease: 'elastic.out(1, 0.5)', delay: 1 }
          );
        },
        once: true
      });
      triggers.push(statsTrigger);

      // Parallax effect on scroll
      const parallaxTrigger = ScrollTrigger.create({
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          gsap.set('.about-image', { y: progress * -50 });
          gsap.set('.stat-card-1', { y: progress * 30 });
          gsap.set('.stat-card-2', { y: progress * -20 });
          gsap.set('.stat-card-3', { y: progress * 40 });
        }
      });
      triggers.push(parallaxTrigger);

      return () => {
        triggers.forEach(trigger => trigger.kill());
      };
    });

    return () => {
      mm.revert();
    };
  }, []);

  const headlineWords = ['Building', 'Production-Ready', 'Apps'];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative bg-[#010101] py-20 md:py-32 overflow-hidden"
    >
      {/* Background gradient mesh */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-[95%] max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column - Image & Stats */}
          <div className="relative">
            {/* Main Image */}
            <div className="about-image relative rounded-2xl overflow-hidden" style={{ transform: 'rotate(-2deg)' }}>
              <img
                src="https://i.postimg.cc/B6kHGPZM/a-make-the-background.jpg"
                alt="About portrait"
                loading="lazy"
                decoding="async"
                className="w-full aspect-[4/5] object-cover"
              />
              <div className="about-image-overlay absolute inset-0 bg-[#010101] hidden lg:block" />
            </div>

            {/* Stats Cards — absolute on desktop, flex row on mobile */}
            <div className="mt-6 lg:mt-0 flex flex-row justify-around gap-3 lg:block">
              <div className="stat-card stat-card-1 flex-1 lg:flex-none lg:absolute lg:-top-2 lg:-right-2 xl:top-8 xl:-right-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-3 sm:p-4 md:p-5 text-center lg:text-left">
                <div className="text-xl sm:text-2xl md:text-3xl font-semibold text-white">
                  <CountUp end={stats[0].value} suffix={stats[0].suffix} />
                </div>
                <div className="text-[10px] sm:text-xs md:text-sm text-white/60 mt-1">{stats[0].label}</div>
              </div>

              <div className="stat-card stat-card-2 flex-1 lg:flex-none lg:absolute lg:bottom-20 lg:-left-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-3 sm:p-4 md:p-5 text-center lg:text-left">
                <div className="text-xl sm:text-2xl md:text-3xl font-semibold text-white">
                  <CountUp end={stats[1].value} suffix={stats[1].suffix} />
                </div>
                <div className="text-[10px] sm:text-xs md:text-sm text-white/60 mt-1">{stats[1].label}</div>
              </div>

              <div className="stat-card stat-card-3 flex-1 lg:flex-none lg:absolute lg:bottom-0 lg:-right-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-3 sm:p-4 md:p-5 text-center lg:text-left">
                <div className="text-xl sm:text-2xl md:text-3xl font-semibold text-white">
                  <CountUp end={stats[2].value} suffix={stats[2].suffix} />
                </div>
                <div className="text-[10px] sm:text-xs md:text-sm text-white/60 mt-1">{stats[2].label}</div>
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div>
            {/* Label */}
            <div className="about-label overflow-hidden whitespace-nowrap mb-6">
              <span className="text-sm font-medium text-white/50 uppercase tracking-widest">
                About Me
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-white leading-tight tracking-tight mb-6 sm:mb-8">
              {headlineWords.map((word, index) => (
                <span key={index} className="about-word inline-block mr-[0.25em]">
                  {word}
                </span>
              ))}
            </h2>

            {/* Paragraphs */}
            <div className="space-y-6">
              <p className="about-paragraph text-base md:text-lg text-white/70 leading-relaxed">
                I'm Qazi Farhan Ahmad — a Frontend-focused Full Stack Developer and BS Software Engineering student (4th Semester) at the University of Peshawar, Pakistan.
              </p>
              <p className="about-paragraph text-base md:text-lg text-white/70 leading-relaxed">
                I build end-to-end web applications with React, TypeScript, Node.js, and MongoDB — with a strong emphasis on security-first architecture, performance optimization, and clean, maintainable code.
              </p>
              <p className="about-paragraph text-base md:text-lg text-white/70 leading-relaxed">
                Currently seeking internships and freelance opportunities where I can contribute to real products, grow fast, and ship things that matter.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
