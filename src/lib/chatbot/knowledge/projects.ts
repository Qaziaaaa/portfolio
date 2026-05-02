import type { KnowledgeChunk } from '../types';

export const projectsChunks: KnowledgeChunk[] = [
  {
    text: `NOVA — Premium E-Commerce Platform
Live: https://ecommerce-store-one-ochre.vercel.app/ | Code: https://github.com/Qaziaaaa/ecommerce-system
Stack: React 19, TypeScript, Node.js, Express, MongoDB Atlas, Stripe, Zustand, TanStack Query, Tailwind CSS, Cloudinary, Vercel + Render
Description: A production-grade full-stack MERN e-commerce platform built from scratch with a focus on security, performance, and real-world reliability.
Key Features:
- Passwordless OTP authentication (no passwords stored, JWT in HttpOnly cookies)
- Stripe credit card + Cash on Delivery checkout with payment intents and webhooks
- Real-time stock validation using MongoDB bulkWrite with $gte filter to prevent overselling race conditions
- In-memory API response caching with TTL and cache invalidation
- Live order tracking with 30-second polling
- Circuit breakers for Stripe, Cloudinary, and email services
- Admin panel: product management, order management, user management, revenue analytics with Recharts
- Gzip compression, lazy-loaded routes, skeleton placeholders, Core Web Vitals monitoring
- CSRF protection, rate limiting, Helmet security headers, Zod input validation`,
    metadata: { topic: 'projects', source: 'project-nova-ecommerce' },
  },
  {
    text: `xTRAI — AI Automation & Optimization Platform
Live: https://agencyxai.netlify.app | Code: https://github.com/Qaziaaaa/AI-Agency-app
Stack: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, shadcn/ui, Radix UI, TanStack Query, React Hook Form, Zod
Description: A cutting-edge AI agency web application designed to empower businesses with intelligent automation, helping them scale faster, reduce operational costs, and streamline workflows. Features a sleek metallic purple aesthetic with advanced animations.
Key Features:
- Intelligent automation workflows that save time and reduce errors
- AI-powered insights and predictive analytics with real-time data
- Glass morphism design with backdrop blur effects
- Smooth scroll-triggered animations and micro-interactions with Framer Motion
- Multi-page app: Homepage, About, Blog, Contact with React Router
- Form management with React Hook Form + Zod validation
- Fully responsive mobile-first design
- Comprehensive test coverage with Vitest and Testing Library`,
    metadata: { topic: 'projects', source: 'project-xtrai-ai' },
  },
  {
    text: `OLIPOP Creative — AI-Enhanced Product Experience
Live: https://oliipop.netlify.app/ | Code: https://github.com/Qaziaaaa/Olipop-animated-site
Stack: Next.js 15 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS, Framer Motion, shadcn/ui, Google Genkit AI, Firebase
Description: A high-end immersive product landing page reimagining the Olipop brand experience with modern web technologies and AI integration.
Key Features:
- AI-powered features using Google Genkit AI for intelligent user interactions
- Immersive parallax scrolling and flavor-specific carousels with Framer Motion
- Fluid state transitions and smooth animations throughout
- Next.js 15 with Turbopack for peak performance
- Firebase backend integration
- Clean vibrant product UI with Tailwind CSS and shadcn/ui components`,
    metadata: { topic: 'projects', source: 'project-olipop' },
  },
  {
    text: `HIKI — Full-Stack Hiking Guide App
Live: https://hiking-app-puce.vercel.app/ | Code: https://github.com/Qaziaaaa/Qaziaaaa
Stack: React, Node.js, Express, MongoDB, Cloudinary, Vercel
Description: A comprehensive full-stack MERN application for hiking enthusiasts featuring trail discovery, user authentication, admin dashboard, and a blog system.
Key Features:
- User authentication and authorization
- Trail discovery and management
- Admin dashboard for content management
- Blog system for hiking guides and tips
- Cloudinary integration for image uploads
- Fully responsive design`,
    metadata: { topic: 'projects', source: 'project-hiki' },
  },
  {
    text: `QAZI-X — Cinematic Personal Portfolio
Live: https://qazixcode.netlify.app/ | Code: https://github.com/Qaziaaaa/Cinematic-Personal-Portfolio
Stack: Next.js, React 19, TypeScript, Tailwind CSS, Framer Motion, Firebase Studio
Description: A futuristic cyberpunk OS-inspired developer portfolio with cinematic animations, smooth transitions, and a fully responsive layout. Showcases projects, skills, and experience with immersive visual storytelling.
Key Features:
- Cinematic scroll-driven animations
- Smooth page transitions
- Responsive layout across all devices
- Modern dark aesthetic with futuristic design elements`,
    metadata: { topic: 'projects', source: 'project-portfolio' },
  },
  {
    text: `Current Portfolio (this site)
Live: https://qaziahmad.vercel.app | Code: https://github.com/Qaziaaaa/portfolio
Stack: React 19, TypeScript, Vite, Tailwind CSS, GSAP, shadcn/ui, Vercel
Description: This portfolio website featuring cinematic GSAP animations, a RAG AI chatbot (powered by Jina AI embeddings + Groq LLM), horizontal scroll project showcase, 3D tilt cards, and particle effects.
Key Features:
- RAG AI chatbot with Jina AI embeddings and Groq LLaMA 3.1 for answering questions about Qazi
- GSAP ScrollTrigger animations throughout all sections
- Horizontal scroll work section with live project previews
- 3D perspective tilt cards on hover
- Particle canvas animation in hero
- Fully responsive with mobile-first design`,
    metadata: { topic: 'projects', source: 'project-this-portfolio' },
  },
];
