import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export function MarketingNav() {
  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: 1120,
        margin: '0 auto',
        padding: '24px 24px',
      }}
    >
      <Link to="/" style={{ textDecoration: 'none' }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>HARBINGER</div>
      </Link>

      <nav style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <Link to="/pricing" style={{ color: 'rgba(248,246,241,0.85)', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
          Pricing
        </Link>
        <Link to="/login" style={{ color: 'rgba(248,246,241,0.85)', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
          Log in
        </Link>
        <Link to="/signup" style={{ textDecoration: 'none' }}>
          <Button variant="primary">Get Started</Button>
        </Link>
      </nav>
    </header>
  );
}
