import { useState } from 'react';
import type { Lead } from '../../lib/types';
import { Badge } from '../ui/Badge';
import { Spinner } from '../ui/Spinner';

interface LeadsTableProps {
  leads: Lead[];
  loading: boolean;
  error: string | null;
}

const COLUMNS: { key: keyof Lead | 'select'; label: string }[] = [
  { key: 'select', label: '' },
  { key: 'date_pulled', label: 'Date Pulled' },
  { key: 'case_number', label: 'Case #' },
  { key: 'state', label: 'State' },
  { key: 'county', label: 'County' },
  { key: 'list_type', label: 'List Type' },
  { key: 'auction_date', label: 'Auction Date' },
  { key: 'owner_first', label: 'Owner First' },
  { key: 'owner_last', label: 'Owner Last' },
  { key: 'company_entity', label: 'Company/Entity' },
  { key: 'phone_1', label: 'Phone' },
  { key: 'phone_2', label: 'Phone 2' },
  { key: 'email', label: 'Email' },
  { key: 'email_2', label: 'Email 2' },
  { key: 'property_street', label: 'Property Street' },
  { key: 'property_city', label: 'Property City' },
  { key: 'property_state', label: 'Prop. St' },
  { key: 'property_zip', label: 'Zip' },
  { key: 'mailing_street', label: 'Mailing Street' },
  { key: 'mailing_city', label: 'Mailing City' },
  { key: 'mailing_state', label: 'Mailing St' },
  { key: 'mailing_zip', label: 'Mailing Zip' },
];

const LEAD_TYPE_LABELS: Record<string, string> = {
  pre_foreclosure: 'Pre-Foreclosure',
  code_violations: 'Code Violations',
};

export function LeadsTable({ leads, loading, error }: LeadsTableProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

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
          {leads.map((lead, i) => (
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
              <td style={{ padding: '10px 12px' }}>{lead.case_number || '—'}</td>
              <td style={{ padding: '10px 12px' }}>{lead.state}</td>
              <td style={{ padding: '10px 12px' }}>{lead.county || '—'}</td>
              <td style={{ padding: '10px 12px' }}>
                <Badge tone={lead.list_type === 'pre_foreclosure' ? 'amber' : 'slate'}>
                  {LEAD_TYPE_LABELS[lead.list_type] ?? lead.list_type}
                </Badge>
              </td>
              <td style={{ padding: '10px 12px' }}>{lead.auction_date || '—'}</td>
              <td style={{ padding: '10px 12px' }}>{lead.owner_first || '—'}</td>
              <td style={{ padding: '10px 12px' }}>{lead.owner_last || '—'}</td>
              <td style={{ padding: '10px 12px' }}>{lead.company_entity || '—'}</td>
              <td style={{ padding: '10px 12px' }}>{lead.phone_1 || '—'}</td>
              <td style={{ padding: '10px 12px' }}>{lead.phone_2 || '—'}</td>
              <td style={{ padding: '10px 12px' }}>{lead.email || '—'}</td>
              <td style={{ padding: '10px 12px' }}>{lead.email_2 || '—'}</td>
              <td style={{ padding: '10px 12px' }}>{lead.property_street || '—'}</td>
              <td style={{ padding: '10px 12px' }}>{lead.property_city || '—'}</td>
              <td style={{ padding: '10px 12px' }}>{lead.property_state || '—'}</td>
              <td style={{ padding: '10px 12px' }}>{lead.property_zip || '—'}</td>
              <td style={{ padding: '10px 12px' }}>{lead.mailing_street || '—'}</td>
              <td style={{ padding: '10px 12px' }}>{lead.mailing_city || '—'}</td>
              <td style={{ padding: '10px 12px' }}>{lead.mailing_state || '—'}</td>
              <td style={{ padding: '10px 12px' }}>{lead.mailing_zip || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
