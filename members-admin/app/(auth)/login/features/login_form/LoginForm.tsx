'use client';

import { useState, useTransition } from 'react';
import { authenticateAdmin } from '../../utils/authenticate_admin';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          name="username"
          autoComplete="username"
          placeholder="admin"
          required
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
        </div>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          required
        />
      </div>

      {error && (
        <p className="text-sm text-error" role="alert">
          {error}
        </p>
      )}

      <Button className="w-full" type="submit" disabled={pending}>
        {pending ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
};
