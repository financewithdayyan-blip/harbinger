import { LEAD_COLUMNS, type Lead } from '../../lib/types';

export type ColumnMapping = Partial<Record<keyof Lead, string>>;

interface ColumnMapperProps {
  csvHeaders: string[];
  mapping: ColumnMapping;
  onChange: (mapping: ColumnMapping) => void;
  columns?: typeof LEAD_COLUMNS;
}

export function ColumnMapper({ csvHeaders, mapping, onChange, columns = LEAD_COLUMNS }: ColumnMapperProps) {
  function setMapping(key: keyof Lead, header: string) {
    onChange({ ...mapping, [key]: header || undefined });
  }

  return (
    <div style={{ border: '1px solid var(--color-border)', borderRadius: 8, overflow: 'hidden' }}>
      <table style={{ width: '100%', fontSize: 13 }}>
        <thead>
          <tr style={{ background: 'var(--color-navy)', color: 'var(--color-offwhite)' }}>
            <th style={{ padding: '10px 12px', textAlign: 'left' }}>Leads Column</th>
            <th style={{ padding: '10px 12px', textAlign: 'left' }}>CSV Column</th>
          </tr>
        </thead>
        <tbody>
          {columns.map((col) => (
            <tr key={col.key} style={{ borderBottom: '1px solid var(--color-border)' }}>
              <td style={{ padding: '8px 12px', fontWeight: 600 }}>
                {col.label}
                {col.required && <span style={{ color: 'var(--color-danger)' }}> *</span>}
              </td>
              <td style={{ padding: '8px 12px' }}>
                <select
                  value={mapping[col.key] ?? ''}
                  onChange={(e) => setMapping(col.key, e.target.value)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 6,
                    border: `1px solid ${col.required && !mapping[col.key] ? 'var(--color-danger)' : 'var(--color-border)'}`,
                    fontSize: 13,
                    width: '100%',
                    maxWidth: 260,
                  }}
                >
                  <option value="">-- do not import --</option>
                  {csvHeaders.map((header) => (
                    <option key={header} value={header}>
                      {header}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
