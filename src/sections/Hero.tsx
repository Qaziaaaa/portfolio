import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ChevronDown } from 'lucide-react';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
  }>>([]);

  // Particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    const particleCount = window.innerWidth < 768 ? 30 : 60;
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2 + 1,
    }));

    let animationId: number;
    let frameCount = 0;

    let isVisible = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          animate();
        }
      },
      { threshold: 0 }
    );
    
    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    const animate = () => {
      if (!isVisible) return;

      frameCount++;
      // Render every 2nd frame for performance (30fps)
      if (frameCount % 2 === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const particles = particlesRef.current;

        // Update and draw particles
        particles.forEach((particle, i) => {
          particle.x += particle.vx;
          particle.y += particle.vy;

          // Wrap around edges
          if (particle.x < 0) particle.x = canvas.width;
          if (particle.x > canvas.width) particle.x = 0;
          if (particle.y < 0) particle.y = canvas.height;
          if (particle.y > canvas.height) particle.y = 0;

          // Draw particle
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.fill();

          // Draw connections (only check every 5th particle for performance)
          if (i % 5 === 0) {
            particles.slice(i + 1).forEach((other) => {
              const dx = particle.x - other.x;
              const dy = particle.y - other.y;
              const distance = Math.sqrt(dx * dx + dy * dy);

              if (distance < 100) {
                ctx.beginPath();
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(other.x, other.y);
                ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 * (1 - distance / 100)})`;
                ctx.stroke();
              }
            });
          }
        });
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
      observer.disconnect();
    };
  }, []);

  // GSAP entrance animations — desktop only
  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px)', () => {
      const tl = gsap.timeline({ delay: 0.5 });

      // Headline words animation
      tl.fromTo('.hero-word',
        {
          opacity: 0,
          y: 40,
          clipPath: 'inset(100% 0 0 0)'
        },
        {
          opacity: 1,
          y: 0,
          clipPath: 'inset(0% 0 0 0)',
          duration: 0.8,
          stagger: 0.12,
          ease: 'expo.out'
        }
      )
        .fromTo('.hero-subheadline',
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' },
          '-=0.4'
        )
        .fromTo('.hero-description',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' },
          '-=0.5'
        )
        .fromTo('.hero-cta-primary',
          { opacity: 0, scale: 0.9, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' },
          '-=0.3'
        )
        .fromTo('.hero-cta-secondary',
          { opacity: 0, scale: 0.9, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' },
          '-=0.4'
        )
        .fromTo('.hero-cta-download',
          { opacity: 0, scale: 0.9, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' },
          '-=0.4'
        )
        .fromTo('.hero-scroll-indicator',
          { opacity: 0 },
          { opacity: 1, duration: 0.5, ease: 'smooth' },
          '-=0.2'
        );

      // Floating shapes animation
      gsap.fromTo('.floating-shape',
        { opacity: 0, rotateX: 90, z: -200 },
        {
          opacity: 1,
          rotateX: 0,
          z: 50,
          duration: 1,
          stagger: 0.15,
          delay: 0.8,
          ease: 'expo.out'
        }
      );

      const handleRestartAnimation = () => {
        tl.restart();

        gsap.fromTo('.floating-shape',
          { opacity: 0, rotateX: 90, z: -200 },
          {
            opacity: 1,
            rotateX: 0,
            z: 50,
            duration: 1,
            stagger: 0.15,
            delay: 0.8,
            ease: 'expo.out'
          }
        );
      };

      window.addEventListener('triggerHeroAnimation', handleRestartAnimation);

      return () => {
        window.removeEventListener('triggerHeroAnimation', handleRestartAnimation);
      };
    });

    return () => {
      mm.revert();
    };
  }, []);

  const scrollToWork = () => {
    document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  // const headlineWords = ['Creative', 'Developer', '&', 'Designer'];

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen w-full overflow-hidden bg-[#010101] flex items-center"
      style={{ perspective: '1200px' }}
    >
      {/* Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-[1] opacity-60"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-[2] bg-gradient-radial from-transparent via-transparent to-[#010101]/80" />

      {/* Floating Shapes */}
      <div className="absolute right-[10%] top-[20%] z-[4] hidden lg:block" style={{ transformStyle: 'preserve-3d' }}>
        <div className="floating-shape w-20 h-20 border border-white/20 rounded-lg animate-float"
          style={{ animationDuration: '6s', transform: 'rotateX(15deg) rotateY(25deg)' }} />
      </div>
      <div className="absolute right-[20%] bottom-[25%] z-[4] hidden lg:block" style={{ transformStyle: 'preserve-3d' }}>
        <div className="floating-shape w-12 h-12 border border-white/15 rounded-full animate-float-delayed"
          style={{ animationDuration: '5s', transform: 'rotateX(-10deg) rotateY(15deg)' }} />
      </div>
      <div className="absolute right-[5%] top-[50%] z-[4] hidden lg:block" style={{ transformStyle: 'preserve-3d' }}>
        <div className="floating-shape w-32 h-[1px] bg-white/20 animate-float"
          style={{ animationDuration: '7s', transform: 'rotateZ(-15deg)' }} />
      </div>

      {/* Main Content */}
      {/* Main Content — Centered */}
      <div className="relative z-[3] w-[95%] max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 sm:pb-20 flex items-center justify-center">
        <div className="max-w-3xl text-center">
          {/* Headline — H1 with full name for SEO */}
          <h1 className="text-[clamp(2.2rem,10vw,6rem)] font-semibold text-white leading-[1.08] tracking-tight mb-6 whitespace-nowrap">
            {['Qazi', 'Farhan', 'Ahmad'].map((word, index) => (
              <span
                key={index}
                className="hero-word inline-block mr-[0.25em] last:mr-0"
              >
                {word}
              </span>
            ))}
          </h1>

          {/* Subheadline */}
          <p className="hero-subheadline text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/80 font-light mb-4 sm:mb-6">
            AI Web Developer &amp; MERN Stack Expert
          </p>

          {/* Description */}
          <p className="hero-description text-sm sm:text-base md:text-lg lg:text-xl text-white/60 max-w-2xl mx-auto mb-8 sm:mb-12 leading-relaxed px-2 sm:px-0">
            I build high-performance websites and AI-powered web applications that help businesses grow, automate processes, and increase conversions.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-3 sm:gap-4 px-4 sm:px-0">
            <button
              onClick={scrollToWork}
              className="hero-cta-primary w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-white text-black font-medium rounded-full hover:scale-105 transition-transform duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] text-sm sm:text-base"
            >
              View My Work
            </button>
            <button
              onClick={scrollToContact}
              className="hero-cta-secondary w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-white/10 border border-white/30 text-white font-medium rounded-full hover:bg-white/20 transition-all duration-300 text-sm sm:text-base"
            >
              Hire Me
            </button>
            <a
              href="/resume.pdf"
              download
              className="hero-cta-download w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 border border-white/30 text-white font-medium rounded-full hover:bg-white/10 transition-all duration-300 flex items-center justify-center text-sm sm:text-base"
            >
              Download CV
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="hero-scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 z-[5] flex flex-col items-center gap-2">
        <span className="text-xs text-white/50 uppercase tracking-widest">Scroll</span>
        <div className="animate-[bounce-scroll_1.5s_ease-in-out_infinite]">
          <ChevronDown className="w-5 h-5 text-white/50" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
