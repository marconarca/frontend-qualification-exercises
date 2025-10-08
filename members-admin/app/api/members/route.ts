import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  fetchMembers,
  searchMembersByEmail,
  searchMembersByMobile,
  searchMembersByName,
} from '@/lib/services/members_service';
import type { GraphqlFilter } from '@/lib/services/members_service';
import { ADMIN_NAME_COOKIE, ADMIN_TOKEN_COOKIE } from '@/lib/config/auth';
import type {
  MembersFilter,
  PaginationState,
} from '@/lib/types/filters';
import type { AccountStatus, VerificationStatus } from '@/lib/types/member';
import {
  filterMembers,
  paginateMembers,
} from '@/app/members/utils/filter_members';
import { buildFilterOptions } from '@/lib/utils/filter_cache';
import { uniqueMembers } from '@/app/members/utils/collection';

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

  const hasNameFilters = names.length > 0;
  const hasEmailFilters = emails.length > 0;
  const hasMobileFilters = mobiles.length > 0;

  const graphqlFilter: GraphqlFilter = {};

  if (!hasNameFilters && !hasEmailFilters && !hasMobileFilters) {
    if (statuses.length > 0) {
      graphqlFilter.status = { in: statuses };
    }

    if (verificationStatuses.length > 0) {
      graphqlFilter.verificationStatus = { in: verificationStatuses };
    }

    const normalizedDomains = domains.filter(Boolean);
    if (normalizedDomains.length > 0) {
      graphqlFilter.domain = { in: normalizedDomains };
    }

    if (registeredFrom || registeredTo) {
      graphqlFilter.dateTimeCreated = {
        ...(registeredFrom ? { greaterThanOrEqual: registeredFrom } : {}),
        ...(registeredTo ? { lesserThanOrEqual: registeredTo } : {}),
      };
    }

    if (lastActiveFrom || lastActiveTo) {
      graphqlFilter.dateTimeLastActive = {
        ...(lastActiveFrom ? { greaterThanOrEqual: lastActiveFrom } : {}),
        ...(lastActiveTo ? { lesserThanOrEqual: lastActiveTo } : {}),
      };
    }
  }

  let allMembers;
  try {
    if (hasNameFilters) {
      const results = await Promise.all(
        names.map((entry) => searchMembersByName(token, entry)),
      );
      allMembers = uniqueMembers(results.flat());
    } else if (hasEmailFilters) {
      const results = await Promise.all(
        emails.map((entry) => searchMembersByEmail(token, entry)),
      );
      allMembers = uniqueMembers(results.flat());
    } else if (hasMobileFilters) {
      const results = await Promise.all(
        mobiles.map((entry) => searchMembersByMobile(token, entry)),
      );
      allMembers = uniqueMembers(results.flat());
    } else {
      allMembers = await fetchMembers(
        token,
        Object.keys(graphqlFilter).length > 0 ? graphqlFilter : undefined,
      );
    }
  } catch (error) {
    console.error(error);
    const storeToClear = cookies();
    storeToClear.delete(ADMIN_TOKEN_COOKIE);
    storeToClear.delete(ADMIN_NAME_COOKIE);
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
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

  const filtered = filterMembers(allMembers, filters);
  const data = paginateMembers(filtered, pagination);

  return NextResponse.json({
    data,
    total: filtered.length,
    page,
    pageSize,
    filterOptions,
  });
};
