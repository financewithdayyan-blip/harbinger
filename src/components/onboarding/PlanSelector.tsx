import type { Plan } from '../../lib/types';
import { PLAN_DETAILS } from '../../lib/types';
import { Badge } from '../ui/Badge';

interface PlanSelectorProps {
  value: Plan | null;
  onChange: (plan: Plan) => void;
}

const PLAN_ORDER: Plan[] = ['single_state', 'multi_state', 'nationwide'];

export function PlanSelector({ value, onChange }: PlanSelectorProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
      {PLAN_ORDER.map((plan) => {
        const details = PLAN_DETAILS[plan];
        const selected = value === plan;
        return (
          <button
            key={plan}
            type="button"
            onClick={() => onChange(plan)}
            style={{
              textAlign: 'left',
              cursor: 'pointer',
              border: `2px solid ${selected ? 'var(--color-amber)' : 'var(--color-border)'}`,
              borderRadius: 10,
              padding: 20,
              background: selected ? 'rgba(245, 166, 35, 0.06)' : '#fff',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <h3 style={{ fontSize: 16 }}>{details.title}</h3>
            <p style={{ fontSize: 13, color: 'var(--color-slate)', margin: 0 }}>{details.description}</p>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
              <Badge tone="amber">FREE (for now)</Badge>
            </div>
          </button>
        );
      })}
    </div>
  );
}
