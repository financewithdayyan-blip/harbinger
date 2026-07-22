import type { LeadType, Plan } from '../../lib/types';
import { PLAN_DETAILS, US_STATES } from '../../lib/types';
import { Button } from '../ui/Button';

interface OnboardingConfirmProps {
  plan: Plan;
  leadType: LeadType;
  states: string[];
  counties: string[];
  onConfirm: () => void;
  loading: boolean;
}

const LEAD_TYPE_LABELS: Record<LeadType, string> = {
  pre_foreclosure: 'Pre-Foreclosure',
  code_violations: 'Code Violations',
};

export function OnboardingConfirm({ plan, leadType, states, counties, onConfirm, loading }: OnboardingConfirmProps) {
  const stateLabel =
    plan === 'nationwide'
      ? 'All 50 states + DC'
      : states.map((code) => US_STATES.find((s) => s.code === code)?.name ?? code).join(', ');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div
        style={{
          border: '1px solid var(--color-border)',
          borderRadius: 10,
          padding: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          background: '#fff',
        }}
      >
        <Row label="Plan" value={PLAN_DETAILS[plan].title} />
        <Row label="Lead Type" value={LEAD_TYPE_LABELS[leadType]} />
        <Row label="States" value={stateLabel || '—'} />
        <Row label="Counties" value={counties.length > 0 ? counties.join(', ') : 'All counties'} />
      </div>
      <Button onClick={onConfirm} loading={loading} style={{ width: '100%' }}>
        Enter Dashboard
      </Button>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
      <span style={{ color: 'var(--color-slate)', fontSize: 13 }}>{label}</span>
      <span style={{ fontWeight: 600, fontSize: 13, textAlign: 'right' }}>{value}</span>
    </div>
  );
}
