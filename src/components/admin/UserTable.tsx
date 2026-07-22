import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Badge } from '../ui/Badge';
import { Spinner } from '../ui/Spinner';
import type { LeadType, Plan } from '../../lib/types';

interface UserRow {
  id: string;
  full_name: string | null;
  company_name: string | null;
  plan: Plan | null;
  lead_type: LeadType | null;
  selected_states: string[];
  created_at: string;
  is_admin: boolean;
}

const PLAN_LABELS: Record<string, string> = {
  single_state: 'Single State',
  multi_state: 'Multi-State',
  nationwide: 'Nationwide',
};

const LEAD_TYPE_LABELS: Record<string, string> = {
  pre_foreclosure: 'Pre-Foreclosure',
  code_violations: 'Code Violations',
};

export function UserTable() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);

    const [{ data: profiles, error: profilesError }, { data: admins, error: adminsError }] = await Promise.all([
      supabase
        .from('user_profiles')
        .select('id, full_name, company_name, plan, lead_type, selected_states, created_at')
        .order('created_at', { ascending: false }),
      supabase.from('admin_users').select('user_id, is_admin'),
    ]);

    if (profilesError || adminsError) {
      setError(profilesError?.message ?? adminsError?.message ?? 'Failed to load users');
      setLoading(false);
      return;
    }

    const adminMap = new Map((admins ?? []).map((a) => [a.user_id, a.is_admin]));
    setUsers(
      (profiles ?? []).map((p) => ({
        ...p,
        is_admin: Boolean(adminMap.get(p.id)),
      }))
    );
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleAdmin(userId: string, current: boolean) {
    setUpdatingId(userId);
    const { error: upsertError } = await supabase
      .from('admin_users')
      .upsert({ user_id: userId, is_admin: !current });
    setUpdatingId(null);
    if (upsertError) {
      setError(upsertError.message);
      return;
    }
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, is_admin: !current } : u)));
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
        <Spinner size={32} />
      </div>
    );
  }

  if (error) {
    return <p style={{ color: 'var(--color-danger)' }}>{error}</p>;
  }

  return (
    <div style={{ overflowX: 'auto', border: '1px solid var(--color-border)', borderRadius: 10, background: '#fff' }}>
      <table style={{ width: '100%', fontSize: 13 }}>
        <thead>
          <tr style={{ background: 'var(--color-navy)', color: 'var(--color-offwhite)' }}>
            {['Name', 'Company', 'Plan', 'States', 'Lead Type', 'Signed Up', 'Admin'].map((h) => (
              <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 11, textTransform: 'uppercase' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
              <td style={{ padding: '10px 12px' }}>{u.full_name || '—'}</td>
              <td style={{ padding: '10px 12px' }}>{u.company_name || '—'}</td>
              <td style={{ padding: '10px 12px' }}>{u.plan ? PLAN_LABELS[u.plan] : '—'}</td>
              <td style={{ padding: '10px 12px' }}>
                {u.plan === 'nationwide' ? 'All' : u.selected_states.join(', ') || '—'}
              </td>
              <td style={{ padding: '10px 12px' }}>{u.lead_type ? LEAD_TYPE_LABELS[u.lead_type] : '—'}</td>
              <td style={{ padding: '10px 12px' }}>{new Date(u.created_at).toLocaleDateString()}</td>
              <td style={{ padding: '10px 12px' }}>
                <button
                  onClick={() => toggleAdmin(u.id, u.is_admin)}
                  disabled={updatingId === u.id}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  <Badge tone={u.is_admin ? 'success' : 'slate'}>{u.is_admin ? 'Admin' : 'User'}</Badge>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
