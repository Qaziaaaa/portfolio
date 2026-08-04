import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Home',     to: '/' },
  { label: 'Projects', to: '/projects' },
  { label: 'Contact',  to: '/contact' },
];

const Navigation = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  const close = () => setOpen(false);

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

          <button
            className="nav-toggle"
            onClick={() => setOpen(p => !p)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {open && (
        <div className="mobile-menu">
          <div className="mobile-menu-backdrop" onClick={close} />
          <div className="mobile-menu-panel">
            <p className="mobile-menu-label">navigation</p>
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) => `mobile-menu-link${isActive ? ' active' : ''}`}
                onClick={close}
              >
                {link.label}
              </NavLink>
            ))}
            <Link className="btn" to="/services" onClick={close}>
              Let&apos;s Talk
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
