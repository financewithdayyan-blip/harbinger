import type { CSSProperties } from 'react';
import { LogoMark } from './LogoMark';

interface LogoProps {
  size?: number;
  showWordmark?: boolean;
  color?: string;
  style?: CSSProperties;
}

export function Logo({ size = 28, showWordmark = true, color = 'var(--color-navy)', style }: LogoProps) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.36, color, ...style }}>
      <LogoMark size={size} />
      {showWordmark && (
        <span style={{ fontSize: size * 0.64, fontWeight: 800, letterSpacing: '-0.02em', color: 'inherit' }}>
          HARBINGER
        </span>
      )}
    </span>
  );
}
