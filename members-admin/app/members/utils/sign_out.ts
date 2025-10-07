'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  ADMIN_NAME_COOKIE,
  ADMIN_TOKEN_COOKIE,
} from '@/lib/config/auth';

export const signOut = async () => {
  const store = cookies();
  store.delete(ADMIN_TOKEN_COOKIE);
  store.delete(ADMIN_NAME_COOKIE);
  redirect('/login');
};
