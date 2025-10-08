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

const reversedDateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

const isValidDate = (value?: string | null) => {
  if (!value) {
    return false;
  }
  const date = new Date(value);
  return !Number.isNaN(date.getTime());
};

export const formatReversedDate = (value?: string | null) => {
  if (!isValidDate(value)) {
    return '—';
  }

  const [day, month, year] = reversedDateFormatter
    .formatToParts(new Date(value as string))
    .filter((part) => part.type !== 'literal')
    .map((part) => part.value);

  return `${year} ${month} ${day}`;
};

const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
});

const reversedDateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
});

export const formatCurrency = (value: number) =>
  currencyFormatter.format(value);

export const formatDate = (value?: string | null) => {
  if (!isValidDate(value)) {
    return '—';
  }
  return dateFormatter.format(new Date(value as string));
};

export const formatDateTime = (value?: string | null) => {
  if (!isValidDate(value)) {
    return '—';
  }
  return dateTimeFormatter.format(new Date(value as string));
};

export const formatReversedDateTime = (value?: string | null) => {
  if (!isValidDate(value)) {
    return '—';
  }

  const parts = reversedDateTimeFormatter
    .formatToParts(new Date(value as string))
    .filter((part) => part.type !== 'literal');

  const getValue = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? '';

  const year = getValue('year');
  const month = getValue('month');
  const day = getValue('day');
  const hour = getValue('hour');
  const minute = getValue('minute');
  const dayPeriod = getValue('dayPeriod');

  const formatted = `${year}  ${month} ${day} ${hour}:${minute} ${dayPeriod}`.trim();
  return formatted || '—';
};

export const formatPhone = (value?: string | null) => {
  if (!value) {
    return '—';
  }

  const normalized = value.replace(/\s+/g, '');
  if (!normalized.startsWith('+') || normalized.length <= 3) {
    return value;
  }

  const countryCode = normalized.slice(0, 3);
  const national = normalized.slice(3).replace(/(\d{3})(?=\d)/g, '$1 ');

  return `${countryCode} ${national}`.trim();
};

const formatConstantLabel = (value: string) =>
  value.charAt(0) + value.slice(1).toLowerCase();

const verificationVariantMap: Record<
  Member['verificationStatus'],
  'success' | 'warning' | 'error'
> = {
  VERIFIED: 'success',
  PENDING: 'warning',
  UNVERIFIED: 'error',
};

const accountVariantMap: Record<Member['status'], 'success' | 'neutral' | 'error'> = {
  ACTIVE: 'success',
  DISABLED: 'neutral',
  BLACKLISTED: 'error',
};

export const getVerificationBadgeVariant = (
  status: Member['verificationStatus']
) => verificationVariantMap[status];

export const getAccountBadgeVariant = (status: Member['status']) =>
  accountVariantMap[status];

export const formatVerificationStatusLabel = (
  status: Member['verificationStatus']
) => formatConstantLabel(status);

export const formatAccountStatusLabel = (status: Member['status']) =>
  formatConstantLabel(status);
