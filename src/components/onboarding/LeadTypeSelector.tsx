import type { LeadType } from '../../lib/types';
import { Badge } from '../ui/Badge';

interface LeadTypeSelectorProps {
  value: LeadType | null;
  onChange: (leadType: LeadType) => void;
}

const ACTIVE_TYPES: { key: LeadType; label: string }[] = [
  { key: 'pre_foreclosure', label: 'Pre-Foreclosure' },
  { key: 'code_violations', label: 'Code Violations' },
];

const COMING_SOON = ['Probate', 'Tax Delinquent', 'Divorce'];

export function LeadTypeSelector({ value, onChange }: LeadTypeSelectorProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {ACTIVE_TYPES.map((type) => (
        <label
          key={type.key}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            border: `2px solid ${value === type.key ? 'var(--color-amber)' : 'var(--color-border)'}`,
            borderRadius: 8,
            padding: '12px 16px',
            cursor: 'pointer',
            background: value === type.key ? 'rgba(245, 166, 35, 0.06)' : '#fff',
          }}
        >
          <input
            type="radio"
            name="lead_type"
            checked={value === type.key}
            onChange={() => onChange(type.key)}
          />
          <span style={{ fontWeight: 600 }}>{type.label}</span>
        </label>
      ))}
      {COMING_SOON.map((label) => (
        <label
          key={label}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            border: '2px solid var(--color-border)',
            borderRadius: 8,
            padding: '12px 16px',
            opacity: 0.5,
          }}
        >
          <input type="radio" disabled />
          <span style={{ fontWeight: 600 }}>{label}</span>
          <Badge tone="slate">Coming Soon</Badge>
        </label>
      ))}
    </div>
  );
}
