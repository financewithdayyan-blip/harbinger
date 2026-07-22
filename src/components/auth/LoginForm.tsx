import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signIn } from '../../lib/auth';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: signInError } = await signIn(email, password);
    setLoading(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    navigate('/dashboard');
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
      />
      {error && <div style={{ color: 'var(--color-danger)', fontSize: 13 }}>{error}</div>}
      <Button type="submit" loading={loading} style={{ width: '100%', marginTop: 4 }}>
        Log in
      </Button>
      <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--color-slate)' }}>
        Don&apos;t have an account? <Link to="/signup">Sign up</Link>
      </p>
    </form>
  );
}
