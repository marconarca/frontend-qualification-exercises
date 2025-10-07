import type { AccountStatus, VerificationStatus } from './member';

export type MembersFilter = {
  names: string[];
  emails: string[];
  mobiles: string[];
  domains: string[];
  usernames: string[];
  statuses: AccountStatus[];
  verificationStatuses: VerificationStatus[];
  registeredFrom?: string;
  registeredTo?: string;
  lastActiveFrom?: string;
  lastActiveTo?: string;
};

export type PaginationState = {
  page: number;
  pageSize: number;
};
