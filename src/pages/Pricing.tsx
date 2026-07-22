import { Link } from 'react-router-dom';
import { PLAN_DETAILS, type Plan } from '../lib/types';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { MarketingNav } from '../components/marketing/MarketingNav';

const PLAN_ORDER: Plan[] = ['single_state', 'multi_state', 'nationwide'];

// TODO(stripe): Wire up Stripe Checkout / Billing Portal here once pricing is
// finalized. Each plan should create a Checkout Session for its price ID and
// redirect on success; the "Coming Soon" buttons below are placeholders.
export default function Pricing() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-navy)' }}>
      <MarketingNav />
      <div style={{ maxWidth: 960, margin: '0 auto', textAlign: 'center', padding: '32px 16px 64px' }}>
        <h1 style={{ color: '#fff', fontSize: 28, marginBottom: 8 }}>Simple, plan-based pricing</h1>
        <p style={{ color: 'rgba(248,246,241,0.7)', marginBottom: 40 }}>
          All plans are free while Harbinger is in early access.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          {PLAN_ORDER.map((plan) => {
            const details = PLAN_DETAILS[plan];
            return (
              <div
                key={plan}
                style={{
                  background: '#fff',
                  borderRadius: 12,
                  padding: 28,
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                }}
              >
                <div>
                  <h3 style={{ fontSize: 18 }}>{details.title}</h3>
                  <p style={{ color: 'var(--color-slate)', fontSize: 13, marginTop: 6 }}>{details.description}</p>
                </div>
                <Badge tone="amber">FREE (for now)</Badge>
                <div style={{ fontSize: 28, fontWeight: 800 }}>$0</div>
                <Button disabled style={{ width: '100%' }}>
                  Coming Soon
                </Button>
              </div>
            );
          })}
        </div>

        <p style={{ marginTop: 40 }}>
          <Link to="/signup" style={{ color: 'var(--color-amber)', fontWeight: 600 }}>
            Sign up free →
          </Link>
        </p>
      </div>
    </div>
  );
}
