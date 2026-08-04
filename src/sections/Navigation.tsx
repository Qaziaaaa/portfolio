import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Home',     to: '/' },
  { label: 'Projects', to: '/projects' },
  { label: 'Contact',  to: '/contact' },
];

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="topbar">
        <div className="wrap">
          <Link className="brand" to="/">
            Qazi Farhan<span className="dot">.</span>
          </Link>

          <nav className="nav">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className="navlink"
              >
                {link.label}
              </NavLink>
            ))}
            <Link className="btn" to="/services">
              Let&apos;s Talk
            </Link>
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
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setIsMobileMenuOpen(false)}
                style={({ isActive }) => ({
                  fontFamily: "'Averia Serif Libre', Georgia, serif",
                  fontWeight: 700, fontSize: '1.6rem',
                  color: isActive ? '#C96F4C' : '#332E29',
                  background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: '6px 0',
                })}
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              className="btn"
              to="/services"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ marginTop: 16, alignSelf: 'flex-start', padding: '12px 24px' }}
            >
              Let&apos;s Talk
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
