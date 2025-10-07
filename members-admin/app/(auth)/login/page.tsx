import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ADMIN_TOKEN_COOKIE } from '@/lib/config/auth';
import { LoginForm } from './features/login_form/LoginForm';

const LoginPage = () => {
  const store = cookies();

  if (store.has(ADMIN_TOKEN_COOKIE)) {
    redirect('/members');
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-lg border border-border bg-background/80 p-8 shadow-lg backdrop-blur">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-bold">Members Dashboard</h1>
          <p className="mt-2 text-sm text-muted">
            Sign in to manage member accounts and verification statuses.
          </p>
        </header>
        <LoginForm />
      </div>
    </main>
  );
};

export default LoginPage;
