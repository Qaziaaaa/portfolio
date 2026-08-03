import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Code2, Server, Database, Bot, Zap, Cloud } from 'lucide-react';

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
    description: 'Building responsive, performant UIs with modern React patterns and TypeScript.',
    technologies: ['React 19', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Zustand', 'TanStack Query'],
  },
  {
    icon: Server,
    title: 'Backend Development',
    description: 'Secure, scalable REST APIs with JWT auth, rate limiting, and caching.',
    technologies: ['Node.js', 'Express.js', 'REST APIs', 'JWT Auth', 'Rate Limiting', 'Caching'],
  },
  {
    icon: Database,
    title: 'Database & Payments',
    description: 'Data modeling, query optimization, and Stripe payment integration.',
    technologies: ['MongoDB Atlas', 'Mongoose', 'PostgreSQL', 'Stripe', 'Webhooks'],
  },
  {
    icon: Bot,
    title: 'AI Integrations',
    description: 'Building AI-powered chatbots, automation systems, and smart API integrations.',
    technologies: ['RAG Chatbots', 'Groq LLM', 'Jina AI', 'Genkit AI', 'OpenAI API', 'Automation'],
  },
  {
    icon: Zap,
    title: 'Performance & Security',
    description: 'Core Web Vitals, code splitting, CSRF protection, and circuit breakers.',
    technologies: ['Core Web Vitals', 'Code Splitting', 'CSRF', 'bcrypt', 'Input Validation'],
  },
  {
    icon: Cloud,
    title: 'DevOps & Deployment',
    description: 'CI/CD pipelines, cloud deployment, and environment management.',
    technologies: ['Vercel', 'Render', 'Netlify', 'Cloudinary', 'Docker', 'Git'],
  },
];

const SkillCard = ({ skill }: { skill: Skill }) => {
  const Icon = skill.icon;

  return (
    <div className="skill-card group bg-white rounded-2xl p-6 sm:p-8 shadow-warm hover:shadow-warm-lg transition-shadow duration-300 border border-cream-300/60">
      {/* Icon box */}
      <div className="mb-5">
        <div className="w-12 h-12 rounded-xl bg-terra-500/10 flex items-center justify-center">
          <Icon className="w-6 h-6 text-terra-500" />
        </div>
      </div>

      {/* Title */}
      <h3 className="font-serif text-lg font-semibold text-charcoal-900 mb-2">{skill.title}</h3>

      {/* Description */}
      <p className="text-sm text-charcoal-800/70 mb-5 leading-relaxed">{skill.description}</p>

      {/* Tech tags */}
      <div className="flex flex-wrap gap-2">
        {skill.technologies.map((tech, i) => (
          <span
            key={i}
            className="px-3 py-1 text-xs font-medium bg-cream-200 rounded-full text-charcoal-800/80 border border-cream-300"
          >
            {tech}
          </span>
        ))}
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

      triggers.push(
        ScrollTrigger.create({
          trigger: section,
          start: 'top 80%',
          onEnter: () => {
            gsap.fromTo('.skills-header',
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' }
            );
          },
          once: true,
        }),
        ScrollTrigger.create({
          trigger: section,
          start: 'top 70%',
          onEnter: () => {
            gsap.fromTo('.skill-card',
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'expo.out', delay: 0.2 }
            );
          },
          once: true,
        })
      );

      return () => { triggers.forEach(t => t.kill()); };
    });

    return () => { mm.revert(); };
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="bg-cream-200/50 py-24"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="skills-header text-center mb-16">
          <p className="font-hand text-terra-500 text-xl mb-2">my skills</p>
          <h2 className="font-serif text-4xl sm:text-5xl font-semibold text-charcoal-900 mb-4">
            Skills &amp; Services
          </h2>
          <p className="text-charcoal-800/60 max-w-md mx-auto">
            What I bring to every project
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, index) => (
            <SkillCard key={index} skill={skill} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
