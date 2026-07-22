import { useState } from 'react';
import { Sidebar } from '../components/dashboard/Sidebar';
import { CSVUploader } from '../components/admin/CSVUploader';
import { UserTable } from '../components/admin/UserTable';

type Tab = 'upload' | 'users';

export default function Admin() {
  const [tab, setTab] = useState<Tab>('upload');

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: 32, minWidth: 0 }}>
        <h1 style={{ fontSize: 22, marginBottom: 20 }}>Admin Panel</h1>

        <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '1px solid var(--color-border)' }}>
          <TabButton label="Daily Upload" active={tab === 'upload'} onClick={() => setTab('upload')} />
          <TabButton label="User Management" active={tab === 'users'} onClick={() => setTab('users')} />
        </div>

        {tab === 'upload' ? <CSVUploader /> : <UserTable />}
      </main>
    </div>
  );
}

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px 16px',
        border: 'none',
        borderBottom: `2px solid ${active ? 'var(--color-amber)' : 'transparent'}`,
        background: 'transparent',
        fontWeight: 600,
        fontSize: 14,
        color: active ? 'var(--color-navy)' : 'var(--color-slate)',
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  );
}
