import type { ReactNode } from 'react';
import { PLAN_DETAILS, type Plan } from '../../lib/types';

interface PlanCardProps {
  plan: Plan;
  featured?: boolean;
  children?: ReactNode;
}

export function PlanCard({ plan, featured, children }: PlanCardProps) {
  const details = PLAN_DETAILS[plan];

  return (
    <div
      style={{
        position: 'relative',
        background: '#fff',
        border: `1px solid ${featured ? 'var(--color-amber)' : 'var(--color-border)'}`,
        borderRadius: 14,
        padding: 28,
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        transform: featured ? 'scale(1.04)' : 'none',
        boxShadow: featured ? '0 20px 40px rgba(13, 27, 42, 0.16)' : '0 1px 2px rgba(13, 27, 42, 0.04)',
        transition: 'transform 200ms ease, box-shadow 200ms ease',
      }}
    >
      {featured && (
        <span
          style={{
            position: 'absolute',
            top: -12,
            left: 24,
            background: 'var(--color-amber)',
            color: 'var(--color-navy)',
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            padding: '4px 10px',
            borderRadius: 999,
          }}
        >
          Most Coverage
        </span>
      )}
      <div>
        <h3 style={{ fontSize: 18 }}>{details.title}</h3>
        <p style={{ color: 'var(--color-slate)', fontSize: 13, marginTop: 6 }}>{details.description}</p>
      </div>
      {children}
    </div>
  );
}
