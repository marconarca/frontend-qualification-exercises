'use client';

import { Button } from '@/components/ui/button';
import { useMemo, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useMembersData } from '../../hooks/use_members_data';
import { signOut } from '../../utils/sign_out';
import { FiltersPanel } from '../filters_panel/FiltersPanel';
import { MembersTable } from '../members_table/MembersTable';
import { PaginationControls } from '../pagination_controls/PaginationControls';
import { StatusLegend } from '../status_legend/StatusLegend';

type MembersDashboardProps = {
  adminName: string;
};

export const MembersDashboard = ({ adminName }: MembersDashboardProps) => {
  const router = useRouter();
  const [isSigningOut, startSignOut] = useTransition();

  const {
    members,
    total,
    loading,
    error,
    filters,
    filterOptions,
    pagination,
    updateFilters,
    resetFilters,
    setPage,
    setPageSize,
  } = useMembersData();

  const pageCount = useMemo(
    () => Math.max(1, Math.ceil(total / pagination.pageSize)),
    [total, pagination.pageSize]
  );

  const handleSignOut = () => {
    startSignOut(async () => {
      try {
        await signOut();
      } finally {
        router.replace('/login');
        router.refresh();
      }
    });
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-screen-xl flex-col px-6 py-10">
      <header className="flex flex-col gap-4 rounded-lg border border-border bg-background/80 p-6 shadow-lg backdrop-blur md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Members</h1>
          <p className="mt-1 text-sm text-muted">
            View your members here. {adminName}
          </p>
        </div>
        <Button
          variant="outline"
          type="button"
          onClick={handleSignOut}
          disabled={isSigningOut}
        >
          {isSigningOut ? 'Signing out…' : 'Sign out'}
        </Button>
      </header>

      <FiltersPanel
        filters={filters}
        filterOptions={filterOptions}
        loading={loading}
        onFiltersChange={updateFilters}
        onReset={resetFilters}
      />

      <section className=" bg-background/80 p-0 shadow-lg backdrop-blur border-l border-b border-r border-neutral/30">
        <MembersTable members={members} loading={loading} error={error} />
        <div className="border-t border-border px-4 py-3 bg-background-secondary">
          <PaginationControls
            page={pagination.page}
            pageSize={pagination.pageSize}
            total={total}
            pageCount={pageCount}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            disabled={loading}
          />
        </div>
      </section>

      <StatusLegend />
    </div>
  );
};
