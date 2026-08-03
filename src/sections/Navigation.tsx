import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Work',    id: 'work'    },
  { label: 'About',   id: 'about'   },
  { label: 'Contact', id: 'contact' },
];

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="topbar">
        <div className="wrap">
          <button className="brand" onClick={() => scrollTo('hero')}>
            Qazi Farhan<span className="dot">.</span>
          </button>

          <nav className="nav">
            {navLinks.map(link => (
              <button
                key={link.id}
                className={link.id === 'work' ? 'navlink active' : 'navlink'}
                onClick={() => scrollTo(link.id)}
              >
                {link.label}
              </button>
            ))}
            <button className="btn" onClick={() => scrollTo('contact')}>
              Let&apos;s Talk
            </button>
          </nav>

          {/* Hamburger */}
          <button
            className="md:hidden p-2"
            style={{ color: '#332E29', background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={() => setIsMobileMenuOpen(p => !p)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {isMobileMenuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 55 }}>
          <div
            style={{ position: 'absolute', inset: 0, background: 'rgba(51,46,41,.35)', backdropFilter: 'blur(4px)' }}
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div style={{
            position: 'absolute', right: 0, top: 0, bottom: 0, width: '75%', maxWidth: 320,
            background: '#FAF7F2', borderLeft: '1px dashed #E0D6C6',
            display: 'flex', flexDirection: 'column', gap: 8, padding: '96px 32px 32px',
          }}>
            <p style={{ fontFamily: 'Caveat, cursive', color: '#C96F4C', fontSize: '1.4rem', transform: 'rotate(-2deg)', marginBottom: 8 }}>
              navigation
            </p>
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                style={{
                  fontFamily: "'Averia Serif Libre', Georgia, serif",
                  fontWeight: 700, fontSize: '1.6rem', color: '#332E29',
                  background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: '6px 0',
                }}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => scrollTo('contact')}
              className="btn"
              style={{ marginTop: 16, alignSelf: 'flex-start', padding: '12px 24px' }}
            >
              Let&apos;s Talk
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
