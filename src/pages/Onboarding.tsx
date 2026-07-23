import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlanSelector } from '../components/onboarding/PlanSelector';
import { LeadTypeSelector } from '../components/onboarding/LeadTypeSelector';
import { StateSelector } from '../components/onboarding/StateSelector';
import { CountySelector } from '../components/onboarding/CountySelector';
import { OnboardingConfirm } from '../components/onboarding/OnboardingConfirm';
import { Button } from '../components/ui/Button';
import { Logo } from '../components/ui/Logo';
import { useProfile } from '../hooks/useProfile';
import type { LeadType, Plan } from '../lib/types';
import { PLAN_DETAILS } from '../lib/types';

const STEPS = ['Plan', 'Lead Type', 'States', 'Counties', 'Confirm'];

export default function Onboarding() {
  const navigate = useNavigate();
  const { saveProfile, saving, error } = useProfile();

  const [step, setStep] = useState(0);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [leadType, setLeadType] = useState<LeadType | null>(null);
  const [states, setStates] = useState<string[]>([]);
  const [counties, setCounties] = useState<string[]>([]);

  function handlePlanChange(nextPlan: Plan) {
    setPlan(nextPlan);
    if (nextPlan === 'nationwide') {
      setStates([]);
    } else {
      // reset states when switching plans to respect the new max
      setStates((prev) => prev.slice(0, PLAN_DETAILS[nextPlan].maxStates as number));
    }
  }

  const canProceed =
    (step === 0 && plan !== null) ||
    (step === 1 && leadType !== null) ||
    (step === 2 && (plan === 'nationwide' || states.length > 0)) ||
    step === 3 ||
    step === 4;

  async function handleConfirm() {
    if (!plan || !leadType) return;
    await saveProfile({
      plan,
      leadType,
      selectedStates: plan === 'nationwide' ? [] : states,
      selectedCounties: counties,
      onboardingComplete: true,
    });
    navigate('/dashboard');
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-offwhite)', padding: '48px 16px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Logo size={24} style={{ justifyContent: 'center' }} />
          <p style={{ color: 'var(--color-slate)', fontSize: 13, marginTop: 8 }}>Let's set up your account.</p>
        </div>

        <Stepper steps={STEPS} current={step} />

        <div
          style={{
            background: '#fff',
            border: '1px solid var(--color-border)',
            borderRadius: 12,
            padding: 28,
            marginTop: 24,
          }}
        >
          {step === 0 && (
            <>
              <h2 style={{ fontSize: 18, marginBottom: 16 }}>Choose your plan</h2>
              <PlanSelector value={plan} onChange={handlePlanChange} />
            </>
          )}
          {step === 1 && (
            <>
              <h2 style={{ fontSize: 18, marginBottom: 16 }}>Choose your lead type</h2>
              <LeadTypeSelector value={leadType} onChange={setLeadType} />
            </>
          )}
          {step === 2 && plan && (
            <>
              <h2 style={{ fontSize: 18, marginBottom: 16 }}>Choose your states</h2>
              <StateSelector plan={plan} value={states} onChange={setStates} />
            </>
          )}
          {step === 3 && (
            <>
              <h2 style={{ fontSize: 18, marginBottom: 6 }}>Narrow down to specific counties</h2>
              <p style={{ fontSize: 13, color: 'var(--color-slate)', marginBottom: 16 }}>
                Optional. Add counties to only get leads from those — leave it empty to get every
                county in your selected states.
              </p>
              <CountySelector plan={plan ?? 'single_state'} states={states} value={counties} onChange={setCounties} />
            </>
          )}
          {step === 4 && plan && leadType && (
            <>
              <h2 style={{ fontSize: 18, marginBottom: 16 }}>Confirm your setup</h2>
              <OnboardingConfirm
                plan={plan}
                leadType={leadType}
                states={states}
                counties={counties}
                onConfirm={handleConfirm}
                loading={saving}
              />
            </>
          )}

          {error && <p style={{ color: 'var(--color-danger)', fontSize: 13, marginTop: 12 }}>{error}</p>}

          {step < 4 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28 }}>
              <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
                Back
              </Button>
              <Button onClick={() => setStep((s) => s + 1)} disabled={!canProceed}>
                Continue
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {steps.map((label, i) => (
        <div key={label} style={{ flex: 1, textAlign: 'center' }}>
          <div
            style={{
              height: 4,
              borderRadius: 2,
              background: i <= current ? 'var(--color-amber)' : 'var(--color-border)',
              marginBottom: 6,
            }}
          />
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: i <= current ? 'var(--color-navy)' : 'var(--color-slate-light)',
            }}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
