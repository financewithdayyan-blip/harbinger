import { LoginForm } from '../components/auth/LoginForm';
import { AuthLayout } from '../components/auth/AuthLayout';

export default function Login() {
  return (
    <AuthLayout title="Log in" subtitle="Access your LienLoop dashboard.">
      <LoginForm />
    </AuthLayout>
  );
}
