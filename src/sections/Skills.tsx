import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Code2, 
  Server, 
  Palette, 
  Sparkles, 
  Zap, 
  Cloud 
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Skill {
  icon: React.ElementType;
  title: string;
  description: string;
  technologies: string[];
}

const skills: Skill[] = [
  {
    icon: Code2,
    title: 'Frontend Development',
    description: 'Building responsive, performant UIs with modern React patterns and TypeScript',
    technologies: ['React 19', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Zustand', 'TanStack Query']
  },
  {
    icon: Server,
    title: 'Backend Development',
    description: 'Secure, scalable REST APIs with JWT auth, rate limiting, and caching',
    technologies: ['Node.js', 'Express.js', 'REST APIs', 'JWT Auth', 'Rate Limiting', 'Caching']
  },
  {
    icon: Palette,
    title: 'Database & Payments',
    description: 'Data modeling, query optimization, and Stripe payment integration',
    technologies: ['MongoDB Atlas', 'Mongoose', 'PostgreSQL', 'Stripe', 'Webhooks']
  },
  {
    icon: Sparkles,
    title: 'Animation & Motion',
    description: 'Bringing interfaces to life with cinematic, smooth animations',
    technologies: ['GSAP', 'Framer Motion', 'Three.js', 'CSS Animations']
  },
  {
    icon: Zap,
    title: 'Performance & Security',
    description: 'Core Web Vitals, code splitting, CSRF protection, and circuit breakers',
    technologies: ['Core Web Vitals', 'Code Splitting', 'CSRF', 'bcrypt', 'Input Validation']
  },
  {
    icon: Cloud,
    title: 'DevOps & Deployment',
    description: 'CI/CD pipelines, cloud deployment, and environment management',
    technologies: ['Vercel', 'Render', 'Netlify', 'Cloudinary', 'Docker', 'Git']
  }
];

const SkillCard = ({ skill }: { skill: Skill }) => {
  const Icon = skill.icon;
  
  return (
    <div 
      className="skill-card group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 hover:bg-white/10 transition-all duration-300 cursor-pointer"
      style={{
        transform: 'perspective(800px) rotateX(5deg)',
        transformStyle: 'preserve-3d',
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={(e) => {
        gsap.to(e.currentTarget, {
          rotateX: 0,
          y: -15,
          z: 50,
          duration: 0.3,
          ease: 'power2.out'
        });
      }}
      onMouseLeave={(e) => {
        gsap.to(e.currentTarget, {
          rotateX: 5,
          y: 0,
          z: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      }}
    >
      {/* Icon */}
      <div className="mb-6 relative">
        <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-[10deg] transition-all duration-300">
          <Icon className="w-7 h-7 text-white" />
        </div>
        {/* Glow effect on hover */}
        <div className="absolute inset-0 w-14 h-14 rounded-xl bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Title */}
      <h3 className="text-xl font-medium text-white mb-3 group-hover:-translate-y-1 transition-transform duration-300">
        {skill.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-white/60 mb-6 leading-relaxed">
        {skill.description}
      </p>

      {/* Technologies */}
      <div className="flex flex-wrap gap-2">
        {skill.technologies.map((tech, i) => (
          <span 
            key={i}
            className="skill-tag px-3 py-1 text-xs font-medium bg-white/5 rounded-full text-white/70 border border-white/10 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
            style={{ transitionDelay: `${i * 50}ms` }}
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden rounded-tr-2xl">
        <div className="absolute top-0 right-0 w-[1px] h-12 bg-gradient-to-b from-white/30 to-transparent transform translate-x-[-10px] group-hover:translate-x-0 transition-transform duration-500" />
        <div className="absolute top-0 right-0 h-[1px] w-12 bg-gradient-to-l from-white/30 to-transparent transform translate-y-[-10px] group-hover:translate-y-0 transition-transform duration-500" />
      </div>
    </div>
  );
};

const Skills = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px)', () => {
      const triggers: ScrollTrigger[] = [];

      // Title animation
      const titleTrigger = ScrollTrigger.create({
        trigger: section,
        start: 'top 80%',
        onEnter: () => {
          gsap.fromTo('.skills-title',
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' }
          );
          gsap.fromTo('.skills-subtitle',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: 'expo.out' }
          );
        },
        once: true
      });
      triggers.push(titleTrigger);

      // Cards animation
      const cardsTrigger = ScrollTrigger.create({
        trigger: section,
        start: 'top 70%',
        onEnter: () => {
          gsap.fromTo('.skill-card',
            { rotateY: -90, scale: 0.8, opacity: 0 },
            { 
              rotateY: 0, 
              scale: 1, 
              opacity: 1, 
              duration: 0.6, 
              stagger: 0.1,
              ease: 'expo.out',
              delay: 0.3
            }
          );
        },
        once: true
      });
      triggers.push(cardsTrigger);

      // Scroll rotation effect
      const scrollTrigger = ScrollTrigger.create({
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          gsap.set('.skill-card', { rotateX: 5 - progress * 5 });
        }
      });
      triggers.push(scrollTrigger);

      return () => {
        triggers.forEach(trigger => trigger.kill());
      };
    });

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section 
      id="skills" 
      ref={sectionRef}
      className="relative bg-[#010101] py-20 md:py-32"
    >
      <div className="w-[95%] max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="skills-title text-4xl sm:text-5xl md:text-6xl font-medium text-white tracking-tight mb-4">
            Skills & Services
          </h2>
          <p className="skills-subtitle text-lg md:text-xl text-white/60 max-w-xl mx-auto">
            What I bring to every project
          </p>
        </div>

        {/* Skills Grid */}
        <div 
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          style={{ perspective: '800px' }}
        >
          {skills.map((skill, index) => (
            <SkillCard key={index} skill={skill} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
