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
  { value: 50, suffix: '+', label: 'Projects Completed' },
  { value: 2, suffix: '+', label: 'Years Experience' },
  { value: 30, suffix: '+', label: 'Happy Clients' },
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
  const triggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

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
    triggersRef.current.push(labelTrigger);

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
    triggersRef.current.push(headlineTrigger);

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
    triggersRef.current.push(imageTrigger);

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
    triggersRef.current.push(paragraphsTrigger);

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
    triggersRef.current.push(statsTrigger);

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
    triggersRef.current.push(parallaxTrigger);

    return () => {
      triggersRef.current.forEach(trigger => trigger.kill());
      triggersRef.current = [];
    };
  }, []);

  const headlineWords = ['Passionate', 'About', 'Building', 'Scalable', 'Web', 'Applications'];

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
                className="w-full aspect-[4/5] object-cover"
              />
              <div className="about-image-overlay absolute inset-0 bg-[#010101]" />
            </div>

            {/* Stats Cards */}
            <div className="stat-card stat-card-1 absolute -top-4 -right-4 md:top-8 md:-right-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 md:p-6">
              <div className="text-2xl md:text-3xl font-semibold text-white">
                <CountUp end={stats[0].value} suffix={stats[0].suffix} />
              </div>
              <div className="text-xs md:text-sm text-white/60 mt-1">{stats[0].label}</div>
            </div>

            <div className="stat-card stat-card-2 absolute -bottom-4 -left-4 md:bottom-20 md:-left-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 md:p-6">
              <div className="text-2xl md:text-3xl font-semibold text-white">
                <CountUp end={stats[1].value} suffix={stats[1].suffix} />
              </div>
              <div className="text-xs md:text-sm text-white/60 mt-1">{stats[1].label}</div>
            </div>

            <div className="stat-card stat-card-3 absolute bottom-8 -right-4 md:bottom-0 md:-right-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 md:p-6">
              <div className="text-2xl md:text-3xl font-semibold text-white">
                <CountUp end={stats[2].value} suffix={stats[2].suffix} />
              </div>
              <div className="text-xs md:text-sm text-white/60 mt-1">{stats[2].label}</div>
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
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-white leading-tight tracking-tight mb-8">
              {headlineWords.map((word, index) => (
                <span key={index} className="about-word inline-block mr-[0.25em]">
                  {word}
                </span>
              ))}
            </h2>

            {/* Paragraphs */}
            <div className="space-y-6">
              <p className="about-paragraph text-base md:text-lg text-white/70 leading-relaxed">
                As a MERN Stack Developer, I have a strong foundation in MongoDB, Express.js, React, and Node.js.
              </p>
              <p className="about-paragraph text-base md:text-lg text-white/70 leading-relaxed">
                I specialize in building robust backend architectures, dynamic frontend interfaces, and seamless user experiences from the ground up, ensuring high performance and scalability in all my projects.
              </p>
              <p className="about-paragraph text-base md:text-lg text-white/70 leading-relaxed">
                I am constantly learning new technologies and best practices to deliver cutting-edge solutions tailored to business and user needs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
