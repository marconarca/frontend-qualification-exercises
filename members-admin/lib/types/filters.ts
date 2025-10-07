import type { AccountStatus, VerificationStatus } from './member';

export type MembersFilter = {
  names: string[];
  emails: string[];
  mobiles: string[];
  domains: string[];
  usernames: string[];
  status?: AccountStatus;
  verificationStatus?: VerificationStatus;
  registeredFrom?: string;
  registeredTo?: string;
  lastActiveFrom?: string;
  lastActiveTo?: string;
};

export type PaginationState = {
  page: number;
  pageSize: number;
};
