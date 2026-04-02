import { useEffect, useRef, useState } from 'react';
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
    id: 1, 
    link: 'https://hiking-app-puce.vercel.app/',
    title: 'Hikescape Full-Stack App',
    description: 'A comprehensive MERN stack application for hiking enthusiasts with authentication and maps.',
    tags: ['MERN', 'Full Stack', 'Cloudinary']
  },
  { 
    id: 2, 
    link: 'https://agencyxai.netlify.app',
    title: 'Agency X AI',
    description: 'A modern AI agency landing page with sophisticated animations and glassmorphism.',
    tags: ['Next.js', 'AI', 'Framer Motion']
  },
  { 
    id: 3, 
    link: 'https://qbulids.netlify.app',
    title: 'QBuilds Architecture',
    description: 'High-end architectural portfolio featuring immersive visual storytelling.',
    tags: ['React', 'GSAP', 'Architecture']
  },
  { 
    id: 4, 
    link: 'https://vertexdesignlab.netlify.app',
    title: 'Vertex Design Lab',
    description: 'A creative studio website focused on minimalist and geometric design principles.',
    tags: ['Portfolio', 'Design', 'Vite']
  },
  { 
    id: 5, 
    link: 'https://marketingz.netlify.app',
    title: 'MarketingZ Agency',
    description: 'A bold, high-conversion marketing agency landing page.',
    tags: ['Marketing', 'SEO', 'Tailwind CSS']
  },
  { 
    id: 6, 
    link: 'https://landingpagesaas.netlify.app',
    title: 'SaaS Launchpad',
    description: 'Highly optimized SaaS landing page with interactive pricing and feature grids.',
    tags: ['SaaS', 'UI/UX', 'React']
  },
  { 
    id: 7, 
    link: 'https://ecommercestoreqazi.netlify.app',
    title: 'Elite Commerce',
    description: 'A fast, modern e-commerce storefront with integrated shopping features.',
    tags: ['E-commerce', 'Redux', 'Vite']
  },
  { 
    id: 8, 
    link: 'https://oliipop.netlify.app',
    title: 'Oliipop Creative',
    description: 'Visually stunning personal brand portfolio for creative professionals.',
    tags: ['Branding', 'Portfolio', 'React']
  },
  { 
    id: 9, 
    link: 'https://gamingbench.netlify.app',
    title: 'Gaming Bench',
    description: 'A community-focused gaming hardware reviews and benchmarks platform.',
    tags: ['Hardware', 'Gaming', 'Tailwind']
  },
  { 
    id: 10, 
    link: 'https://porfolio-qazi.netlify.app',
    title: 'Portfolio V1',
    description: 'The first iteration of my personal dev portfolio, showcasing my early work.',
    tags: ['First Edition', 'Portfolio', 'React']
  }
];

const ProjectCard = ({ project }: { project: Project }) => {
  const cardRef = useRef<HTMLElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(true);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -8, y: x * 8 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const hasLink = !!project.link;
  const CardRoot = hasLink ? 'a' : 'div';

  return (
    <CardRoot
      ref={cardRef as any}
      href={project.link}
      target={hasLink ? "_blank" : undefined}
      rel={hasLink ? "noopener noreferrer" : undefined}
      className={`work-card group relative flex-shrink-0 w-[90vw] sm:w-[72vw] md:w-[45vw] lg:w-[35vw] h-[48vh] sm:h-[52vh] md:h-[60vh] rounded-2xl overflow-hidden cursor-pointer transition-all duration-700 block bg-[#050505] border border-white/5 hover:border-white/20`}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform 0.3s ease-out',
        transformStyle: 'preserve-3d',
        textDecoration: 'none'
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Live Preview / Iframe State */}
      {hasLink && (
        <div className="absolute inset-0 z-0">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#050505] z-10 transition-opacity duration-500">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          )}
          <iframe
            src={project.link}
            className={`w-full h-full border-none transition-opacity duration-1000 ${loading ? 'opacity-0' : 'opacity-100'}`}
            onLoad={() => setLoading(false)}
            style={{ pointerEvents: 'none', width: '125%', height: '125%', scale: '0.8', transformOrigin: 'top left' }}
            title={`Preview of ${project.link}`}
          />
          {/* Subtle Mask to blend iframe */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-black/10 pointer-events-none" />
        </div>
      )}

      {/* Glass Overlay Pane */}
      <div
        className={`absolute inset-0 z-10 backdrop-blur-[2px] bg-white/[0.01] transition-all duration-700 pointer-events-none ${hasLink ? 'group-hover:backdrop-blur-none group-hover:bg-transparent' : ''
          }`}
      />

      {/* Empty / Static Content (Only shows if no link or on top of preview) */}
      {!hasLink && (
        <div className="absolute inset-0 z-20 flex items-center justify-center p-8">
          <div className="flex flex-col items-center gap-4 opacity-10 group-hover:opacity-30 transition-all duration-500 transform group-hover:scale-110">
            <div className="w-16 h-16 rounded-full border border-dashed border-white flex items-center justify-center">
              <span className="text-3xl text-white">+</span>
            </div>
            <p className="text-white text-[10px] font-light tracking-[0.3em] uppercase">Private Project</p>
          </div>
        </div>
      )}

      {/* Border Glow */}
      <div className="absolute inset-0 z-30 rounded-2xl border border-white/5 group-hover:border-white/20 transition-colors duration-500 pointer-events-none" />

      {/* Reflection effect */}
      <div className="absolute inset-0 z-40 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
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

    // Title animation
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

    // Horizontal scroll for desktop
    const mm = gsap.matchMedia();

    mm.add('(min-width: 768px)', () => {
      const cards = container.querySelectorAll('.work-card');
      const totalWidth = Array.from(cards).reduce((acc, card) => acc + (card as HTMLElement).offsetWidth + 64, 0);

      // Main horizontal scroll timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${totalWidth * 0.8}`, // Reduced distance to make it feel faster
          pin: true,
          scrub: 0.5, // Faster scrub for better responsiveness
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
    <section
      id="work"
      ref={sectionRef}
      className="relative bg-[#010101] min-h-screen pt-12"
    >
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

      {/* Section Header */}
      <div className="w-[95%] max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium text-white tracking-tight mb-4 overflow-hidden">
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
        <p className="work-subtitle text-lg md:text-xl text-white/60 max-w-xl">
          A curated collection of recent projects
        </p>
      </div>

      {/* Projects Container */}
      <div
        ref={containerRef}
        className="flex gap-6 sm:gap-8 md:gap-16 px-4 sm:px-8 lg:px-12 pb-20 md:pb-32 md:flex-nowrap flex-wrap justify-center md:justify-start w-full md:min-w-max"
      >
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
};

export default Work;
