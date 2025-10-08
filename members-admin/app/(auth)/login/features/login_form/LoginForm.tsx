'use client';

import { useState, useTransition } from 'react';
import { authenticateAdmin } from '../../utils/authenticate_admin';
import { Button } from '@/components/ui/button';

export const LoginForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [pending, startTransition] = useTransition();

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const result = await authenticateAdmin(formData);
      setError(result.error);
    });
  };

  return (
    <form className="space-y-5" action={handleSubmit}>
      <p className="text-sm text-muted">
        Request a session to access the members dashboard.
      </p>

      {error && (
        <p className="text-sm text-error" role="alert">
          {error}
        </p>
      )}

      <Button className="w-full" type="submit" disabled={pending}>
        {pending ? 'Requesting Access…' : 'Sign In'}
      </Button>
    </form>
  );
};
