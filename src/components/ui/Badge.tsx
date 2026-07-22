import type { ReactNode } from 'react';

type Tone = 'amber' | 'navy' | 'slate' | 'success' | 'danger';

const tones: Record<Tone, { bg: string; color: string }> = {
  amber: { bg: 'rgba(245, 166, 35, 0.15)', color: 'var(--color-amber-dark)' },
  navy: { bg: 'rgba(13, 27, 42, 0.08)', color: 'var(--color-navy)' },
  slate: { bg: 'rgba(74, 85, 104, 0.12)', color: 'var(--color-slate)' },
  success: { bg: 'rgba(47, 133, 90, 0.12)', color: 'var(--color-success)' },
  danger: { bg: 'rgba(197, 48, 48, 0.12)', color: 'var(--color-danger)' },
};

export function Badge({ tone = 'navy', children }: { tone?: Tone; children: ReactNode }) {
  const t = tones[tone];
  return (
    <span
      style={{
        display: 'inline-block',
        fontSize: 12,
        fontWeight: 600,
        padding: '3px 10px',
        borderRadius: 999,
        background: t.bg,
        color: t.color,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}
