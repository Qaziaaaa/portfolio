import type { KnowledgeChunk } from '../types';

export const projectsChunks: KnowledgeChunk[] = [
  {
    text: `NOVA — Premium E-Commerce Platform
Live at: ecommerce-store-one-ochre.vercel.app | Code on GitHub: github.com/Qaziaaaa/ecommerce-system
Stack: React 19, TypeScript, Node.js, Express, MongoDB Atlas, Stripe, Zustand, TanStack Query, Tailwind CSS, Cloudinary
Key Features:
• Passwordless OTP authentication (no passwords stored, JWT in HttpOnly cookies)
• Stripe credit card and Cash on Delivery checkout with payment intents and webhooks
• Real-time stock validation to prevent overselling race conditions
• In-memory API response caching with TTL and cache invalidation
• Live order tracking with 30-second polling
• Circuit breakers for Stripe, Cloudinary, and email services
• Admin panel with product management, order management, user management, and revenue analytics
• CSRF protection, rate limiting, Helmet security headers, Zod input validation`,
    metadata: { topic: 'projects', source: 'project-nova-ecommerce' },
  },
  {
    text: `xTRAI — AI Automation and Optimization Platform
Live at: agencyxai.netlify.app | Code on GitHub: github.com/Qaziaaaa/AI-Agency-app
Stack: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, shadcn/ui, Radix UI, TanStack Query
Key Features:
• AI-powered automation workflows that save time and reduce errors
• AI-powered insights and predictive analytics with real-time data
• Glass morphism design with backdrop blur effects and smooth scroll-triggered animations
• Multi-page app with React Router: Homepage, About, Blog, Contact
• Form management with React Hook Form and Zod validation
• Fully responsive mobile-first design`,
    metadata: { topic: 'projects', source: 'project-xtrai-ai' },
  },
  {
    text: `OLIPOP Creative — AI-Enhanced Product Experience
Live at: oliipop.netlify.app | Code on GitHub: github.com/Qaziaaaa/Olipop-animated-site
Stack: Next.js 15 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS, Framer Motion, Google Genkit AI, Firebase
Key Features:
• AI-powered features using Google Genkit AI for intelligent user interactions
• Immersive parallax scrolling and flavor-specific carousels with Framer Motion
• Fluid state transitions and smooth animations throughout
• Firebase backend integration`,
    metadata: { topic: 'projects', source: 'project-olipop' },
  },
  {
    text: `HIKI — Full-Stack Hiking Guide App
Live at: hiking-app-puce.vercel.app | Code on GitHub: github.com/Qaziaaaa
Stack: React, Node.js, Express, MongoDB, Cloudinary
Key Features:
• User authentication and authorization
• Trail discovery and management
• Admin dashboard for content management
• Blog system for hiking guides and tips
• Cloudinary integration for image uploads`,
    metadata: { topic: 'projects', source: 'project-hiki' },
  },
  {
    text: `QAZI-X — Cinematic Personal Portfolio
Live at: qazixcode.netlify.app | Code on GitHub: github.com/Qaziaaaa/Cinematic-Personal-Portfolio
Stack: Next.js, React 19, TypeScript, Tailwind CSS, Framer Motion
Key Features:
• Cinematic scroll-driven animations and smooth page transitions
• Futuristic cyberpunk OS-inspired design
• Fully responsive layout across all devices`,
    metadata: { topic: 'projects', source: 'project-portfolio' },
  },
  {
    text: `Current Portfolio (this website)
Live at: qaziahmad.vercel.app | Code on GitHub: github.com/Qaziaaaa/portfolio
Stack: React 19, TypeScript, Vite, Tailwind CSS, GSAP, shadcn/ui, Vercel
Key Features:
• RAG AI chatbot powered by Jina AI embeddings and Groq LLaMA 3.1
• GSAP ScrollTrigger animations throughout all sections
• Horizontal scroll work section with live project previews
• 3D perspective tilt cards on hover
• Particle canvas animation in hero`,
    metadata: { topic: 'projects', source: 'project-this-portfolio' },
  },
];
