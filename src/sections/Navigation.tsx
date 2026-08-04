import { Link, NavLink } from 'react-router-dom';

const navLinks = [
  { label: 'Home',     to: '/' },
  { label: 'Projects', to: '/projects' },
  { label: 'Contact',  to: '/contact' },
];

const Navigation = () => (
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
    </div>
  </header>
);

export default Navigation;
