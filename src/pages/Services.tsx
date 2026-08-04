import { Link } from 'react-router-dom';

const services = [
  { e: '🛒', t: 'MERN Full-Stack Apps', d: 'Production-grade e-commerce, SaaS, and dashboards with auth, payments, admin panels, and real security.' },
  { e: '🤖', t: 'AI Integration', d: 'Chatbots, RAG document Q&A, AI workflows, and automation powered by Groq, Jina AI, and LLM APIs.' },
  { e: '🎨', t: 'Landing Pages & Portfolios', d: 'High-end animated sites with Next.js, GSAP, and Framer Motion that look designed, not templated.' },
  { e: '🗄️', t: 'APIs & Backend', d: 'REST APIs, authentication, caching, rate limiting, and clean, secure deployment pipelines.' },
  { e: '📡', t: 'Real-Time Apps', d: 'WebRTC video, Socket.io chat, live dashboards, and real-time sync for collaborative products.' },
  { e: '⚡', t: 'Fix, Optimize & Ship', d: 'Take over existing projects: debug, speed up, secure, and push them live.' },
];

const steps = [
  { n: '1', t: 'Say hi', d: 'Email or WhatsApp me your idea — no pitch needed, just what you want to build.' },
  { n: '2', t: 'Plan', d: 'A quick call to nail down scope, timeline, and a fixed quote. No surprises.' },
  { n: '3', t: 'Build', d: 'I build in short sprints with updates, so you always know where things stand.' },
  { n: '4', t: 'Launch & support', d: 'Deployed to production, tested, and supported after launch.' },
];

const faqs = [
  { q: 'Are you available right now?', a: "Yes — I'm currently open to freelance projects, internships, and full-time roles. Reach out and I'll confirm current availability." },
  { q: 'What do you usually build?', a: 'MERN full-stack apps, AI features, landing pages, and real-time tools. See the Projects page for live examples of each.' },
  { q: 'How long does a project take?', a: 'Landing pages take days. Full-stack apps usually take 2–4 weeks depending on scope. We agree on a timeline before starting.' },
  { q: 'How much does it cost?', a: 'It depends on scope — I quote a fixed price after a short call. No hourly billing, no surprises mid-project.' },
  { q: 'Do you work with existing code?', a: 'Yes. I can take over, debug, optimize, or finish existing projects and ship them.' },
];

const Services = () => {
  return (
    <>
      <section style={{ paddingTop: 56, paddingBottom: 24 }}>
        <div className="wrap">
          <div className="pagehead">
            <span className="eyebrow">work with me</span>
            <h1>Hire me. Or just say hi.</h1>
            <p>
              I&apos;m Qazi — an AI web developer and MERN stack expert. I build fast, polished, production-ready web apps.
              Open to freelance, internships, and full-time.
            </p>
          </div>

          <div className="center">
            <span className="avail">✅ <b>Open to work</b> — freelance · internship · full-time</span>
          </div>

          <div className="cta-row" style={{ justifyContent: 'center', marginTop: 18, marginBottom: 8 }}>
            <a
              className="btn"
              href="https://wa.me/923141935787"
              target="_blank"
              rel="noopener noreferrer"
            >
              Let&apos;s Talk
            </a>
            <a className="btn ghost" href="mailto:qazithekingston@gmail.com">
              Email Me
            </a>
            <Link className="btn ghost" to="/projects">
              See My Work
            </Link>
            <a className="btn ghost" href="/resume.pdf" target="_blank" rel="noopener noreferrer">
              Download Resume
            </a>
          </div>
        </div>
      </section>

      <div className="torn" />

      <section style={{ padding: '44px 0' }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">services</span>
            <h2>What I build</h2>
            <p>Everything below is something I&apos;ve shipped for real — check the Projects page for live examples.</p>
          </div>

          <div className="grid3">
            {services.map(service => (
              <div className="fcard" key={service.t}>
                <span className="ic">{service.e}</span>
                <h3>{service.t}</h3>
                <p>{service.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="torn" />

      <section style={{ padding: '44px 0' }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">how it works</span>
            <h2>Four steps, start to finish</h2>
          </div>

          <div className="steps">
            {steps.map(step => (
              <div className="st" key={step.n}>
                <div className="num">{step.n}</div>
                <h4>{step.t}</h4>
                <p>{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="torn" />

      <section style={{ padding: '44px 0' }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">questions</span>
            <h2>The honest answers</h2>
          </div>

          <div className="faq">
            {faqs.map(faq => (
              <details key={faq.q}>
                <summary>{faq.q}</summary>
                <p>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <div className="torn" />

      <section style={{ padding: '44px 0' }}>
        <div className="wrap">
          <div className="closing tape">
            <span className="big">open to work</span>
            <h2>Have a project in mind?</h2>
            <p>
              Tell me what you want to build and I&apos;ll reply within a day with next steps and a quote.
              No pressure, no pitch.
            </p>
            <div className="cta-row" style={{ justifyContent: 'center' }}>
              <a
                className="btn"
                href="https://wa.me/923141935787"
                target="_blank"
                rel="noopener noreferrer"
              >
                Let&apos;s Talk
              </a>
              <a
                className="btn ghost"
                href="https://www.linkedin.com/in/qazi-farhan-ahmad/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Connect on LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Services;
