interface Interest {
  e: string;
  t: string;
  d: string;
}

interface ContactLink {
  e: string;
  t: string;
  label: string;
  href: string;
}

const interests: Interest[] = [
  { e: '🤝', t: 'Brand collabs', d: 'Partnerships, sponsorships, or joint builds' },
  { e: '💼', t: 'Work opportunities', d: 'Freelance, internships, or full-time roles' },
  { e: '🚀', t: 'Projects & ideas', d: 'Fun builds, experiments, or ambitious products' },
];

const findme: ContactLink[] = [
  { e: '📧', t: 'Email', label: 'qazithekingston@gmail.com', href: 'mailto:qazithekingston@gmail.com' },
  { e: '💬', t: 'WhatsApp', label: '+92 314 1935787', href: 'https://wa.me/923141935787' },
  { e: '💼', t: 'LinkedIn', label: 'qazi-farhan-ahmad', href: 'https://www.linkedin.com/in/qazi-farhan-ahmad/' },
  { e: '🐙', t: 'GitHub', label: '@Qaziaaaa', href: 'https://github.com/Qaziaaaa' },
];

const ContactPage = () => {
  return (
    <section style={{ paddingTop: 56, paddingBottom: 40 }}>
      <div className="wrap">
        <div className="pagehead">
          <span className="eyebrow">come say</span>
          <h1>Hi there</h1>
          <p>I&apos;m always happy to talk shop — whether you have a project in mind, an idea to build, or just want to say hi, my inbox is open.</p>
        </div>

        <div className="contact-grid">
          <div className="contactbox tape">
            <h3>I&apos;d love to hear about</h3>
            <div className="inq">
              {interests.map(item => (
                <div className="row" key={item.t}>
                  <span className="e">{item.e}</span>
                  <div>
                    <b>{item.t}</b>
                    <br />
                    <span>{item.d}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="contactbox tape sage">
            <h3>Come find me</h3>
            <div className="linklist">
              {findme.map(item => (
                <a
                  key={item.t}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                >
                  <span className="e">{item.e}</span>
                  <div>
                    <b>{item.t}</b>
                    <span className="l">{item.label}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="note" style={{ marginTop: 28 }}>
          Usually a reply within a few days ☕
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
