import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signUp } from '../../lib/auth';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export function SignupForm() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { data, error: signUpError } = await signUp({ email, password, fullName, companyName });
    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (!data.session) {
      // Email confirmation is required before a session exists.
      setNeedsConfirmation(true);
      return;
    }

    navigate('/onboarding');
  }

  if (needsConfirmation) {
    return (
      <div style={{ textAlign: 'center', color: 'var(--color-slate)' }}>
        <p>Check your inbox to confirm your email, then log in to continue setup.</p>
        <Link to="/login">Go to login</Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Input
        label="Full name"
        required
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        placeholder="Jane Smith"
      />
      <Input
        label="Company name"
        required
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
        placeholder="Smith Capital LLC"
      />
      <Input
        label="Email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@company.com"
      />
      <Input
        label="Password"
        type="password"
        required
        minLength={6}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
      />
      {error && <div style={{ color: 'var(--color-danger)', fontSize: 13 }}>{error}</div>}
      <Button type="submit" loading={loading} style={{ width: '100%', marginTop: 4 }}>
        Create account
      </Button>
      <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--color-slate)' }}>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </form>
  );
}
