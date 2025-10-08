import {
  getAuthBasicToken,
  getAuthPlatformCode,
  getAuthRole,
  getAuthSessionEndpoint,
} from '@/lib/config/env';

export type CreateSessionResponse = {
  session: {
    id: string;
    dateTimeCreated: string;
  };
  accessToken: string;
  refreshToken: string;
};

export const createSession = async (): Promise<CreateSessionResponse> => {
  const response = await fetch(getAuthSessionEndpoint(), {
    method: 'POST',
    headers: {
      authorization: getAuthBasicToken(),
      'platform-code': getAuthPlatformCode(),
      role: getAuthRole(),
    },
  });

  if (!response.ok) {
    throw new Error('Failed to create session');
  }

  return response.json() as Promise<CreateSessionResponse>;
};
