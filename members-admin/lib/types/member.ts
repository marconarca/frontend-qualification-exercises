export type VerificationStatus = 'VERIFIED' | 'PENDING' | 'UNVERIFIED';

export type AccountStatus = 'ACTIVE' | 'DISABLED' | 'BLACKLISTED';

export type Member = {
  id: number;
  name: string;
  verificationStatus: VerificationStatus;
  emailAddress: string;
  mobileNumber: string;
  domain: string;
  dateTimeCreated: string;
  status: AccountStatus;
  dateTimeLastActive: string;
};
