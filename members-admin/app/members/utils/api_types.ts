import type { Member } from '@/lib/types/member';
import type { FilterOptions } from '@/lib/utils/filter_cache';

export type MembersApiResponse = {
  data: Member[];
  total: number;
  page: number;
  pageSize: number;
  filterOptions: FilterOptions;
};
