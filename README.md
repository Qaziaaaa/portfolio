# Qazi Farhan Ahmad — Portfolio

**Live:** [qaziahmad.vercel.app](https://qaziahmad.vercel.app)  
**GitHub:** [github.com/Qaziaaaa](https://github.com/Qaziaaaa)  
**LinkedIn:** [linkedin.com/in/qazi-farhan-ahmad-7a3b3432b](https://www.linkedin.com/in/qazi-farhan-ahmad-7a3b3432b/)

---

## About

Personal portfolio for Qazi Farhan Ahmad — a Frontend-focused Full Stack Developer and BS Software Engineering student (4th Semester) at the University of Peshawar, Pakistan. Built to showcase real projects, skills, and availability for internships, freelance work, and full-time roles.

---

## Features

- **RAG AI Chatbot** — Visitors can ask questions about Qazi's skills, projects, and experience. Powered by Jina AI embeddings (vector search) and Groq LLaMA 3.1 (streaming LLM). Fully client-side with Vercel serverless API proxies.
- **GSAP Animations** — Scroll-triggered entrance animations, parallax effects, and 3D perspective transforms throughout all sections.
- **Horizontal Scroll Work Section** — Live iframe previews of projects with a pinned horizontal scroll experience.
- **3D Tilt Cards** — Mouse-tracking perspective tilt on experience and skill cards.
- **Particle Canvas** — Animated particle network in the hero section.
- **Fully Responsive** — Mobile-first design, works from 320px to 2560px.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, TypeScript, Vite 7, Tailwind CSS v3 |
| UI Components | shadcn/ui, Radix UI, Lucide React |
| Animations | GSAP 3 + ScrollTrigger, CSS animations |
| AI Chatbot | Jina AI (embeddings), Groq (LLaMA 3.1), in-memory vector store |
| Deployment | Vercel (frontend + serverless API routes) |

---

## Project Structure

```
src/
├── sections/          # Page sections (Hero, About, Experience, Skills, Work, Contact, Footer)
├── components/
│   ├── chatbot/       # RAG chatbot widget (ChatbotWidget, ChatPanel, MessageBubble, useChatbot)
│   └── ui/            # shadcn/ui components (40+)
├── lib/
│   └── chatbot/       # RAG pipeline (vectorStore, jinaClient, groqClient, retriever, initializer)
│       └── knowledge/ # Knowledge base data files (bio, skills, experience, projects, contact)
├── hooks/             # Custom React hooks
└── test/              # Vitest test setup

api/
├── embed.ts           # Vercel serverless: proxies Jina AI embeddings
└── chat.ts            # Vercel serverless: proxies Groq streaming completions
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Create .env file with your API keys
cp .env.example .env

# Start dev server
npm run dev
```

### Environment Variables

```env
VITE_JINA_API_KEY=your_jina_api_key_here
VITE_GROQ_API_KEY=your_groq_api_key_here
```

Get free keys at:
- Jina AI: [jina.ai](https://jina.ai)
- Groq: [console.groq.com](https://console.groq.com)

---

## Deployment (Vercel)

1. Push to GitHub
2. Import repo in Vercel
3. Add environment variables in Vercel dashboard: `VITE_JINA_API_KEY` and `VITE_GROQ_API_KEY`
4. Deploy

The `api/` directory is automatically picked up as Vercel serverless functions.

---

## Featured Projects

| Project | Stack | Live |
|---|---|---|
| NOVA E-Commerce | React, Node.js, MongoDB, Stripe | [ecommerce-store-one-ochre.vercel.app](https://ecommerce-store-one-ochre.vercel.app/) |
| xTRAI AI Agency | React, TypeScript, Framer Motion | [agencyxai.netlify.app](https://agencyxai.netlify.app) |
| OLIPOP Creative | Next.js 15, Genkit AI, Firebase | [oliipop.netlify.app](https://oliipop.netlify.app/) |
| HIKI Hiking App | MERN Stack, Cloudinary | [hiking-app-puce.vercel.app](https://hiking-app-puce.vercel.app/) |
| QAZI-X Portfolio | Next.js, Framer Motion | [qazixcode.netlify.app](https://qazixcode.netlify.app/) |

---

## Contact

- **WhatsApp:** [wa.me/923141935787](https://wa.me/923141935787)
- **LinkedIn:** [linkedin.com/in/qazi-farhan-ahmad-7a3b3432b](https://www.linkedin.com/in/qazi-farhan-ahmad-7a3b3432b/)
- **GitHub:** [github.com/Qaziaaaa](https://github.com/Qaziaaaa)

---

© 2025 Qazi Farhan Ahmad. MIT License.
