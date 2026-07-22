import type { ReactNode } from 'react';
import { Button } from '../ui/Button';
import { EMPTY_FILTERS, type LeadsFilters as LeadsFiltersType } from '../../hooks/useLeads';

interface LeadsFiltersProps {
  filters: LeadsFiltersType;
  onChange: (filters: LeadsFiltersType) => void;
}

function toISODate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function LeadsFilters({ filters, onChange }: LeadsFiltersProps) {
  function set<K extends keyof LeadsFiltersType>(key: K, value: LeadsFiltersType[K]) {
    onChange({ ...filters, [key]: value });
  }

  function quickRange(days: number) {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - days);
    onChange({ ...filters, datePulledFrom: toISODate(from), datePulledTo: toISODate(to) });
  }

  function today() {
    const t = toISODate(new Date());
    onChange({ ...filters, datePulledFrom: t, datePulledTo: t });
  }

  const hasActiveFilters = JSON.stringify(filters) !== JSON.stringify(EMPTY_FILTERS);

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 16,
        alignItems: 'flex-end',
        background: '#fff',
        border: '1px solid var(--color-border)',
        borderRadius: 10,
        padding: 16,
        marginBottom: 16,
      }}
    >
      <FilterField label="Date Pulled">
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <DateInput value={filters.datePulledFrom} onChange={(v) => set('datePulledFrom', v)} />
          <span style={{ color: 'var(--color-slate-light)' }}>–</span>
          <DateInput value={filters.datePulledTo} onChange={(v) => set('datePulledTo', v)} />
        </div>
      </FilterField>

      <div style={{ display: 'flex', gap: 6 }}>
        <QuickButton label="Today" onClick={today} />
        <QuickButton label="Last 7d" onClick={() => quickRange(7)} />
        <QuickButton label="Last 30d" onClick={() => quickRange(30)} />
      </div>

      <FilterField label="Auction Date">
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <DateInput value={filters.auctionDateFrom} onChange={(v) => set('auctionDateFrom', v)} />
          <span style={{ color: 'var(--color-slate-light)' }}>–</span>
          <DateInput value={filters.auctionDateTo} onChange={(v) => set('auctionDateTo', v)} />
        </div>
      </FilterField>

      <FilterField label="County">
        <input
          type="text"
          value={filters.county}
          onChange={(e) => set('county', e.target.value)}
          placeholder="Search county…"
          style={{
            padding: '8px 10px',
            borderRadius: 6,
            border: '1px solid var(--color-border)',
            fontSize: 13,
            width: 160,
          }}
        />
      </FilterField>

      {hasActiveFilters && (
        <Button variant="ghost" onClick={() => onChange(EMPTY_FILTERS)} style={{ marginLeft: 'auto' }}>
          Clear all filters
        </Button>
      )}
    </div>
  );
}

function FilterField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-slate)', textTransform: 'uppercase' }}>
        {label}
      </span>
      {children}
    </div>
  );
}

function DateInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        padding: '8px 10px',
        borderRadius: 6,
        border: '1px solid var(--color-border)',
        fontSize: 13,
      }}
    />
  );
}

function QuickButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      type="button"
      style={{
        border: '1px solid var(--color-border)',
        background: '#fff',
        borderRadius: 6,
        padding: '8px 12px',
        fontSize: 12,
        fontWeight: 600,
        cursor: 'pointer',
        color: 'var(--color-navy)',
      }}
    >
      {label}
    </button>
  );
}
