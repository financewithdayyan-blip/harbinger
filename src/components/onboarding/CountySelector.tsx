import { useState, type KeyboardEvent } from 'react';
import { Button } from '../ui/Button';

interface CountySelectorProps {
  value: string[];
  onChange: (counties: string[]) => void;
}

export function CountySelector({ value, onChange }: CountySelectorProps) {
  const [input, setInput] = useState('');

  function addCounty() {
    const name = input.trim();
    if (!name) return;
    if (!value.some((c) => c.toLowerCase() === name.toLowerCase())) {
      onChange([...value, name]);
    }
    setInput('');
  }

  function removeCounty(name: string) {
    onChange(value.filter((c) => c !== name));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCounty();
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. Maricopa"
          style={{
            flex: 1,
            padding: '10px 12px',
            borderRadius: 6,
            border: '1px solid var(--color-border)',
            fontSize: 14,
          }}
        />
        <Button type="button" variant="ghost" onClick={addCounty}>
          Add
        </Button>
      </div>

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
