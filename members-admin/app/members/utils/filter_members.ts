import type { Member } from '@/lib/types/member';
import type {
  MembersFilter,
  PaginationState,
} from '@/lib/types/filters';

const isWithinRange = (
  value: string,
  from?: string,
  to?: string,
) => {
  const timestamp = new Date(value).getTime();

  if (Number.isNaN(timestamp)) {
    return false;
  }

  if (from && timestamp < new Date(from).getTime()) {
    return false;
  }

  if (to && timestamp > new Date(to).getTime()) {
    return false;
  }

  return true;
};

const applyFilterLogic = (member: Member, filters: MembersFilter) => {
  const {
    names,
    domains,
    emails,
    mobiles,
    statuses,
    verificationStatuses,
    registeredFrom,
    registeredTo,
    lastActiveFrom,
    lastActiveTo,
  } = filters;

  if (names.length > 0 && !names.includes(member.name)) {
    return false;
  }

  if (domains.length > 0 && !domains.includes(member.domain)) {
    return false;
  }

  if (emails.length > 0 && !emails.includes(member.email)) {
    return false;
  }

  if (mobiles.length > 0 && !mobiles.includes(member.mobile)) {
    return false;
  }

  if (statuses.length > 0 && !statuses.includes(member.status)) {
    return false;
  }

  if (
    verificationStatuses.length > 0 &&
    !verificationStatuses.includes(member.verificationStatus)
  ) {
    return false;
  }

  if (
    (registeredFrom || registeredTo) &&
    !isWithinRange(member.dateRegistered, registeredFrom, registeredTo)
  ) {
    return false;
  }

  if (
    (lastActiveFrom || lastActiveTo) &&
    !isWithinRange(member.lastActive, lastActiveFrom, lastActiveTo)
  ) {
    return false;
  }

  return true;
};

export const filterMembers = (
  members: Member[],
  filters: MembersFilter,
) => members.filter((member) => applyFilterLogic(member, filters));

export const paginateMembers = (
  members: Member[],
  pagination: PaginationState,
) => {
  const { page, pageSize } = pagination;
  const start = (page - 1) * pageSize;
  return members.slice(start, start + pageSize);
};
