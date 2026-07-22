import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

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
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ position: 'relative', display: 'inline-flex', width: 8, height: 8 }}>
            <span
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                background: 'var(--color-amber)',
                animation: 'hb-pulse-ring 1.8s cubic-bezier(0.4,0,0.6,1) infinite',
              }}
            />
            <span
              style={{
                position: 'relative',
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'var(--color-amber)',
              }}
            />
          </span>
          <span style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>HARBINGER</span>
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
