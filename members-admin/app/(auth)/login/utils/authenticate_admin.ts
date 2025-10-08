'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createSession } from '@/lib/services/auth_service';
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
  maxAge: 60 * 60 * 24,
  secure: process.env.NODE_ENV === 'production',
};

export const authenticateAdmin = async (formData: FormData) => {
  try {
    const result = await createSession();
    const store = cookies();

    store.set(ADMIN_TOKEN_COOKIE, result.accessToken, cookieSettings);
    store.set(ADMIN_NAME_COOKIE, 'Operator', cookieSettings);

    redirect('/members');
  } catch (error) {
    console.error(error);
    return {
      error: 'Unable to sign in. Please try again.',
    };
  }

  return { error: undefined } satisfies LoginFormState;
};
