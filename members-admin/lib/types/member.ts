export type VerificationStatus = 'Verified' | 'Pending' | 'Unverified';

export type AccountStatus = 'Active' | 'Disabled' | 'Blocklisted';

export type Member = {
  id: number;
  name: string;
  verificationStatus: VerificationStatus;
  email: string;
  mobile: string;
  domain: string;
  dateRegistered: string;
  status: AccountStatus;
  lastActive: string;
};
