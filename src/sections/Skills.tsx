import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Doodle from '../components/Doodle';

gsap.registerPlugin(ScrollTrigger);

interface Skill {
  emoji: string;
  title: string;
  description: string;
  technologies: string[];
}

const skills: Skill[] = [
  {
    emoji: '🎨',
    title: 'Frontend Development',
    description: 'Building responsive, performant UIs with modern React patterns and TypeScript.',
    technologies: ['React 19', 'Next.js', 'TypeScript', 'Tailwind CSS', 'shadcn/ui', 'GSAP', 'Framer Motion', 'HTML5'],
  },
  {
    emoji: '⚙️',
    title: 'Backend Development',
    description: 'Secure, scalable REST APIs with JWT auth, rate limiting, and caching.',
    technologies: ['Node.js', 'Express.js', 'REST APIs', 'JWT Auth', 'Prisma', 'Redis'],
  },
  {
    emoji: '🗄️',
    title: 'Database & Payments',
    description: 'Data modeling, query optimization, and payment integration.',
    technologies: ['MongoDB', 'PostgreSQL', 'Firebase', 'Stripe', 'Webhooks'],
  },
  {
    emoji: '🤖',
    title: 'AI Integrations',
    description: 'Building AI-powered chatbots, automation systems, and smart API integrations.',
    technologies: ['Groq LLaMA 3.1', 'Jina AI', 'Google Gemini', 'OpenAI', 'Vercel AI SDK', 'Scikit-learn'],
  },
  {
    emoji: '🔒',
    title: 'Performance & Security',
    description: 'Core Web Vitals, code splitting, CSRF protection, and input validation.',
    technologies: ['Core Web Vitals', 'Code Splitting', 'CSRF', 'bcrypt', 'Input Validation', 'Git', 'Figma'],
  },
  {
    emoji: '☁️',
    title: 'DevOps & Deployment',
    description: 'CI/CD pipelines, cloud deployment, and containerization.',
    technologies: ['Vercel', 'Render', 'Netlify', 'Docker', 'GitHub Actions', 'Python'],
  },
];

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
            gsap.fromTo('.skills-header', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' });
            gsap.fromTo('.skill-card', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'expo.out', delay: 0.2, clearProps: 'transform' });
          },
          once: true,
        })
      );
      return () => { triggers.forEach(t => t.kill()); };
    });

    return () => { mm.revert(); };
  }, []);

  return (
    <section id="skills" ref={sectionRef}>
      <div className="wrap">
        <div className="sec-head skills-header">
          <span className="eyebrow">my skills</span>
          <h2>Skills &amp; Services</h2>
          <p>What I bring to every project</p>
        </div>

        <div className="grid3">
          {skills.map((skill, index) => (
            <div key={index} className="skill-card fcard">
              <span className="ic"><Doodle emoji={skill.emoji} /></span>
              <h3>{skill.title}</h3>
              <p>{skill.description}</p>
              <div className="gtags">
                {skill.technologies.map((tech, i) => (
                  <span key={i} className="gtag topic">{tech}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
