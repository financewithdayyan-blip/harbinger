import type { Plan } from '../../lib/types';
import { US_STATES } from '../../lib/types';
import { Badge } from '../ui/Badge';

interface StateSelectorProps {
  plan: Plan;
  value: string[];
  onChange: (states: string[]) => void;
}

export function StateSelector({ plan, value, onChange }: StateSelectorProps) {
  if (plan === 'nationwide') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Badge tone="amber">All 50 states + DC</Badge>
        <span style={{ fontSize: 13, color: 'var(--color-slate)' }}>
          Nationwide plans include every state automatically.
        </span>
      </div>
    );
  }

  if (plan === 'single_state') {
    return (
      <select
        value={value[0] ?? ''}
        onChange={(e) => onChange(e.target.value ? [e.target.value] : [])}
        style={{
          padding: '10px 12px',
          borderRadius: 6,
          border: '1px solid var(--color-border)',
          fontSize: 14,
          width: '100%',
          maxWidth: 320,
          background: '#fff',
        }}
      >
        <option value="">Select a state…</option>
        {US_STATES.map((s) => (
          <option key={s.code} value={s.code}>
            {s.name} ({s.code})
          </option>
        ))}
      </select>
    );
  }

  // multi_state: up to 4
  const maxReached = value.length >= 4;
  function toggle(code: string) {
    if (value.includes(code)) {
      onChange(value.filter((c) => c !== code));
    } else if (value.length < 4) {
      onChange([...value, code]);
    }
  }

  return (
    <div>
      <p style={{ fontSize: 12, color: 'var(--color-slate)', marginBottom: 10 }}>
        {value.length} / 4 states selected
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: 8,
          maxHeight: 320,
          overflowY: 'auto',
          border: '1px solid var(--color-border)',
          borderRadius: 8,
          padding: 12,
        }}
      >
        {US_STATES.map((s) => {
          const checked = value.includes(s.code);
          const disabled = !checked && maxReached;
          return (
            <label
              key={s.code}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 13,
                opacity: disabled ? 0.4 : 1,
                cursor: disabled ? 'not-allowed' : 'pointer',
              }}
            >
              <input type="checkbox" checked={checked} disabled={disabled} onChange={() => toggle(s.code)} />
              {s.name}
            </label>
          );
        })}
      </div>
    </div>
  );
}
