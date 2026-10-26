"""Structured agent data: featured projects, contact, availability.

Single source of truth for the tool layer — mirrors the curated project
data shown on the site (five featured projects from the knowledge base).
"""

FEATURED_PROJECTS = [
    {
        "title": "NOVA E-Commerce Platform",
        "emoji": "\U0001f6d2",
        "stack": ["React 19", "TypeScript", "Node.js", "Express", "MongoDB", "Stripe"],
        "live": "https://nova-ecomm.vercel.app",
        "repo": "https://github.com/Qaziaaaa/ecommerce-system",
        "summary": "Production-grade MERN shopping platform with passwordless OTP auth, Stripe payments, real-time stock validation, and a full admin panel.",
    },
    {
        "title": "MyDocChat — RAG Chatbot",
        "emoji": "\U0001f4c4",
        "stack": ["React", "TypeScript", "Groq", "Jina AI", "Supabase", "Express", "MongoDB"],
        "live": "https://mydocchat.vercel.app",
        "repo": "https://github.com/Qaziaaaa/RAG-chatbot",
        "summary": "Upload documents and get streaming, grounded answers via RAG with Groq inference and Jina AI semantic embeddings.",
    },
    {
        "title": "Liquid Reveal",
        "emoji": "\U0001f4a7",
        "stack": ["React", "TypeScript", "GSAP", "npm"],
        "live": "",
        "repo": "https://github.com/Qaziaaaa/liquid-reveal",
        "summary": "Zero-dependency GSAP animation component published to npm, SSR-compatible with full TypeScript types.",
    },
    {
        "title": "SMIT Bootcamp LMS",
        "emoji": "\U0001f4da",
        "stack": ["TypeScript", "React", "Node.js", "Express", "MongoDB"],
        "live": "",
        "repo": "https://github.com/Qaziaaaa/SMIT-Bootcamp-LMS",
        "summary": "Student portal for bootcamp cohorts — attendance tracking, assignment submission, and role-based access.",
    },
    {
        "title": "Portfolio (qaziahmad.vercel.app)",
        "emoji": "\U0001f310",
        "stack": ["React 19", "TypeScript", "Vite", "Tailwind CSS", "GSAP"],
        "live": "https://qaziahmad.vercel.app",
        "repo": "https://github.com/Qaziaaaa/portfolio",
        "summary": "This site — Anthropic-inspired design, GSAP scroll animations, and this LangChain portfolio agent.",
    },
]

CONTACT = {
    "name": "Qazi Farhan Ahmad",
    "email": "qazithekingston@gmail.com",
    "phone": "+92 314 1935787",
    "whatsapp": "https://wa.me/923141935787",
    "github": "https://github.com/Qaziaaaa",
    "linkedin": "https://www.linkedin.com/in/qazi-farhan-ahmad/",
    "portfolio": "https://qaziahmad.vercel.app",
    "location": "Peshawar, Pakistan (open to remote worldwide)",
}

AVAILABILITY = (
    "Qazi is available for team lead roles, full-stack engineering positions, "
    "and freelance projects. Fastest response is by email "
    "(qazithekingston@gmail.com) or WhatsApp (+92 314 1935787)."
)
