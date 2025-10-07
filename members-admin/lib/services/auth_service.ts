import { getApiBaseUrl } from '@/lib/config/env';

export type LoginPayload = {
  username: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  admin: {
    username: string;
    name: string;
  };
};

export const authenticate = async (
  credentials: LoginPayload,
): Promise<LoginResponse> => {
  const response = await fetch(`${getApiBaseUrl()}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error('Invalid credentials');
  }

  return response.json() as Promise<LoginResponse>;
};
