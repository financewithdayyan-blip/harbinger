import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Lead } from '../../lib/types';
import { canReveal } from '../../lib/credits';
import { useAuth } from '../../context/AuthContext';
import { useRevealLead } from '../../hooks/useRevealLead';
import { Badge } from '../ui/Badge';
import { Spinner } from '../ui/Spinner';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface LeadsTableProps {
  leads: Lead[];
  loading: boolean;
  error: string | null;
}

const COLUMNS: { key: keyof Lead | 'select' | 'contact'; label: string }[] = [
  { key: 'select', label: '' },
  { key: 'date_pulled', label: 'Date Pulled' },
  { key: 'state', label: 'State' },
  { key: 'county', label: 'County' },
  { key: 'list_type', label: 'List Type' },
  { key: 'lis_pendens_date', label: 'Lis Pendens Date' },
  { key: 'auction_date', label: 'Auction Date' },
  { key: 'violation_description', label: 'Violation Description' },
  { key: 'contact', label: 'Contact Info' },
  { key: 'property_street', label: 'Property Street' },
  { key: 'property_city', label: 'Property City' },
  { key: 'property_state', label: 'Prop. St' },
  { key: 'property_zip', label: 'Zip' },
  { key: 'beds', label: 'Beds' },
  { key: 'baths', label: 'Baths' },
  { key: 'sqft', label: 'Sqft' },
  { key: 'lot_size', label: 'Lot Size' },
  { key: 'property_type', label: 'Property Type' },
  { key: 'notes', label: 'Notes' },
];

const LEAD_TYPE_LABELS: Record<string, string> = {
  pre_foreclosure: 'Pre-Foreclosure',
  code_violations: 'Code Violations',
};

