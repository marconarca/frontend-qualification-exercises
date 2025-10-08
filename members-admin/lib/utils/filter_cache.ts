import { cache } from 'react';
import type { Member } from '@/lib/types/member';

export type FilterOptions = {
  names: string[];
  domains: string[];
  emails: string[];
  mobiles: string[];
};

export const buildFilterOptions = cache(
  (members: Member[]): FilterOptions => {
    const names = new Set<string>();
    const domains = new Set<string>();
    const emails = new Set<string>();
    const mobiles = new Set<string>();

    members.forEach((member) => {
      if (member.name) {
        names.add(member.name);
      }

      if (member.domain) {
        domains.add(member.domain);
      }

      if (member.emailAddress) {
        emails.add(member.emailAddress);
      }

      if (member.mobileNumber) {
        mobiles.add(member.mobileNumber);
      }
    });

    const sortAsc = (values: Set<string>) =>
      Array.from(values).sort((a, b) => a.localeCompare(b));

    return {
      names: sortAsc(names),
      domains: sortAsc(domains),
      emails: sortAsc(emails),
      mobiles: sortAsc(mobiles),
    };
  },
);
