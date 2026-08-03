import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  link: string;
  gradient: string;
}

const projects: Project[] = [
  {
    id: 0,
    link: 'https://ecommerce-store-one-ochre.vercel.app/',
    title: 'NOVA E-Commerce',
    description: 'Production-grade MERN shopping platform — Stripe payments, OTP auth, real-time stock, admin panel.',
    tags: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    gradient: 'from-terra-400/20 to-cream-300',
  },
  {
    id: 1,
    link: 'https://hiking-app-puce.vercel.app/',
    title: 'HIKI Hiking App',
    description: 'Full-stack MERN hiking app with trail discovery, authentication, admin dashboard, and blog.',
    tags: ['MERN', 'Full Stack', 'Cloudinary'],
    gradient: 'from-green-200/40 to-cream-300',
  },
  {
    id: 2,
    link: 'https://qazixcode.netlify.app/',
    title: 'QAZI-X Portfolio',
    description: 'Futuristic cyberpunk OS-inspired developer portfolio with cinematic animations.',
    tags: ['React', 'TypeScript', 'Framer Motion'],
    gradient: 'from-purple-200/30 to-cream-300',
  },
  {
    id: 3,
    link: 'https://agencyxai.netlify.app',
    title: 'Agency X AI',
    description: 'Modern AI agency landing page with sophisticated animations and glassmorphism design.',
    tags: ['Next.js', 'AI', 'Framer Motion'],
    gradient: 'from-blue-200/30 to-cream-300',
  },
  {
    id: 4,
    link: 'https://github.com/Qaziaaaa/Olipop-animated-site',
    title: 'OLIPOP Animated Clone',
    description: 'Premium parallax product page with flavor carousel, smooth scroll, and cart interactions.',
    tags: ['React', 'Tailwind', 'Framer Motion'],
    gradient: 'from-yellow-200/30 to-cream-300',
  },
];

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      className="work-card group bg-white rounded-2xl overflow-hidden shadow-warm hover:shadow-warm-lg transition-all duration-300 hover:-translate-y-1 border border-cream-300/60 flex flex-col flex-shrink-0 w-[85vw] sm:w-[60vw] md:w-[44vw] lg:w-[36vw] xl:w-[30vw]"
    >
      {/* Gradient placeholder area */}
      <div className={`h-44 bg-gradient-to-br ${project.gradient} flex items-center justify-center relative overflow-hidden`}>
        <span className="font-serif text-2xl font-semibold text-charcoal-900/40 group-hover:text-charcoal-900/60 transition-colors">
          {project.title}
        </span>
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-terra-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Card body */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-serif text-xl font-semibold text-charcoal-900 mb-2 group-hover:text-terra-500 transition-colors">
          {project.title}
        </h3>

        <p className="text-sm text-charcoal-800/70 leading-relaxed mb-4 flex-1">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag, i) => (
            <span
              key={i}
              className="px-3 py-1 text-xs font-medium bg-cream-200 rounded-full text-charcoal-800/70 border border-cream-300"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Link */}
        <div className="flex items-center gap-1.5 text-terra-500 text-sm font-medium">
          View Project
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
        </div>
      </div>
    </a>
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

    const mm = gsap.matchMedia();

    mm.add('(min-width: 768px)', () => {
      // Title entrance
      const titleTrigger = ScrollTrigger.create({
        trigger: section,
        start: 'top 80%',
        onEnter: () => {
          gsap.fromTo('.work-header',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' }
          );
        },
        once: true,
      });
      triggersRef.current.push(titleTrigger);

      const cards = container.querySelectorAll('.work-card');
      const totalWidth = Array.from(cards).reduce(
        (acc, card) => acc + (card as HTMLElement).offsetWidth + 64,
        0
      );

      // Horizontal scroll timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${totalWidth * 0.8}`,
          pin: true,
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });

      tl.to(container, {
        x: () => -(totalWidth - window.innerWidth + 100),
        ease: 'none',
      }, 0)
        .to('.work-progress-bar', { scaleX: 1, ease: 'none' }, 0);

      if (tl.scrollTrigger) {
        triggersRef.current.push(tl.scrollTrigger);
      }
    });

    return () => {
      triggersRef.current.forEach(t => t.kill());
      triggersRef.current = [];
      mm.revert();
    };
  }, []);

  return (
    <section
      id="work"
      ref={sectionRef}
      className="bg-cream-100 min-h-screen pt-12 overflow-hidden"
    >
      {/* Progress bar (desktop) */}
      <div className="hidden md:block absolute top-[85px] left-0 right-0 z-50 w-full px-6 pointer-events-none">
        <div className="w-full h-1 bg-cream-300 rounded-full overflow-hidden">
          <div
            className="work-progress-bar h-full bg-terra-500 origin-left"
            style={{ transform: 'scaleX(0)', willChange: 'transform' }}
          />
        </div>
      </div>

      {/* Section header */}
      <div className="work-header max-w-6xl mx-auto px-6 py-10 sm:py-16">
        <p className="font-hand text-terra-500 text-xl mb-2">selected work</p>
        <h2 className="font-serif text-4xl sm:text-5xl font-semibold text-charcoal-900 mb-3">
          Selected Work
        </h2>
        <p className="text-charcoal-800/60 max-w-xl">
          A curated selection of full-stack projects focusing on user interface, modern architecture, and performance.
        </p>
      </div>

      {/* Projects — horizontal scroll on desktop, grid on mobile */}
      <div
        ref={containerRef}
        className="flex gap-6 md:gap-10 px-6 md:px-12 pb-20 md:pb-32 flex-wrap md:flex-nowrap justify-center md:justify-start md:min-w-max items-stretch sm:grid sm:grid-cols-2 md:flex"
      >
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
};

export default Work;
