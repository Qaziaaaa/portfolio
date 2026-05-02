import type { KnowledgeChunk } from '../types';

export const projectsChunks: KnowledgeChunk[] = [
  {
    text: `NOVA E-Commerce Platform (https://ecommerce-store-one-ochre.vercel.app/) — Source: https://github.com/Qaziaaaa/ecommerce-system. A production-grade full-stack MERN shopping platform built from scratch. Features: passwordless OTP authentication, in-memory API caching with TTL and cache invalidation, real-time stock updates to prevent overselling race conditions, Stripe credit card and Cash on Delivery checkout, live order tracking with 30s polling, circuit breakers for Stripe/Cloudinary/Email services, fully responsive admin panel and storefront, gzip compression, lazy loading, code splitting, and Core Web Vitals monitoring. Stack: React, TypeScript, Node.js, MongoDB, Stripe.`,
    metadata: { topic: 'projects', source: 'project-nova-ecommerce' },
  },
  {
    text: `HIKI — Full-stack MERN hiking guide app (https://hiking-app-puce.vercel.app/). Features trails discovery, user authentication, admin dashboard, and blog. Stack: React, Node.js, MongoDB, Cloudinary. A comprehensive application for hiking enthusiasts.`,
    metadata: { topic: 'projects', source: 'project-hiki' },
  },
  {
    text: `QAZI-X Portfolio — Futuristic cyberpunk OS-inspired developer portfolio (https://qazixcode.netlify.app/). Also available at https://porfolio-qazi.netlify.app/. Built with React, TypeScript, Tailwind CSS, and Framer Motion. Source: https://github.com/Qaziaaaa/Cinematic-Personal-Portfolio.`,
    metadata: { topic: 'projects', source: 'project-portfolio' },
  },
  {
    text: `OLIPOP Clone — Premium parallax product page with flavor carousel and cart (https://github.com/Qaziaaaa/Olipop-animated-site). Built with React, Tailwind CSS, and Framer Motion. Showcases advanced animation and scroll-driven design.`,
    metadata: { topic: 'projects', source: 'project-olipop' },
  },
  {
    text: `AI Agency App (https://github.com/Qaziaaaa/AI-Agency-app) — Modern AI agency web app with responsive design, polished animations, and scalable TypeScript architecture. Also built: Vertex Studio (https://github.com/Qaziaaaa/vertex-studio) and a Futuristic App (https://github.com/Qaziaaaa/futuristic-app) showcasing interactive UI components and motion design.`,
    metadata: { topic: 'projects', source: 'project-ai-agency' },
  },
  {
    text: `Real Estate Rental Platform (in progress) — Full-stack MERN rental and booking system. Features: JWT auth with role-based access (tenant/landlord/admin), property listing and booking, payment integration, email notifications, and map integration. Stack: React, Node.js, MongoDB, Stripe.`,
    metadata: { topic: 'projects', source: 'project-real-estate' },
  },
];
