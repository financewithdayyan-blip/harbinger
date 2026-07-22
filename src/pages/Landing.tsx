import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { MarketingNav } from '../components/marketing/MarketingNav';
import { PlanCard } from '../components/marketing/PlanCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import type { Plan } from '../lib/types';
import './Landing.css';

const PLAN_ORDER: Plan[] = ['single_state', 'multi_state', 'nationwide'];

const LEAD_TYPES = [
  { label: 'Pre-Foreclosure', active: true },
  { label: 'Code Violations', active: true },
  { label: 'Probate', active: false },
  { label: 'Tax Delinquent', active: false },
  { label: 'Divorce', active: false },
];

const TICKER_ITEMS = [
  'New Pre-Foreclosure · Maricopa County, AZ · 3m ago',
  'New Code Violation · Fulton County, GA · 9m ago',
  'New Pre-Foreclosure · Broward County, FL · 14m ago',
  'New Code Violation · Cook County, IL · 22m ago',
  'New Pre-Foreclosure · Harris County, TX · 31m ago',
  'New Code Violation · Wayne County, MI · 44m ago',
];

const FEATURES = [
  {
    mark: '⚡',
    title: 'Skip-traced, ready to dial',
    body: 'Every record ships with owner phone numbers and emails already appended — no separate skip-tracing step, no waiting on a vendor.',
  },
  {
    mark: '↻',
    title: 'Fresh leads, every day',
    body: 'New filings, daily.',
  },
  {
    mark: '⌖',
    title: 'Filtered to your footprint',
    body: 'Only your states, only your lead type.',
  },
  {
    mark: '▤',
    title: 'Built for volume',
    body: 'Bulk filters, checkbox export.',
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

function GhostOnNavy({ children }: { children: ReactNode }) {
  return (
    <Button
      variant="ghost"
      style={{ padding: '14px 28px', fontSize: 15, borderColor: 'rgba(248,246,241,0.3)', color: '#fff' }}
    >
      {children}
    </Button>
  );
}

export default function Landing() {
  return (
    <div style={{ background: 'var(--color-navy)', overflowX: 'clip' }}>
      <MarketingNav />

      {/* Hero */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="hb-grain" />
        <div
          className="hb-blob"
          style={{
            width: 420,
            height: 420,
            top: -140,
            right: -100,
            background: 'radial-gradient(circle, rgba(245,166,35,0.35), transparent 70%)',
            animation: 'hb-float-slow 14s ease-in-out infinite',
          }}
        />
        <div
          className="hb-blob"
          style={{
            width: 340,
            height: 340,
            bottom: -120,
            left: -80,
            background: 'radial-gradient(circle, rgba(22,40,61,0.9), transparent 70%)',
            animation: 'hb-float 16s ease-in-out infinite',
          }}
        />

        <div style={{ position: 'relative', maxWidth: 900, margin: '0 auto', padding: '64px 24px 0', textAlign: 'center' }}>
          <span
            className="hb-fade-up"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(245,166,35,0.12)',
              color: 'var(--color-amber)',
              fontSize: 12,
              fontWeight: 700,
              padding: '6px 14px',
              borderRadius: 999,
            }}
          >
            <span style={{ position: 'relative', display: 'inline-flex', width: 7, height: 7 }}>
              <span
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  background: 'var(--color-amber)',
                  animation: 'hb-pulse-ring 1.8s cubic-bezier(0.4,0,0.6,1) infinite',
                }}
              />
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--color-amber)' }} />
            </span>
            LIVE FEED · SKIP-TRACED DISTRESSED PROPERTY LEADS
          </span>

          <h1
            className="hb-fade-up"
            style={{
              color: '#fff',
              fontSize: 'clamp(36px, 7vw, 64px)',
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              margin: '22px 0 18px',
              animationDelay: '80ms',
            }}
          >
            First to know.
            <br />
            <span style={{ color: 'var(--color-amber)' }}>First to close.</span>
          </h1>
          <p
            className="hb-fade-up"
            style={{
              color: 'rgba(248,246,241,0.75)',
              fontSize: 18,
              maxWidth: 620,
              margin: '0 auto 32px',
              animationDelay: '160ms',
            }}
          >
            LienLoop delivers pre-foreclosure and code violation records the moment they hit
            public record — already skip-traced with owner phone numbers and emails — so you're
            the first call the owner ever gets.
          </p>
          <div
            className="hb-fade-up"
            style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', animationDelay: '240ms' }}
          >
            <Link to="/signup" style={{ textDecoration: 'none' }}>
              <Button variant="primary" style={{ padding: '14px 28px', fontSize: 15 }}>
                Get Started Free
              </Button>
            </Link>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <GhostOnNavy>Log in</GhostOnNavy>
            </Link>
          </div>

          <div
            className="hb-fade-up"
            style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', margin: '40px 0 56px', animationDelay: '320ms' }}
          >
            {LEAD_TYPES.map((t) => (
              <span
                key={t.label}
                className="hb-pill"
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
        </div>

        <div className="hb-ticker" style={{ position: 'relative' }}>
          <div className="hb-ticker-track">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span className="hb-ticker-item" key={i}>
                <span className="hb-ticker-dot" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="hb-diagonal-down" style={{ background: 'var(--color-offwhite)', paddingBottom: 72 }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px' }}>
          <h2 style={{ fontSize: 28, textAlign: 'center', marginBottom: 12 }}>Built for speed to first contact</h2>
          <p style={{ textAlign: 'center', color: 'var(--color-slate)', maxWidth: 560, margin: '0 auto 48px' }}>
            Everything about LienLoop is designed around one number: how fast you can get an
            owner on the phone after a record becomes public.
          </p>
          <div className="hb-bento-grid">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="hb-card"
                style={{
                  background: '#fff',
                  border: '1px solid var(--color-border)',
                  borderRadius: 14,
                  padding: 24,
                }}
              >
                <div className="hb-icon-mark">{f.mark}</div>
                <h3 style={{ fontSize: 16, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--color-slate)', margin: 0 }}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="hb-diagonal-up" style={{ background: 'var(--color-navy)', paddingBottom: 72, overflow: 'hidden' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px' }}>
          <h2 style={{ fontSize: 28, textAlign: 'center', color: '#fff', marginBottom: 56 }}>How it works</h2>
          <div className="hb-steps">
            {STEPS.map((s) => (
              <div key={s.step} className="hb-step">
                <div className="hb-step-num">{s.step}</div>
                <div style={{ color: 'var(--color-amber)', fontSize: 13, fontWeight: 800, marginBottom: 8 }}>
                  STEP {s.step}
                </div>
                <h3 style={{ fontSize: 18, color: '#fff', marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: 'rgba(248,246,241,0.65)', margin: 0 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans teaser */}
      <section className="hb-diagonal-down" style={{ background: 'var(--color-offwhite)', paddingBottom: 72 }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', textAlign: 'center', padding: '0 24px' }}>
          <h2 style={{ fontSize: 28, marginBottom: 8 }}>Pick your coverage</h2>
          <p style={{ color: 'var(--color-slate)', marginBottom: 48 }}>
            Free during early access. Choose how much ground you want to cover.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 28, textAlign: 'left' }}>
            {PLAN_ORDER.map((plan) => (
              <PlanCard key={plan} plan={plan} featured={plan === 'nationwide'}>
                <Badge tone="amber">FREE (for now)</Badge>
              </PlanCard>
            ))}
          </div>
          <Link
            to="/pricing"
            style={{ display: 'inline-block', marginTop: 48, color: 'var(--color-navy)', fontWeight: 600 }}
          >
            See full pricing details →
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section
        className="hb-diagonal-up"
        style={{ background: 'var(--color-navy)', position: 'relative', overflow: 'hidden', paddingBottom: 64 }}
      >
        <div className="hb-grain" />
        <div
          className="hb-blob"
          style={{
            width: 360,
            height: 360,
            top: -80,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'radial-gradient(circle, rgba(245,166,35,0.28), transparent 70%)',
            animation: 'hb-float-slow 12s ease-in-out infinite',
          }}
        />
        <div style={{ position: 'relative', textAlign: 'center', padding: '0 24px' }}>
          <h2 style={{ fontSize: 28, color: '#fff', marginBottom: 12 }}>Be first to the door.</h2>
          <p style={{ color: 'rgba(248,246,241,0.7)', marginBottom: 28 }}>
            Set up your account in under two minutes — no card required.
          </p>
          <Link to="/signup" style={{ textDecoration: 'none' }}>
            <Button variant="primary" style={{ padding: '14px 28px', fontSize: 15 }}>
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      <footer
        style={{
          borderTop: '1px solid rgba(248,246,241,0.1)',
          padding: '24px',
          textAlign: 'center',
          color: 'rgba(248,246,241,0.4)',
          fontSize: 12,
          background: 'var(--color-navy)',
        }}
      >
        © {new Date().getFullYear()} LienLoop. All rights reserved.
      </footer>
    </div>
  );
}
