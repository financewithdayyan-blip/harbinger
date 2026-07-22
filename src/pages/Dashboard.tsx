import { useState } from 'react';
import { Sidebar } from '../components/dashboard/Sidebar';
import { LeadsFilters } from '../components/dashboard/LeadsFilters';
import { LeadsTable } from '../components/dashboard/LeadsTable';
import { Button } from '../components/ui/Button';
import { useLeads, EMPTY_FILTERS, type LeadsFilters as LeadsFiltersType } from '../hooks/useLeads';

export default function Dashboard() {
  const [filters, setFilters] = useState<LeadsFiltersType>(EMPTY_FILTERS);
  const [page, setPage] = useState(0);

  const { leads, totalCount, pageCount, loading, error } = useLeads(filters, page);

  function handleFiltersChange(next: LeadsFiltersType) {
    setFilters(next);
    setPage(0);
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: 32, minWidth: 0 }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22 }}>Leads</h1>
          <p style={{ color: 'var(--color-slate)', fontSize: 13, marginTop: 4 }}>
            {totalCount.toLocaleString()} matching leads
          </p>
        </div>

        <LeadsFilters filters={filters} onChange={handleFiltersChange} />
        <LeadsTable leads={leads} loading={loading} error={error} />

        {!loading && !error && leads.length > 0 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 16,
            }}
          >
            <span style={{ fontSize: 13, color: 'var(--color-slate)' }}>
              Page {page + 1} of {pageCount}
            </span>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button variant="ghost" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>
                Previous
              </Button>
              <Button
                variant="ghost"
                onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                disabled={page >= pageCount - 1}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
