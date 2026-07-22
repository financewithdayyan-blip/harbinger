import { Link } from 'react-router-dom';
import type { Plan } from '../lib/types';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { MarketingNav } from '../components/marketing/MarketingNav';
import { PlanCard } from '../components/marketing/PlanCard';
import './Landing.css';

const PLAN_ORDER: Plan[] = ['single_state', 'multi_state', 'nationwide'];

// TODO(stripe): Wire up Stripe Checkout / Billing Portal here once pricing is
// finalized. Each plan should create a Checkout Session for its price ID and
// redirect on success; the "Coming Soon" buttons below are placeholders.
export default function Pricing() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-navy)' }}>
      <MarketingNav />

      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="hb-grain" />
        <div
          className="hb-blob"
          style={{
            width: 320,
            height: 320,
            top: -120,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'radial-gradient(circle, rgba(245,166,35,0.3), transparent 70%)',
            animation: 'hb-float-slow 14s ease-in-out infinite',
          }}
        />
        <div style={{ position: 'relative', maxWidth: 960, margin: '0 auto', textAlign: 'center', padding: '48px 16px 88px' }}>
          <h1 className="hb-fade-up" style={{ color: '#fff', fontSize: 32, marginBottom: 8 }}>
            Simple, plan-based pricing
          </h1>
          <p className="hb-fade-up" style={{ color: 'rgba(248,246,241,0.7)', marginBottom: 48, animationDelay: '80ms' }}>
            All plans are free while Harbinger is in early access.
          </p>

          <div
            className="hb-fade-up"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 28,
              animationDelay: '160ms',
            }}
          >
            {PLAN_ORDER.map((plan) => (
              <PlanCard key={plan} plan={plan} featured={plan === 'nationwide'}>
                <Badge tone="amber">FREE (for now)</Badge>
                <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-navy)' }}>$0</div>
                <Button disabled style={{ width: '100%' }}>
                  Coming Soon
                </Button>
              </PlanCard>
            ))}
          </div>

          <p style={{ marginTop: 48 }}>
            <Link to="/signup" style={{ color: 'var(--color-amber)', fontWeight: 600 }}>
              Sign up free →
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
