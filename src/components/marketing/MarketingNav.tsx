import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Logo } from '../ui/Logo';

export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: scrolled ? 'rgba(13, 27, 42, 0.75)' : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        borderBottom: `1px solid ${scrolled ? 'rgba(248,246,241,0.1)' : 'transparent'}`,
        transition: 'background-color 200ms ease, border-color 200ms ease',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: 1120,
          margin: '0 auto',
          padding: '20px 24px',
        }}
      >
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Logo size={30} color="#fff" />
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <NavLink to="/pricing">Pricing</NavLink>
          <NavLink to="/login">Log in</NavLink>
          <Link to="/signup" style={{ textDecoration: 'none' }}>
            <Button variant="primary">Get Started</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}

function NavLink({ to, children }: { to: string; children: string }) {
  return (
    <Link
      to={to}
      style={{
        position: 'relative',
        color: 'rgba(248,246,241,0.85)',
        fontSize: 14,
        fontWeight: 600,
        textDecoration: 'none',
      }}
      className="hb-nav-link"
    >
      {children}
    </Link>
  );
}
