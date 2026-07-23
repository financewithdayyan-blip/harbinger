import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { signOut } from '../../lib/auth';
import { Logo } from '../ui/Logo';
import { creditsRemaining } from '../../lib/credits';

export function Sidebar() {
  const navigate = useNavigate();
  const { profile, isAdmin } = useAuth();

  async function handleSignOut() {
    await signOut();
    navigate('/login');
  }

  return (
    <aside
      style={{
        width: 220,
        minWidth: 220,
        background: 'var(--color-navy)',
        color: 'var(--color-offwhite)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
        minHeight: '100vh',
      }}
    >
      <div style={{ marginBottom: 36 }}>
        <Logo size={24} color="var(--color-offwhite)" />
        <div style={{ fontSize: 10, color: 'var(--color-amber)', fontWeight: 600, marginTop: 6, marginLeft: 2 }}>
          First to know. First to close.
        </div>
      </div>

      <CreditsCounter />

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
        <SidebarLink to="/dashboard" label="Leads" />
        <SidebarLink to="#" label="Saved Leads" disabled />
        <SidebarLink to="#" label="Account Settings" disabled />
        {isAdmin && <SidebarLink to="/admin" label="Admin Panel" />}
      </nav>

      <div style={{ borderTop: '1px solid rgba(248,246,241,0.15)', paddingTop: 16, marginTop: 16 }}>
        <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 10 }}>
          {profile?.full_name || 'Account'}
          <br />
          {profile?.company_name}
        </div>
        <button
          onClick={handleSignOut}
          style={{
            background: 'transparent',
            border: '1px solid rgba(248,246,241,0.3)',
            color: 'var(--color-offwhite)',
            borderRadius: 6,
            padding: '8px 12px',
            fontSize: 12,
            cursor: 'pointer',
            width: '100%',
          }}
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}

function CreditsCounter() {
  const { profile } = useAuth();

  if (!profile) return null;

  if (!profile.tier) {
    return (
      <Link
        to="/pricing"
        style={{
          display: 'block',
          marginBottom: 20,
          padding: '10px 12px',
          borderRadius: 8,
          border: '1px solid rgba(245,166,35,0.4)',
          background: 'rgba(245,166,35,0.08)',
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--color-amber)',
          textDecoration: 'none',
        }}
      >
        No active plan — choose one →
      </Link>
    );
  }

  const remaining = creditsRemaining(profile.skiptrace_credits_used, profile.skiptrace_credits_limit);

  return (
    <div
      style={{
        marginBottom: 20,
        padding: '10px 12px',
        borderRadius: 8,
        background: 'rgba(248,246,241,0.06)',
        fontSize: 12,
      }}
      title="Each credit unlocks one lead's full contact info"
    >
      <div style={{ fontWeight: 700, color: 'var(--color-amber)' }}>
        {remaining.toLocaleString()} credits remaining
      </div>
      <div style={{ opacity: 0.6, marginTop: 2 }}>{profile.tier} plan</div>
    </div>
  );
}

function SidebarLink({ to, label, disabled }: { to: string; label: string; disabled?: boolean }) {
  if (disabled) {
    return (
      <div
        style={{
          padding: '10px 12px',
          borderRadius: 6,
          fontSize: 14,
          opacity: 0.4,
          cursor: 'not-allowed',
        }}
      >
        {label} <span style={{ fontSize: 10 }}>(soon)</span>
      </div>
    );
  }

  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        padding: '10px 12px',
        borderRadius: 6,
        fontSize: 14,
        fontWeight: 600,
        textDecoration: 'none',
        color: isActive ? 'var(--color-navy)' : 'var(--color-offwhite)',
        background: isActive ? 'var(--color-amber)' : 'transparent',
      })}
    >
      {label}
    </NavLink>
  );
}
