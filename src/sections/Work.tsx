import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  link: string;
  emoji: string;
}

const projects: Project[] = [
  {
    id: 0,
    link: 'https://ecommerce-store-one-ochre.vercel.app/',
    title: 'NOVA E-Commerce',
    description: 'Production-grade MERN shopping platform — Stripe payments, OTP auth, real-time stock, admin panel.',
    tags: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    emoji: '🛒',
  },
  {
    id: 1,
    link: 'https://hiking-app-puce.vercel.app/',
    title: 'HIKI Hiking App',
    description: 'Full-stack MERN hiking app with trail discovery, authentication, admin dashboard, and blog.',
    tags: ['MERN', 'Full Stack', 'Cloudinary'],
    emoji: '🥾',
  },
  {
    id: 2,
    link: 'https://qazixcode.netlify.app/',
    title: 'QAZI-X Portfolio',
    description: 'Futuristic cyberpunk OS-inspired developer portfolio with cinematic animations.',
    tags: ['React', 'TypeScript', 'Framer Motion'],
    emoji: '🚀',
  },
  {
    id: 3,
    link: 'https://agencyxai.netlify.app',
    title: 'Agency X AI',
    description: 'Modern AI agency landing page with sophisticated animations and glassmorphism design.',
    tags: ['Next.js', 'AI', 'Framer Motion'],
    emoji: '🤖',
  },
  {
    id: 4,
    link: 'https://github.com/Qaziaaaa/Olipop-animated-site',
    title: 'OLIPOP Animated Clone',
    description: 'Premium parallax product page with flavor carousel, smooth scroll, and cart interactions.',
    tags: ['React', 'Tailwind', 'Framer Motion'],
    emoji: '🥤',
  },
];

const Work = () => {
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
          once: true,
          onEnter: () => {
            gsap.fromTo('.work-header', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' });
            gsap.fromTo('.gcard', { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.09, ease: 'expo.out', delay: 0.15, clearProps: 'transform' });
          },
        })
      );
      return () => triggers.forEach(t => t.kill());
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="work" ref={sectionRef} style={{ paddingTop: 72 }}>
      <div className="wrap">
        <div className="sec-head work-header">
          <span className="eyebrow">selected work</span>
          <h2>Selected Work</h2>
          <p>A curated selection of full-stack projects focusing on user interface, modern architecture, and performance.</p>
        </div>

        <div className="glib">
          {projects.map(project => (
            <a
              key={project.id}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="gcard"
              aria-label={`View ${project.title}`}
            >
              <span className="ic" style={{ fontSize: '1.6rem', marginBottom: 10 }}>{project.emoji}</span>
              <h3>{project.title}</h3>
              <p style={{ fontSize: '.9rem', color: 'var(--ink-soft)', marginBottom: 14, flex: 1 }}>{project.description}</p>
              <div className="gtags">
                {project.tags.map((tag, i) => (
                  <span key={i} className="gtag tool">{tag}</span>
                ))}
              </div>
              <span className="read">View project →</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Work;
