export type VerificationStatus = 'Verified' | 'Pending' | 'Unverified';

export type AccountStatus = 'Active' | 'Disabled' | 'Blocklisted';

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
