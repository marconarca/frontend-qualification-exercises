export type VerificationStatus = 'VERIFIED' | 'PENDING' | 'UNVERIFIED';

export type AccountStatus = 'ACTIVE' | 'DISABLED' | 'BLACKLISTED';

export type Member = {
  id: string;
  name: string;
  verificationStatus: VerificationStatus;
  emailAddress: string | null;
  mobileNumber: string | null;
  domain: string | null;
  dateTimeCreated: string;
  status: AccountStatus;
  dateTimeLastActive: string;
};
