'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Member } from '@/lib/types/member';
import type {
  MembersFilter,
  PaginationState,
} from '@/lib/types/filters';
import type { FilterOptions } from '@/lib/utils/filter_cache';
import type { MembersApiResponse } from '../utils/api_types';

const createDefaultFilters = (): MembersFilter => ({
  names: [],
  emails: [],
  mobiles: [],
  domains: [],
  statuses: [],
  verificationStatuses: [],
  registeredFrom: undefined,
  registeredTo: undefined,
  lastActiveFrom: undefined,
  lastActiveTo: undefined,
});

const defaultPagination: PaginationState = {
  page: 1,
  pageSize: 10,
};

const defaultFilterOptions: FilterOptions = {
  names: [],
  domains: [],
  emails: [],
  mobiles: [],
};

export const useMembersData = () => {
  const [filters, setFilters] = useState<MembersFilter>(() =>
    createDefaultFilters(),
  );
  const [pagination, setPagination] =
    useState<PaginationState>(defaultPagination);
  const [members, setMembers] = useState<Member[]>([]);
  const [total, setTotal] = useState(0);
  const [filterOptions, setFilterOptions] =
    useState<FilterOptions>(defaultFilterOptions);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const queryString = useMemo(() => {
    const params = new URLSearchParams();

    filters.names.forEach((name) => params.append('names', name));
    filters.emails.forEach((email) => params.append('emails', email));
    filters.mobiles.forEach((mobile) => params.append('mobiles', mobile));
    filters.domains.forEach((domain) => params.append('domains', domain));

    filters.statuses.forEach((status) => params.append('statuses', status));

    filters.verificationStatuses.forEach((entry) =>
      params.append('verificationStatuses', entry),
    );

    if (filters.registeredFrom) {
      params.set('registeredFrom', filters.registeredFrom);
    }

    if (filters.registeredTo) {
      params.set('registeredTo', filters.registeredTo);
    }

    if (filters.lastActiveFrom) {
      params.set('lastActiveFrom', filters.lastActiveFrom);
    }

    if (filters.lastActiveTo) {
      params.set('lastActiveTo', filters.lastActiveTo);
    }

    params.set('page', pagination.page.toString());
    params.set('pageSize', pagination.pageSize.toString());

    return params.toString();
  }, [filters, pagination]);

  const fetchMembersData = useCallback(
    async (signal: AbortSignal) => {
      setLoading(true);
      setError(undefined);

      try {
        const response = await fetch(`/api/members?${queryString}`, {
          signal,
          cache: 'no-store',
        });

        if (response.status === 401) {
          window.location.href = '/login';
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to load members');
        }

        const payload = (await response.json()) as MembersApiResponse;
        const params = new URLSearchParams(queryString);
        const requestedPage = Number(params.get('page') ?? '1');
        const requestedPageSize = Number(params.get('pageSize') ?? '10');
        const totalPages = Math.max(
          1,
          Math.ceil(payload.total / Math.max(1, requestedPageSize)),
        );

        if (requestedPage > totalPages) {
          setPagination((state) => ({
            ...state,
            page: totalPages,
          }));
          return;
        }

        setMembers(payload.data);
        setTotal(payload.total);
        setFilterOptions(payload.filterOptions);
      } catch (requestError) {
        if ((requestError as Error).name === 'AbortError') {
          return;
        }

        setError(
          (requestError as Error).message ??
            'An unexpected error occurred while fetching members.',
        );
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    },
    [queryString],
  );

  useEffect(() => {
    const controller = new AbortController();
    void fetchMembersData(controller.signal);
    return () => controller.abort();
  }, [fetchMembersData]);

  const updateFilters = (partial: Partial<MembersFilter>) => {
    setFilters((state) => {
      const next: MembersFilter = { ...state, ...partial };

      const dedupe = (values: string[]) => {
        const seen = new Set<string>();
        return values
          .map((value) => value.trim())
          .filter((value) => {
            if (!value) {
              return false;
            }
            if (seen.has(value)) {
              return false;
            }
            seen.add(value);
            return true;
          });
      };

      next.names = dedupe(next.names);
      next.emails = dedupe(next.emails);
      next.mobiles = dedupe(next.mobiles);
      next.domains = dedupe(next.domains);

      const hasNames = next.names.length > 0;
      const hasEmails = next.emails.length > 0;
      const hasMobiles = next.mobiles.length > 0;

      if (hasNames) {
        next.emails = [];
        next.mobiles = [];
      } else if (hasEmails) {
        next.names = [];
        next.mobiles = [];
      } else if (hasMobiles) {
        next.names = [];
        next.emails = [];
      }

      if (hasNames || hasEmails || hasMobiles) {
        next.domains = [];
        next.statuses = [];
        next.verificationStatuses = [];
        next.registeredFrom = undefined;
        next.registeredTo = undefined;
        next.lastActiveFrom = undefined;
        next.lastActiveTo = undefined;
      }

      return next;
    });
    setPagination((state) => ({ ...state, page: 1 }));
  };

  const resetFilters = () => {
    setFilters(createDefaultFilters());
    setPagination(() => ({ ...defaultPagination }));
  };

  const setPage = (page: number) => {
    setPagination((state) => ({ ...state, page }));
  };

  const setPageSize = (pageSize: number) => {
    setPagination(() => ({ page: 1, pageSize }));
  };

  return {
    loading,
    error,
    members,
    total,
    filters,
    filterOptions,
    pagination,
    updateFilters,
    resetFilters,
    setPage,
    setPageSize,
  };
};
