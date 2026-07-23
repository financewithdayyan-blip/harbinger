import { useState } from 'react';
import { COUNTIES_BY_STATE, countiesForState } from '../../lib/counties';
import { US_STATES, type Plan } from '../../lib/types';

interface CountySelectorProps {
  plan: Plan;
  states: string[];
  value: string[];
  onChange: (counties: string[]) => void;
}

function stateName(code: string) {
  return US_STATES.find((s) => s.code === code)?.name ?? code;
}

export function CountySelector({ plan, states, value, onChange }: CountySelectorProps) {
  const [pendingState, setPendingState] = useState('');
  const [pendingCounty, setPendingCounty] = useState('');

  const nationwide = plan === 'nationwide' || states.length === 0;

  function addCounty(county: string) {
    if (!county) return;
    if (!value.includes(county)) onChange([...value, county]);
  }

  function removeCounty(name: string) {
    onChange(value.filter((c) => c !== name));
  }

  return (
    <div>
      {nationwide ? (
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          <select
            value={pendingCounty}
            onChange={(e) => {
              addCounty(e.target.value);
              setPendingCounty('');
            }}
            style={selectStyle}
          >
            <option value="">Select a county…</option>
            {Object.keys(COUNTIES_BY_STATE)
              .sort()
              .map((code) => (
                <optgroup key={code} label={stateName(code)}>
                  {COUNTIES_BY_STATE[code].map((c) => (
                    <option key={`${code}-${c}`} value={c}>
                      {c}
                    </option>
                  ))}
                </optgroup>
              ))}
          </select>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          <select value={pendingState} onChange={(e) => setPendingState(e.target.value)} style={{ ...selectStyle, maxWidth: 200 }}>
            <option value="">State…</option>
            {states.map((code) => (
              <option key={code} value={code}>
                {stateName(code)}
              </option>
            ))}
          </select>
          <select
            value=""
            onChange={(e) => addCounty(e.target.value)}
            disabled={!pendingState}
            style={selectStyle}
          >
            <option value="">{pendingState ? 'Select a county…' : 'Pick a state first'}</option>
            {countiesForState(pendingState).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      )}

      {value.length === 0 ? (
        <p style={{ fontSize: 13, color: 'var(--color-slate-light)' }}>
          No counties added — you'll get leads from every county in your selected states.
        </p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {value.map((county) => (
            <span
              key={county}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 13,
                fontWeight: 600,
                padding: '5px 6px 5px 12px',
                borderRadius: 999,
                background: 'rgba(245, 166, 35, 0.12)',
                color: 'var(--color-amber-dark)',
              }}
            >
              {county}
              <button
                type="button"
                onClick={() => removeCounty(county)}
                aria-label={`Remove ${county}`}
                style={{
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: 15,
                  lineHeight: 1,
                  color: 'inherit',
                  padding: '2px 6px',
                }}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

const selectStyle = {
  flex: 1,
  padding: '10px 12px',
  borderRadius: 6,
  border: '1px solid var(--color-border)',
  fontSize: 14,
};
