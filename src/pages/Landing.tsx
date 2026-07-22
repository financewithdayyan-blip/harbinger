import { Link } from 'react-router-dom';
import { MarketingNav } from '../components/marketing/MarketingNav';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { PLAN_DETAILS, type Plan } from '../lib/types';

const PLAN_ORDER: Plan[] = ['single_state', 'multi_state', 'nationwide'];

const LEAD_TYPES = [
  { label: 'Pre-Foreclosure', active: true },
  { label: 'Code Violations', active: true },
  { label: 'Probate', active: false },
  { label: 'Tax Delinquent', active: false },
  { label: 'Divorce', active: false },
];

const FEATURES = [
  {
    title: 'Skip-traced, ready to dial',
    body: 'Every record ships with owner phone numbers and emails already appended — no separate skip-tracing step.',
  },
  {
    title: 'Fresh leads, every day',
    body: 'New pre-foreclosure and code violation filings are pulled and matched to your plan on a daily cadence.',
  },
  {
    title: 'Filtered to your footprint',
    body: 'Pick your states and lead type once — your dashboard only ever shows records inside that footprint.',
  },
  {
    title: 'Built for volume',
    body: 'Bulk filters by date pulled, auction date, and county, plus checkbox select for export workflows.',
  },
];

const STEPS = [
  {
    step: '01',
    title: 'Choose your plan',
    body: 'Pick single-state, multi-state, or nationwide coverage and your lead type.',
  },
  {
    step: '02',
    title: 'Get matched leads daily',
    body: 'Distressed property records in your footprint land in your dashboard as they’re pulled.',
  },
  {
    step: '03',
    title: 'Reach owners first',
    body: 'Call or text off the appended contact info before the record hits anyone else’s list.',
  },
];

export default function Landing() {
  return (
    <div style={{ background: 'var(--color-navy)' }}>
      <MarketingNav />

      {/* Hero */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '64px 24px 80px', textAlign: 'center' }}>
        <Badge tone="amber">Skip-traced distressed property leads</Badge>
        <h1
          style={{
            color: '#fff',
            fontSize: 'clamp(32px, 6vw, 56px)',
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            margin: '20px 0 16px',
          }}
        >
          First to know.
          <br />
          First to close.
        </h1>
        <p style={{ color: 'rgba(248,246,241,0.75)', fontSize: 18, maxWidth: 620, margin: '0 auto 32px' }}>
          Harbinger delivers pre-foreclosure and code violation records the moment they hit public
          record — already skip-traced with owner phone numbers and emails — so you're the first
          call the owner ever gets.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/signup" style={{ textDecoration: 'none' }}>
            <Button variant="primary" style={{ padding: '14px 28px', fontSize: 15 }}>
              Get Started Free
            </Button>
          </Link>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <Button variant="ghost" style={{ padding: '14px 28px', fontSize: 15, borderColor: 'rgba(248,246,241,0.3)', color: '#fff' }}>
              Log in
            </Button>
          </Link>
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginTop: 40 }}>
          {LEAD_TYPES.map((t) => (
            <span
              key={t.label}
              style={{
                fontSize: 13,
                fontWeight: 600,
                padding: '6px 14px',
                borderRadius: 999,
                border: `1px solid ${t.active ? 'var(--color-amber)' : 'rgba(248,246,241,0.2)'}`,
                color: t.active ? 'var(--color-amber)' : 'rgba(248,246,241,0.4)',
              }}
            >
              {t.label}
              {!t.active && ' · soon'}
            </span>
          ))}
        </div>
      </section>

      {/* Feature grid */}
      <section style={{ background: 'var(--color-offwhite)', padding: '72px 24px' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <h2 style={{ fontSize: 28, textAlign: 'center', marginBottom: 12 }}>Built for speed to first contact</h2>
          <p style={{ textAlign: 'center', color: 'var(--color-slate)', maxWidth: 560, margin: '0 auto 48px' }}>
            Everything about Harbinger is designed around one number: how fast you can get an owner
            on the phone after a record becomes public.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
            {FEATURES.map((f) => (
              <div
                key={f.title}
                style={{
                  background: '#fff',
                  border: '1px solid var(--color-border)',
                  borderRadius: 12,
                  padding: 24,
                }}
              >
                <h3 style={{ fontSize: 16, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--color-slate)', margin: 0 }}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '72px 24px' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <h2 style={{ fontSize: 28, textAlign: 'center', color: '#fff', marginBottom: 48 }}>How it works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 32 }}>
            {STEPS.map((s) => (
              <div key={s.step}>
                <div style={{ color: 'var(--color-amber)', fontSize: 14, fontWeight: 800, marginBottom: 8 }}>
                  {s.step}
                </div>
                <h3 style={{ fontSize: 18, color: '#fff', marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: 'rgba(248,246,241,0.65)', margin: 0 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans teaser */}
      <section style={{ background: 'var(--color-offwhite)', padding: '72px 24px' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 28, marginBottom: 8 }}>Pick your coverage</h2>
          <p style={{ color: 'var(--color-slate)', marginBottom: 40 }}>
            Free during early access. Choose how much ground you want to cover.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, textAlign: 'left' }}>
            {PLAN_ORDER.map((plan) => {
              const details = PLAN_DETAILS[plan];
              return (
                <div
                  key={plan}
                  style={{
                    background: '#fff',
                    border: '1px solid var(--color-border)',
                    borderRadius: 12,
                    padding: 24,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                  }}
                >
                  <h3 style={{ fontSize: 17 }}>{details.title}</h3>
                  <p style={{ fontSize: 13, color: 'var(--color-slate)', margin: 0 }}>{details.description}</p>
                  <Badge tone="amber">FREE (for now)</Badge>
                </div>
              );
            })}
          </div>
          <Link to="/pricing" style={{ display: 'inline-block', marginTop: 32, color: 'var(--color-navy)', fontWeight: 600 }}>
            See full pricing details →
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 28, color: '#fff', marginBottom: 12 }}>Be first to the door.</h2>
        <p style={{ color: 'rgba(248,246,241,0.7)', marginBottom: 28 }}>
          Set up your account in under two minutes — no card required.
        </p>
        <Link to="/signup" style={{ textDecoration: 'none' }}>
          <Button variant="primary" style={{ padding: '14px 28px', fontSize: 15 }}>
            Get Started Free
          </Button>
        </Link>
      </section>

      <footer
        style={{
          borderTop: '1px solid rgba(248,246,241,0.1)',
          padding: '24px',
          textAlign: 'center',
          color: 'rgba(248,246,241,0.4)',
          fontSize: 12,
        }}
      >
        © {new Date().getFullYear()} Harbinger. All rights reserved.
      </footer>
    </div>
  );
}
