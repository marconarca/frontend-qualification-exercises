import { Member } from '@/lib/types/member';
import { getApiBaseUrl } from '@/lib/config/env';

const jsonHeaders = {
  'Content-Type': 'application/json',
};

const withAuth = (token: string) => ({
  ...jsonHeaders,
  Authorization: `Bearer ${token}`,
});

const request = async <T>(path: string, token: string): Promise<T> => {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    headers: withAuth(token),
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
};

export const fetchMembers = (token: string) =>
  request<Member[]>('/members', token);

export const searchMembersByName = (token: string, query: string) =>
  request<Member[]>(`/members/search/name?q=${encodeURIComponent(query)}`, token);

export const searchMembersByEmail = (token: string, query: string) =>
  request<Member[]>(
    `/members/search/email?q=${encodeURIComponent(query)}`,
    token,
  );

export const searchMembersByMobile = (token: string, query: string) =>
  request<Member[]>(
    `/members/search/mobile?q=${encodeURIComponent(query)}`,
    token,
  );
