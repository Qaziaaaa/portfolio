import type { KnowledgeChunk } from '../types';

export const projectsChunks: KnowledgeChunk[] = [
  {
    text: `NOVA — Premium E-Commerce Platform
Live at: nova-ecomm.vercel.app | Code on GitHub: github.com/Qaziaaaa/ecommerce-system
Stack: React 19, TypeScript, Node.js, Express, MongoDB Atlas, Stripe, Zustand, TanStack Query, Tailwind CSS
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
    text: `MyDocChat — RAG Chatbot
Live at: mydocchat.vercel.app | Code on GitHub: github.com/Qaziaaaa/RAG-chatbot
Stack: React, TypeScript, Groq LLaMA 3.1, Jina AI, Supabase, Express, MongoDB
Key Features:
• Upload files and get intelligent streaming answers via RAG
• Groq LLaMA 3.1 for real-time inference
• Jina AI embeddings for semantic search and context awareness
• Full MERN stack with Express API and MongoDB`,
    metadata: { topic: 'projects', source: 'project-rag-chatbot' },
  },
  {
    text: `Liquid Reveal — Reusable Animated Reveal Component
Code on GitHub: github.com/Qaziaaaa/liquid-reveal
Stack: React, TypeScript, GSAP, npm
Key Features:
• Published to npm as a reusable package
• Zero-dependency GSAP-powered animations
• SSR-compatible with full TypeScript types
• Handles GSAP setup, cleanup, and responsive animation config out of the box`,
    metadata: { topic: 'projects', source: 'project-liquid-reveal' },
  },
  {
    text: `SMIT Bootcamp LMS — Student Portal
Code on GitHub: github.com/Qaziaaaa/SMIT-Bootcamp-LMS
Stack: TypeScript, React, Node.js, Express, MongoDB
Key Features:
• Student attendance tracking and management
• Assignment submission and grading system
• Role-based access for admins and students`,
    metadata: { topic: 'projects', source: 'project-smit-lms' },
  },
  {
    text: `Current Portfolio (this website)
Live at: qaziahmad.vercel.app | Code on GitHub: github.com/Qaziaaaa/portfolio
Stack: React 19, TypeScript, Vite, Tailwind CSS, GSAP, Groq API, Jina AI
Key Features:
• RAG AI chatbot powered by Jina AI embeddings and Groq LLaMA 3.1
• GSAP ScrollTrigger animations throughout all sections
• 3D perspective tilt cards on hover
• Clean Anthropic-inspired design with full project showcase`,
    metadata: { topic: 'projects', source: 'project-this-portfolio' },
  },
];
