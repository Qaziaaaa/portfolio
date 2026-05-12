

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
      className="group block bg-[#0c0c0c] border border-white/5 rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:border-white/10 hover:-translate-y-2 hover:shadow-2xl hover:shadow-white/[0.02]"
    >
      {/* Wireframe Placeholder */}
      <div className="bg-[#151515] rounded-xl p-6 sm:p-8 h-48 sm:h-56 mb-6 flex flex-col gap-4 relative overflow-hidden border border-white/[0.02]">
        {/* Animated gradient sweep effect on hover */}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.03] to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
        
        <div className="w-3/4 h-4 bg-white/5 rounded-full" />
        <div className="w-1/2 h-4 bg-white/5 rounded-full" />
        
        <div className="flex gap-3 mt-auto">
          <div className="w-16 h-8 bg-white/5 rounded-md" />
          <div className="w-16 h-8 bg-white/5 rounded-md" />
        </div>
      </div>

      <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
        {project.title}
      </h3>
      
      <p className="text-white/60 text-sm sm:text-base leading-relaxed mb-8 h-[4.5rem] sm:h-auto overflow-hidden">
        {project.description}
      </p>

      <button className="w-full py-3.5 sm:py-4 bg-[#151515] group-hover:bg-white/10 text-white/80 group-hover:text-white rounded-xl transition-colors font-medium text-sm sm:text-base">
        View Details
      </button>
    </CardRoot>
  );
};

const Work = () => {
  return (
    <section id="work" className="relative bg-[#010101] py-20 sm:py-32 overflow-hidden">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      <div className="relative z-10 w-[95%] max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 sm:mb-24 max-w-3xl">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight mb-6">
            Selected Work
          </h2>
          <p className="text-lg sm:text-xl text-white/60 leading-relaxed">
            A curated selection of full-stack projects focusing on user interface, modern architecture, and blazing fast performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Work;
