'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { authenticate } from '@/lib/services/auth_service';
import {
  ADMIN_NAME_COOKIE,
  ADMIN_TOKEN_COOKIE,
} from '@/lib/config/auth';

export type LoginFormState = {
  error?: string;
};

const cookieSettings = {
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/',
};

export const authenticateAdmin = async (formData: FormData) => {
  const username = String(formData.get('username') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  if (!username || !password) {
    return { error: 'Username and password are required.' };
  }

  try {
    const result = await authenticate({ username, password });
    const store = cookies();

    store.set(ADMIN_TOKEN_COOKIE, result.token, cookieSettings);
    store.set(ADMIN_NAME_COOKIE, result.admin.name, cookieSettings);

    redirect('/members');
  } catch (error) {
    console.error(error);
    return { error: 'Invalid credentials. Please try again.' };
  }

  return { error: undefined } satisfies LoginFormState;
};
