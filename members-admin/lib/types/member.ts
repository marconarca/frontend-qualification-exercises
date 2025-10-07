export type VerificationStatus = 'Verified' | 'Pending' | 'Unverified';

export type AccountStatus = 'Active' | 'Disabled' | 'Blocklisted';

export type Member = {
  id: number;
  name: string;
  username: string;
  verificationStatus: VerificationStatus;
  balance: number;
  email: string;
  mobile: string;
  domain: string;
  dateRegistered: string;
  status: AccountStatus;
  lastActive: string;
};
