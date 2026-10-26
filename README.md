# Qazi Farhan Ahmad — AI Web Developer Portfolio

> **Live:** [qaziahmad.vercel.app](https://qaziahmad.vercel.app) · **Email:** qazithekingston@gmail.com · **WhatsApp:** +92 314 1935787

**Qazi Farhan Ahmad** is an AI Web Developer and MERN Stack Expert based in Peshawar, Pakistan. This is his personal portfolio — built to showcase production-ready projects, technical skills, and availability for internships, freelance work, and full-time roles.

---

## What Makes This Portfolio Different

- **LangChain AI Agent** — Visitors can ask anything about Qazi's skills, projects, and availability. A server-side Python agent (LangChain tool loop) with RAG over 18 knowledge chunks — Jina AI embeddings, Groq inference, structured JSON responses. No API keys ship in the browser.
- **GSAP Animations** — Cinematic scroll-triggered animations, parallax, and 3D perspective transforms.
- **Live Project Previews** — Horizontal scroll section with real iframe previews of each project.
- **"Why Work With Me" Section** — Honest value propositions replacing fake testimonials.
- **SEO Optimized** — Schema.org Person markup, Google Search Console verified, canonical URLs.
- **Fully Responsive** — Mobile-first, works from 320px to 2560px.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, TypeScript, Vite 7, Tailwind CSS v3 |
| UI | shadcn/ui, Radix UI, Lucide React |
| Animations | GSAP 3 + ScrollTrigger |
| AI Agent | LangChain 1.x, LangGraph, FastAPI, Jina AI embeddings, Groq |
| Deployment | Vercel (static frontend + Python function) |

---

## AI Agent Architecture

```
browser ──POST /api/agent──► FastAPI (app.py, Vercel Python runtime)
                                │
                                ▼
                    create_agent() tool loop            agent/graph.py
                    ├─ search_knowledge  ─┐
                    ├─ list_projects     ─┤ RAG: 18 chunks → Jina embeddings
                    ├─ get_contact       ─┤ → InMemoryVectorStore (top-3,
                    └─ get_availability  ─┘   similarity ≥ 0.3)
                                │
                                ▼
                    ToolStrategy(AgentResponse)         agent/schemas.py
                    intent · blocks[] · sources[]       text | bullets |
                    trace[] · suggestions[]             project_card |
                                │                       contact_card
                                ▼
                    guardrail: grounded intent without tool evidence
                    → deterministic fallback response
                                │
                                ▼
frontend renders blocks as native components (cards, bullets,
links) — never parses markdown; follow-up chips come from
response.suggestions
```

| File | Role |
|---|---|
| `app.py` | FastAPI entrypoint — `POST /api/agent`, health checks |
| `agent/graph.py` | Agent construction, system prompt, normalization, guardrail |
| `agent/tools.py` | The four tools the model can call each turn |
| `agent/rag.py` | Jina embeddings + LangChain `InMemoryVectorStore` |
| `agent/knowledge/*.md` | 18 knowledge chunks (`## source-id` sections) |
| `agent/schemas.py` | Pydantic `AgentResponse` + block union |
| `tests/test_agent.py` | Offline pytest suite (fake model, no network) |

---

## Featured Projects by Qazi Farhan Ahmad

| Project | Description | Stack | Live |
|---|---|---|---|
| **NOVA E-Commerce** | Full-stack MERN platform — Stripe, OTP auth, real-time stock, admin panel | React, Node.js, MongoDB, Stripe | [Live](https://ecommerce-store-one-ochre.vercel.app/) |
| **xTRAI AI Agency** | AI automation platform with Framer Motion animations | React, TypeScript, Framer Motion | [Live](https://agencyxai.netlify.app) |
| **OLIPOP Creative** | AI-enhanced product page with Genkit AI + Firebase | Next.js 15, Genkit AI, Firebase | [Live](https://oliipop.netlify.app/) |
| **HIKI Hiking App** | Full-stack MERN hiking guide with auth and admin dashboard | MERN, Cloudinary | [Live](https://hiking-app-puce.vercel.app/) |
| **QAZI-X Portfolio** | Futuristic cyberpunk developer portfolio | Next.js, Framer Motion | [Live](https://qazixcode.netlify.app/) |

---

## Getting Started

```bash
# Frontend
npm install
npm run dev

# AI agent (Python 3.12+, separate terminal)
pip install -r requirements.txt
uvicorn app:app --port 8000
```

The Vite dev server proxies `/api/agent` → `http://127.0.0.1:8000`.

**Environment variables** (`.env`, server-side only — never bundled into the frontend):

```env
GROQ_API_KEY=your_groq_api_key_here      # free at console.groq.com
JINA_API_KEY=your_jina_api_key_here      # free at jina.ai

# optional LangSmith tracing
LANGSMITH_API_KEY=
LANGSMITH_PROJECT=portfolio-agent
```

On Vercel, set the same variables in **Project → Settings → Environment Variables**.

**Tests:**

```bash
python3 -m pytest tests/ -q    # offline agent suite (fake model, no network)
npm run build                  # type-check + production build
```

---

## Contact Qazi Farhan Ahmad

| Channel | Details |
|---|---|
| Email | qazithekingston@gmail.com |
| WhatsApp | +92 314 1935787 |
| LinkedIn | [linkedin.com/in/qazi-farhan-ahmad](https://www.linkedin.com/in/qazi-farhan-ahmad/) |
| Portfolio | [qaziahmad.vercel.app](https://qaziahmad.vercel.app) |

---

*Qazi Farhan Ahmad — AI Web Developer & MERN Stack Expert · Peshawar, Pakistan · Open to internships, freelance, and full-time roles.*
