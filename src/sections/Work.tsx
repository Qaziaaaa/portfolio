import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Project {
  id: number;
  title?: string;
  description?: string;
  image?: string;
  tags?: string[];
  link?: string;
}

const projects: Project[] = [
  { 
    id: 0, 
    link: 'https://ecommerce-store-one-ochre.vercel.app/',
    title: 'NOVA E-Commerce Platform',
    description: 'Production-grade MERN shopping platform — Stripe payments, OTP auth, real-time stock, admin panel.',
    tags: ['React', 'Node.js', 'MongoDB', 'Stripe']
  },
  { 
    id: 1, 
    link: 'https://hiking-app-puce.vercel.app/',
    title: 'HIKI — Hiking Guide App',
    description: 'Full-stack MERN hiking app with trail discovery, authentication, admin dashboard, and blog.',
    tags: ['MERN', 'Full Stack', 'Cloudinary']
  },
  { 
    id: 2, 
    link: 'https://qazixcode.netlify.app/',
    title: 'QAZI-X Portfolio',
    description: 'Futuristic cyberpunk OS-inspired developer portfolio with cinematic animations.',
    tags: ['React', 'TypeScript', 'Framer Motion']
  },
  { 
    id: 3, 
    link: 'https://agencyxai.netlify.app',
    title: 'Agency X AI',
    description: 'Modern AI agency landing page with sophisticated animations and glassmorphism design.',
    tags: ['Next.js', 'AI', 'Framer Motion']
  },
  { 
    id: 4, 
    link: 'https://github.com/Qaziaaaa/Olipop-animated-site',
    title: 'OLIPOP Animated Clone',
    description: 'Premium parallax product page with flavor carousel, smooth scroll, and cart interactions.',
    tags: ['React', 'Tailwind', 'Framer Motion']
  }
];

const ProjectCard = ({ project }: { project: Project }) => {
  const hasLink = !!project.link;
  const CardRoot = hasLink ? 'a' : 'div';

  return (
    <CardRoot
      href={project.link}
      target={hasLink ? "_blank" : undefined}
      rel={hasLink ? "noopener noreferrer" : undefined}
      className="work-card group bg-[#0c0c0c] border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:border-white/10 hover:-translate-y-2 hover:shadow-2xl hover:shadow-white/[0.02] flex flex-col flex-shrink-0 w-[92vw] sm:w-[65vw] md:w-[50vw] lg:w-[38vw] xl:w-[32vw] min-h-[380px]"
    >
      {/* Wireframe Placeholder */}
      <div className="bg-[#151515] rounded-xl p-5 h-36 sm:h-44 mb-5 flex flex-col gap-3 relative overflow-hidden border border-white/[0.02] flex-shrink-0">
        {/* Animated gradient sweep effect on hover */}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.03] to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
        
        <div className="w-3/4 h-3 sm:h-4 bg-white/5 rounded-full" />
        <div className="w-1/2 h-3 sm:h-4 bg-white/5 rounded-full" />
        
        <div className="flex gap-2 mt-auto">
          <div className="w-14 h-7 bg-white/5 rounded-md" />
          <div className="w-14 h-7 bg-white/5 rounded-md" />
        </div>
      </div>

      <div className="flex flex-col flex-1">
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
          {project.title}
        </h3>
        
        <p className="text-white/60 text-sm sm:text-base leading-relaxed mb-4">
          {project.description}
        </p>

        {/* Button pushed to the bottom using mt-auto */}
        <button className="w-full py-3 bg-[#151515] group-hover:bg-white/10 text-white/80 group-hover:text-white rounded-xl transition-colors font-medium text-sm sm:text-base mt-auto">
          View Details
        </button>
      </div>
    </CardRoot>
  );
};

const Work = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    if (!section || !container) return;

    // Horizontal scroll and animations for desktop
    const mm = gsap.matchMedia();

    mm.add('(min-width: 768px)', () => {
      // Title animation (desktop only)
      const titleTrigger = ScrollTrigger.create({
        trigger: section,
        start: 'top 80%',
        onEnter: () => {
          gsap.fromTo('.work-title-char',
            { opacity: 0, y: 100, rotateX: 90 },
            {
              opacity: 1,
              y: 0,
              rotateX: 0,
              duration: 0.8,
              stagger: 0.03,
              ease: 'expo.out'
            }
          );
          gsap.fromTo('.work-subtitle',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, delay: 0.4, ease: 'expo.out' }
          );
        },
        once: true
      });
      triggersRef.current.push(titleTrigger);

      const cards = container.querySelectorAll('.work-card');
      const totalWidth = Array.from(cards).reduce((acc, card) => acc + (card as HTMLElement).offsetWidth + 64, 0);

      // Main horizontal scroll timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${totalWidth * 0.8}`,
          pin: true,
          scrub: 0.5,
          invalidateOnRefresh: true,
        }
      });

      // Horizontal movement and progress bar sync
      tl.to(container, {
        x: () => -(totalWidth - window.innerWidth + 100),
        ease: 'none',
      }, 0)
      .to('.work-progress-bar', {
        scaleX: 1,
        ease: 'none',
      }, 0);

      if (tl.scrollTrigger) {
        triggersRef.current.push(tl.scrollTrigger);
      }
    });

    return () => {
      triggersRef.current.forEach(trigger => trigger.kill());
      triggersRef.current = [];
      mm.revert();
    };
  }, []);

  const titleText = 'Selected Work';

  return (
    <section id="work" ref={sectionRef} className="relative bg-[#010101] min-h-screen pt-12 overflow-hidden">
      {/* Scroll Progress Tracker (Desktop only) */}
      <div className="hidden md:block absolute top-[85px] left-0 right-0 z-50 w-full px-4 sm:px-6 lg:px-8 pointer-events-none">
        <div className="w-full h-[6px] bg-white/10 rounded-full overflow-hidden">
          <div 
            className="work-progress-bar h-full bg-white origin-left shadow-[0_0_15px_rgba(255,255,255,0.5)]"
            style={{ 
              transform: 'scaleX(0)',
              willChange: 'transform'
            }}
          />
        </div>
      </div>

      {/* Subtle Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      {/* Section Header */}
      <div className="relative z-10 w-[95%] max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 md:py-24">
        <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-medium text-white tracking-tight mb-3 sm:mb-4 overflow-hidden">
          {titleText.split('').map((char, index) => (
            <span
              key={index}
              className="work-title-char inline-block"
              style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h2>
        <p className="work-subtitle text-lg md:text-xl text-white/80 max-w-xl">
          A curated selection of full-stack projects focusing on user interface, modern architecture, and blazing fast performance.
        </p>
      </div>

      {/* Projects Container (Horizontal Scroll) */}
      <div
        ref={containerRef}
        className="relative z-10 flex gap-6 sm:gap-8 md:gap-16 px-4 sm:px-8 lg:px-12 pb-20 md:pb-32 flex-nowrap md:min-w-max items-stretch"
      >
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
};

export default Work;
