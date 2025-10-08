import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  fetchMembers,
  searchMembersByEmail,
  searchMembersByMobile,
  searchMembersByName,
} from '@/lib/services/members_service';
import { ADMIN_TOKEN_COOKIE } from '@/lib/config/auth';
import type {
  MembersFilter,
  PaginationState,
} from '@/lib/types/filters';
import type { AccountStatus, VerificationStatus } from '@/lib/types/member';
import { uniqueMembers, intersectMembers } from '@/app/members/utils/collection';
import {
  filterMembers,
  paginateMembers,
} from '@/app/members/utils/filter_members';
import { buildFilterOptions } from '@/lib/utils/filter_cache';

export const dynamic = 'force-dynamic';

const toNumber = (value: string | null, fallback: number) => {
  const parsed = Number(value);
  return Number.isNaN(parsed) || parsed <= 0 ? fallback : parsed;
};

const toArray = (params: URLSearchParams, key: string) =>
  params.getAll(key).map((entry) => entry.trim()).filter(Boolean);

const safeStatus = (value: string | null) => {
  const statuses: AccountStatus[] = ['ACTIVE', 'DISABLED', 'BLACKLISTED'];
  return statuses.includes(value as AccountStatus)
    ? (value as AccountStatus)
    : undefined;
};

const safeVerificationStatus = (value: string | null) => {
  const statuses: VerificationStatus[] = ['VERIFIED', 'PENDING', 'UNVERIFIED'];
  return statuses.includes(value as VerificationStatus)
    ? (value as VerificationStatus)
    : undefined;
};

export const GET = async (request: NextRequest) => {
  const store = cookies();
  const token = store.get(ADMIN_TOKEN_COOKIE)?.value;

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const { searchParams } = url;

  const page = toNumber(searchParams.get('page'), 1);
  const pageSize = toNumber(searchParams.get('pageSize'), 10);
  const names = toArray(searchParams, 'names');
  const emails = toArray(searchParams, 'emails');
  const mobiles = toArray(searchParams, 'mobiles');
  const domains = toArray(searchParams, 'domains');

  const statuses = toArray(searchParams, 'statuses').reduce<AccountStatus[]>(
    (acc, current) => {
      const normalized = safeStatus(current);
      if (normalized) {
        acc.push(normalized);
      }
      return acc;
    },
  []);
  const verificationStatuses = toArray(
    searchParams,
    'verificationStatuses',
  ).reduce<VerificationStatus[]>((acc, current) => {
    const normalized = safeVerificationStatus(current);
    if (normalized) {
      acc.push(normalized);
    }
    return acc;
  }, []);

  const registeredFrom = searchParams.get('registeredFrom') ?? undefined;
  const registeredTo = searchParams.get('registeredTo') ?? undefined;
  const lastActiveFrom = searchParams.get('lastActiveFrom') ?? undefined;
  const lastActiveTo = searchParams.get('lastActiveTo') ?? undefined;

  const allMembers = await fetchMembers(token);
  let members = allMembers;

  if (names.length > 0) {
    const nameMatches = uniqueMembers(
      (
        await Promise.all(
          names.map((entry) => searchMembersByName(token, entry)),
        )
      ).flat(),
    );

    members = intersectMembers(members, nameMatches);
  }

  if (emails.length > 0) {
    const emailMatches = uniqueMembers(
      (
        await Promise.all(
          emails.map((entry) => searchMembersByEmail(token, entry)),
        )
      ).flat(),
    );

    members = intersectMembers(members, emailMatches);
  }

  if (mobiles.length > 0) {
    const mobileMatches = uniqueMembers(
      (
        await Promise.all(
          mobiles.map((entry) => searchMembersByMobile(token, entry)),
        )
      ).flat(),
    );

    members = intersectMembers(members, mobileMatches);
  }

  const filterOptions = buildFilterOptions(allMembers);

  const filters: MembersFilter = {
    names,
    emails,
    mobiles,
    domains,
    statuses,
    verificationStatuses,
    registeredFrom,
    registeredTo,
    lastActiveFrom,
    lastActiveTo,
  };

  const pagination: PaginationState = {
    page,
    pageSize,
  };

  const filtered = filterMembers(members, filters);
  const data = paginateMembers(filtered, pagination);

  return NextResponse.json({
    data,
    total: filtered.length,
    page,
    pageSize,
    filterOptions,
  });
};
