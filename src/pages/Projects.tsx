import { useState } from 'react';

type Category = 'All' | 'Frontend' | 'Full Stack' | 'AI';

interface Project {
  title: string;
  description: string;
  tags: string[];
  link: string;
  emoji: string;
  category: Exclude<Category, 'All'>;
}

const categories: Category[] = ['All', 'Frontend', 'Full Stack', 'AI'];

const projects: Project[] = [
  {
    title: 'OLIPOP Animated Clone',
    description: 'Premium animated product page with parallax scrolling, flavor carousels, and AI-powered interactions.',
    tags: ['Next.js', 'Framer Motion', 'AI'],
    link: 'https://oliipop.netlify.app',
    emoji: '🥤',
    category: 'Frontend',
  },
  {
    title: 'QAZI-X Portfolio',
    description: 'Futuristic cyberpunk OS-inspired developer portfolio with cinematic animations.',
    tags: ['React', 'TypeScript', 'Framer Motion'],
    link: 'https://qazixcode.netlify.app',
    emoji: '🚀',
    category: 'Frontend',
  },
  {
    title: 'Vertex Design Lab',
    description: 'Creative studio portfolio with interactive UI, smooth motion, and modern design.',
    tags: ['React', 'Tailwind'],
    link: 'https://vertexdesignlab.netlify.app',
    emoji: '🎨',
    category: 'Frontend',
  },
  {
    title: 'AetherAI Landing',
    description: 'Ultra-premium landing page with Celestial Modernism design and 3D bevel elements.',
    tags: ['Next.js', 'GSAP'],
    link: 'https://aetherai-labs.vercel.app',
    emoji: '✨',
    category: 'Frontend',
  },
  {
    title: 'SAAS Dashboard',
    description: 'Modern SaaS dashboard with clean UI components and scalable responsive architecture.',
    tags: ['React', 'Tailwind'],
    link: 'https://landingpagesaas.netlify.app',
    emoji: '📊',
    category: 'Frontend',
  },
  {
    title: 'NOVA E-Commerce',
    description: 'Production-grade MERN shopping platform — Stripe payments, OTP auth, real-time stock, admin panel.',
    tags: ['MERN', 'Stripe', 'OTP Auth'],
    link: 'https://nova-ecomm.vercel.app',
    emoji: '🛒',
    category: 'Full Stack',
  },
  {
    title: 'HIKI Hiking App',
    description: 'Full-stack hiking app with trail discovery, authentication, admin dashboard, and blog.',
    tags: ['MERN', 'Cloudinary'],
    link: 'https://hiking-app-puce.vercel.app',
    emoji: '🥾',
    category: 'Full Stack',
  },
  {
    title: 'FreeMeet Video Conferencing',
    description: 'Real-time video conferencing with WebRTC, signaling server, and built-in chat.',
    tags: ['WebRTC', 'Real-time'],
    link: 'https://freemeet.vercel.app',
    emoji: '🎥',
    category: 'Full Stack',
  },
  {
    title: 'Forge Social',
    description: 'Full-stack social platform with news feed, user profiles, auth, and real-time interactions.',
    tags: ['Full Stack', 'Real-time'],
    link: 'https://forge-social.vercel.app',
    emoji: '💬',
    category: 'Full Stack',
  },
  {
    title: 'Hotel Booking System',
    description: 'MERN hotel booking platform with room management, reservations, and secure authentication.',
    tags: ['MERN', 'Auth'],
    link: 'https://ai-hotel-booking-system.vercel.app',
    emoji: '🏨',
    category: 'Full Stack',
  },
  {
    title: 'xTRAI',
    description: 'AI automation and optimization platform with insights, predictive analytics, and glassmorphism UI.',
    tags: ['Next.js', 'AI', 'Analytics'],
    link: 'https://agencyxai.netlify.app',
    emoji: '🤖',
    category: 'AI',
  },
  {
    title: 'MyDoc Chat',
    description: 'RAG chatbot that streams answers from your documents via Groq LLaMA and Jina AI embeddings.',
    tags: ['RAG', 'Groq LLaMA', 'Jina AI'],
    link: 'https://mydocchat.vercel.app',
    emoji: '📄',
    category: 'AI',
  },
  {
    title: 'StudyFlow AI',
    description: 'AI-powered study productivity platform with smart scheduling and progress tracking.',
    tags: ['AI', 'Productivity'],
    link: 'https://studyflow-ai-three.vercel.app',
    emoji: '📚',
    category: 'AI',
  },
  {
    title: 'AI Project Planner',
    description: 'AI-powered project planning tool with smart scheduling, task management, and productivity insights.',
    tags: ['AI', 'Planning'],
    link: 'https://ai-project-planner-rho.vercel.app',
    emoji: '📋',
    category: 'AI',
  },
  {
    title: 'Medical AI SaaS',
    description: 'Medical AI SaaS with patient management, diagnostic assistance, and data analytics.',
    tags: ['AI', 'Healthcare'],
    link: 'https://medical-ai-saas.vercel.app',
    emoji: '🏥',
    category: 'AI',
  },
];

const Projects = () => {
  const [filter, setFilter] = useState<Category>('All');

  const visible = filter === 'All' ? projects : projects.filter(p => p.category === filter);

  return (
    <section style={{ paddingTop: 56, paddingBottom: 40 }}>
      <div className="wrap">
        <div className="pagehead">
          <span className="eyebrow">the whole library</span>
          <h1>Projects</h1>
          <p>Every build has a live demo — click any card to open it. Shipped for real, not just screenshots.</p>
        </div>

        <div className="filters">
          <span className="flabel">filter by type</span>
          <div className="chips">
            {categories.map(cat => (
              <button
                key={cat}
                className={`chip${filter === cat ? ' active' : ''}`}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <p className="gcount">
          {visible.length} {visible.length === 1 ? 'project' : 'projects'}
          {filter !== 'All' ? ` in ${filter.toLowerCase()}` : ' in the library'} — more shipped regularly ✨
        </p>

        <div className="glib">
          {visible.map(project => (
            <a
              key={project.title}
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

export default Projects;
