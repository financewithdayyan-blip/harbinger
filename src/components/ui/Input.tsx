import type { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: ReactNode;
}

export function Input({ label, error, hint, id, style, ...rest }: InputProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
      {label && (
        <label htmlFor={id} style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-slate)' }}>
          {label}
        </label>
      )}
      <input
        id={id}
        {...rest}
        style={{
          padding: '10px 12px',
          borderRadius: 6,
          border: `1px solid ${error ? 'var(--color-danger)' : 'var(--color-border)'}`,
          fontSize: 14,
          fontFamily: 'inherit',
          background: '#fff',
          color: 'var(--color-navy)',
          width: '100%',
          ...style,
        }}
      />
      {error && <span style={{ fontSize: 12, color: 'var(--color-danger)' }}>{error}</span>}
      {hint && !error && <span style={{ fontSize: 12, color: 'var(--color-slate-light)' }}>{hint}</span>}
    </div>
  );
}
