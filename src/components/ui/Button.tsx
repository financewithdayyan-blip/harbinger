import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
  children: ReactNode;
}

const base: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  fontWeight: 600,
  fontSize: 14,
  borderRadius: 6,
  padding: '10px 18px',
  border: '1px solid transparent',
  cursor: 'pointer',
  transition: 'background-color 120ms ease, border-color 120ms ease, opacity 120ms ease',
  whiteSpace: 'nowrap',
};

const variants: Record<Variant, CSSProperties> = {
  primary: {
    background: 'var(--color-amber)',
    color: 'var(--color-navy)',
    borderColor: 'var(--color-amber)',
  },
  secondary: {
    background: 'var(--color-navy)',
    color: 'var(--color-offwhite)',
    borderColor: 'var(--color-navy)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--color-navy)',
    borderColor: 'var(--color-border)',
  },
  danger: {
    background: '#fff',
    color: 'var(--color-danger)',
    borderColor: 'var(--color-danger)',
  },
};

export function Button({ variant = 'primary', loading, disabled, children, style, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      style={{
        ...base,
        ...variants[variant],
        opacity: disabled || loading ? 0.6 : 1,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        ...style,
      }}
    >
      {loading ? 'Please wait…' : children}
    </button>
  );
}
