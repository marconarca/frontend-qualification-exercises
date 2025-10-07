'use client';

import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

type PaginationControlsProps = {
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
  disabled?: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
};

const pageSizeOptions = [10, 25, 50];

export const PaginationControls = ({
  page,
  pageSize,
  total,
  pageCount,
  disabled,
  onPageChange,
  onPageSizeChange,
}: PaginationControlsProps) => {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);

  return (
    <div className="flex w-full items-center justify-end gap-2 text-sm text-neutral">
      <div className="flex items-center gap-2">
        <label className="sr-only" htmlFor="page-size">
          Rows per page
        </label>
        <div className="relative">
          <select
            id="page-size"
            className="appearance-none rounded-md border border-neutral/30 bg-background-secondary/60 px-3 py-2 pr-9 text-sm text-neutral"
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            disabled={disabled}
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option} Entries
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral" />
        </div>
      </div>

      <Button
        variant="subtle"
        type="button"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={disabled || page <= 1}
        className="gap-2"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>
      <Button
        variant="subtle"
        type="button"
        onClick={() => onPageChange(Math.min(pageCount, page + 1))}
        disabled={disabled || page >= pageCount}
        className="gap-2"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
