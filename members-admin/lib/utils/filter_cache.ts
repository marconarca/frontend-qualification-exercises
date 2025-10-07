import { cache } from 'react';
import type { Member } from '@/lib/types/member';

export type FilterOptions = {
  names: string[];
  domains: string[];
  emails: string[];
  mobiles: string[];
  usernames: string[];
};

export const buildFilterOptions = cache(
  (members: Member[]): FilterOptions => {
    const names = new Set<string>();
    const domains = new Set<string>();
    const emails = new Set<string>();
    const mobiles = new Set<string>();
    const usernames = new Set<string>();

    members.forEach((member) => {
      names.add(member.name);
      domains.add(member.domain);
      emails.add(member.email);
      mobiles.add(member.mobile);
      usernames.add(member.username);
    });

    const sortAsc = (values: Set<string>) =>
      Array.from(values).sort((a, b) => a.localeCompare(b));

    return {
      names: sortAsc(names),
      domains: sortAsc(domains),
      emails: sortAsc(emails),
      mobiles: sortAsc(mobiles),
      usernames: sortAsc(usernames),
    };
  },
);
