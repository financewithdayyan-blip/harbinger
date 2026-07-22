import { SignupForm } from '../components/auth/SignupForm';
import { AuthLayout } from '../components/auth/AuthLayout';

export default function Signup() {
  return (
    <AuthLayout title="Create your account" subtitle="Set up your LienLoop workspace in minutes.">
      <SignupForm />
    </AuthLayout>
  );
}