export function LeadsTable({ leads, loading, error }: LeadsTableProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [overrides, setOverrides] = useState<Record<string, Lead>>({});
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { profile, refreshProfile } = useAuth();
  const { reveal, revealingId } = useRevealLead();

  function toggleAll() {
    if (selected.size === leads.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(leads.map((l) => l.id)));
    }
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleReveal(lead: Lead) {
    if (!profile || !canReveal(profile.skiptrace_credits_used, profile.skiptrace_credits_limit)) {
      setShowUpgradeModal(true);
      return;
    }
    const revealed = await reveal(lead.id);
    if (revealed) {
      setOverrides((prev) => ({ ...prev, [lead.id]: revealed }));
      await refreshProfile();
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
        <Spinner size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--color-danger)' }}>
        Failed to load leads: {error}
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div style={{ padding: 60, textAlign: 'center', color: 'var(--color-slate)' }}>
        No leads match your filters.
      </div>
    );
  }

  return (
    <div
      style={{
        overflowX: 'auto',
        border: '1px solid var(--color-border)',
        borderRadius: 10,
        background: '#fff',
      }}
    >
      <table style={{ width: '100%', fontSize: 13, whiteSpace: 'nowrap' }}>
        <thead>
          <tr style={{ background: 'var(--color-navy)', color: 'var(--color-offwhite)' }}>
            {COLUMNS.map((col) =>
              col.key === 'select' ? (
                <th key="select" style={{ padding: '10px 12px', textAlign: 'left' }}>
                  <input
                    type="checkbox"
                    checked={selected.size === leads.length && leads.length > 0}
                    onChange={toggleAll}
                  />
                </th>
              ) : (
                <th
                  key={col.key}
                  style={{
                    padding: '10px 12px',
                    textAlign: 'left',
                    fontSize: 11,
                    textTransform: 'uppercase',
                    letterSpacing: '0.03em',
                    fontWeight: 700,
                  }}
                >
                  {col.label}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {leads.map((raw, i) => {
            const lead = overrides[raw.id] ?? raw;
            return (
              <tr
                key={lead.id}
                style={{
                  background: i % 2 === 0 ? '#fff' : 'rgba(13,27,42,0.02)',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                <td style={{ padding: '10px 12px' }}>
                  <input type="checkbox" checked={selected.has(lead.id)} onChange={() => toggleOne(lead.id)} />
                </td>
                <td style={{ padding: '10px 12px' }}>{lead.date_pulled}</td>
                <td style={{ padding: '10px 12px' }}>{lead.state}</td>
                <td style={{ padding: '10px 12px' }}>{lead.county || '—'}</td>
                <td style={{ padding: '10px 12px' }}>
                  <Badge tone={lead.list_type === 'pre_foreclosure' ? 'amber' : 'slate'}>
                    {LEAD_TYPE_LABELS[lead.list_type] ?? lead.list_type}
                  </Badge>
                </td>
                <td style={{ padding: '10px 12px' }}>{lead.lis_pendens_date || '—'}</td>
                <td style={{ padding: '10px 12px' }}>{lead.auction_date || '—'}</td>
                <td style={{ padding: '10px 12px' }}>{lead.violation_description || '—'}</td>
                <td style={{ padding: '10px 12px' }}>
                  <ContactCell lead={lead} revealing={revealingId === lead.id} onReveal={() => handleReveal(lead)} />
                </td>
                <td style={{ padding: '10px 12px' }}>{lead.property_street || '—'}</td>
                <td style={{ padding: '10px 12px' }}>{lead.property_city || '—'}</td>
                <td style={{ padding: '10px 12px' }}>{lead.property_state || '—'}</td>
                <td style={{ padding: '10px 12px' }}>{lead.property_zip || '—'}</td>
                <td style={{ padding: '10px 12px' }}>{lead.beds || '—'}</td>
                <td style={{ padding: '10px 12px' }}>{lead.baths || '—'}</td>
                <td style={{ padding: '10px 12px' }}>{lead.sqft || '—'}</td>
                <td style={{ padding: '10px 12px' }}>{lead.lot_size || '—'}</td>
                <td style={{ padding: '10px 12px' }}>{lead.property_type || '—'}</td>
                <td style={{ padding: '10px 12px' }}>{lead.notes || '—'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <Modal open={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} title="Out of skiptrace credits">
        <p style={{ fontSize: 14, color: 'var(--color-slate)', marginBottom: 20 }}>
          You've used all your skiptrace credits for this billing period. Upgrade your plan to reveal more
          leads.
        </p>
        <Link to="/pricing" style={{ textDecoration: 'none' }}>
          <Button style={{ width: '100%' }}>View plans</Button>
        </Link>
      </Modal>
    </div>
  );
}

function ContactCell({ lead, revealing, onReveal }: { lead: Lead; revealing: boolean; onReveal: () => void }) {
  if (lead.is_revealed) {
    const lines = [
      [lead.owner_first, lead.owner_last].filter(Boolean).join(' '),
      lead.phone_1,
      lead.phone_2,
      lead.phone_3,
      lead.email,
      lead.email_2,
    ].filter(Boolean);

    if (lines.length === 0) return <span>—</span>;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {lines.map((line, i) => (
          <span key={i}>{line}</span>
        ))}
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block', minWidth: 160 }}>
      <div
        aria-hidden="true"
        style={{
          filter: 'blur(5px)',
          userSelect: 'none',
          color: 'var(--color-slate-light)',
        }}
      >
        Jane Doe
        <br />
        (555) 555-5555
        <br />
        jane@email.com
      </div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <button
          type="button"
          onClick={onReveal}
          disabled={revealing}
          className="hb-btn hb-btn-primary"
          style={{
            border: 'none',
            borderRadius: 6,
            padding: '6px 12px',
            fontSize: 12,
            fontWeight: 700,
            background: 'var(--color-amber)',
            color: 'var(--color-navy)',
            cursor: revealing ? 'not-allowed' : 'pointer',
            opacity: revealing ? 0.6 : 1,
            whiteSpace: 'nowrap',
          }}
        >
          {revealing ? 'Revealing…' : 'Reveal · 1 credit'}
        </button>
      </div>
    </div>
  );
}
