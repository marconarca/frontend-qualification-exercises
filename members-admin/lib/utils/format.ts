import type { Member } from '@/lib/types/member';

const currencyFormatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
});

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: '2-digit',
});

const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
});

export const formatCurrency = (value: number) => currencyFormatter.format(value);

export const formatDate = (value: string) =>
  dateFormatter.format(new Date(value));

export const formatDateTime = (value: string) =>
  dateTimeFormatter.format(new Date(value));

export const formatPhone = (value: string) => {
  const normalized = value.replace(/\s+/g, '');
  if (!normalized.startsWith('+') || normalized.length <= 3) {
    return value;
  }

  const countryCode = normalized.slice(0, 3);
  const national = normalized.slice(3).replace(/(\d{3})(?=\d)/g, '$1 ');

  return `${countryCode} ${national}`.trim();
};

export const getVerificationBadgeVariant = (
  status: Member['verificationStatus'],
) => {
  if (status === 'Verified') {
    return 'success';
  }

  if (status === 'Pending') {
    return 'warning';
  }

  return 'error';
};

export const getAccountBadgeVariant = (status: Member['status']) => {
  if (status === 'Active') {
    return 'success';
  }

  if (status === 'Disabled') {
    return 'neutral';
  }

  return 'error';
};
