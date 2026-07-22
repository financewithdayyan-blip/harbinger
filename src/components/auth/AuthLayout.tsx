import type { ReactNode } from 'react';

export function AuthLayout({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-navy)',
        padding: 16,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          background: '#fff',
          borderRadius: 12,
          padding: '36px 32px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: 'var(--color-navy)',
              letterSpacing: '-0.02em',
            }}
          >
            HARBINGER
          </div>
          <div style={{ fontSize: 12, color: 'var(--color-amber-dark)', fontWeight: 600, marginTop: 2 }}>
            First to know. First to close.
          </div>
        </div>
        <h2 style={{ fontSize: 20, marginBottom: 4 }}>{title}</h2>
        <p style={{ color: 'var(--color-slate)', fontSize: 13, marginBottom: 24 }}>{subtitle}</p>
        {children}
      </div>
    </div>
  );
}
