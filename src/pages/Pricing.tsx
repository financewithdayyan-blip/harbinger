import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TIERS } from '../config/tiers';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { MarketingNav } from '../components/marketing/MarketingNav';
import { useAuth } from '../context/AuthContext';
import { isPaddleConfigured, openCheckout } from '../lib/paddle';
import './Landing.css';

type BillingPeriod = 'month' | 'year';

export default function Pricing() {
  const [billing, setBilling] = useState<BillingPeriod>('month');
  const [checkingOutTier, setCheckingOutTier] = useState<string | null>(null);
  const { user, session } = useAuth();
  const navigate = useNavigate();

  async function handleChoose(tier: (typeof TIERS)[number]) {
    if (!user || !session) {
      navigate('/signup');
      return;
    }
    if (!isPaddleConfigured()) {
      return;
    }
    setCheckingOutTier(tier.name);
    try {
      await openCheckout(tier.priceId[billing], user.id, user.email ?? undefined);
    } finally {
      setCheckingOutTier(null);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-navy)' }}>
      <MarketingNav />

      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="hb-grain" />
        <div
          className="hb-blob"
          style={{
            width: 360,
            height: 360,
            top: -120,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'radial-gradient(circle, rgba(245,166,35,0.3), transparent 70%)',
            animation: 'hb-float-slow 14s ease-in-out infinite',
          }}
        />
        <div style={{ position: 'relative', maxWidth: 1180, margin: '0 auto', textAlign: 'center', padding: '48px 16px 88px' }}>
          <h1 className="hb-fade-up" style={{ color: '#fff', fontSize: 32, marginBottom: 8 }}>
            Credit-based pricing
          </h1>
          <p className="hb-fade-up" style={{ color: 'rgba(248,246,241,0.7)', marginBottom: 12, animationDelay: '80ms' }}>
            Every plan includes a monthly pool of skiptrace credits.{' '}
            <span
              title="Each credit unlocks one lead's full contact info"
              style={{ borderBottom: '1px dotted rgba(248,246,241,0.5)', cursor: 'help' }}
            >
              Credits reveal hidden lead data ⓘ
            </span>
          </p>

          <div
            className="hb-fade-up"
            style={{
              display: 'inline-flex',
              background: 'rgba(248,246,241,0.08)',
              borderRadius: 999,
              padding: 4,
              marginBottom: 40,
              animationDelay: '120ms',
            }}
          >
            <ToggleButton active={billing === 'month'} onClick={() => setBilling('month')}>
              Monthly
            </ToggleButton>
            <ToggleButton active={billing === 'year'} onClick={() => setBilling('year')}>
              Yearly
            </ToggleButton>
          </div>

          <div
            className="hb-fade-up"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: 24,
              animationDelay: '180ms',
            }}
          >
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className="hb-card"
                style={{
                  background: '#fff',
                  borderRadius: 14,
                  padding: 24,
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                  border: '1px solid var(--color-border)',
                }}
              >
                <div>
                  <h3 style={{ fontSize: 18 }}>{tier.name}</h3>
                  <p style={{ color: 'var(--color-slate)', fontSize: 13, marginTop: 6 }}>{tier.description}</p>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {tier.listTypes.map((lt) => (
                    <Badge key={lt} tone="navy">
                      {lt}
                    </Badge>
                  ))}
                </div>

                <div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-navy)' }}>
                    {tier.skiptraceCredits === 'Unlimited'
                      ? 'Unlimited'
                      : tier.skiptraceCredits.toLocaleString()}{' '}
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-slate)' }}>
                      skiptrace credits/mo
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--color-slate-light)', marginTop: 2 }}>
                    Credits reveal hidden lead data
                  </div>
                </div>

                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {tier.features.map((f) => (
                    <li
                      key={f}
                      style={{
                        fontSize: 13,
                        color: 'var(--color-slate)',
                        display: 'flex',
                        gap: 8,
                        alignItems: 'flex-start',
                      }}
                    >
                      <span style={{ color: 'var(--color-amber-dark)', fontWeight: 700 }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleChoose(tier)}
                  loading={checkingOutTier === tier.name}
                  disabled={!isPaddleConfigured()}
                  style={{ width: '100%', marginTop: 'auto' }}
                >
                  {isPaddleConfigured() ? `Choose ${tier.name}` : 'Checkout coming soon'}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function ToggleButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="hb-btn"
      style={{
        border: 'none',
        borderRadius: 999,
        padding: '8px 20px',
        fontSize: 13,
        fontWeight: 700,
        cursor: 'pointer',
        background: active ? 'var(--color-amber)' : 'transparent',
        color: active ? 'var(--color-navy)' : 'rgba(248,246,241,0.75)',
      }}
    >
      {children}
    </button>
  );
}
