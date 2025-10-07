'use client';

import { Button } from '@/components/ui/button';

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
    <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
      <div className="flex items-center gap-2 text-sm text-neutral">
        <span>Rows per page:</span>
        <select
          className="rounded-md border border-border bg-background px-3 py-2 text-sm"
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
          disabled={disabled}
        >
          {pageSizeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="text-sm text-neutral">
        Showing <span className="font-medium text-foreground">{from}</span>-
        <span className="font-medium text-foreground">{to}</span> of{' '}
        <span className="font-medium text-foreground">{total}</span>
        {total === 1 ? ' result' : ' results'}
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={disabled || page <= 1}
        >
          Previous
        </Button>
        <span className="text-sm text-neutral">
          Page{' '}
          <span className="font-medium text-foreground">{page}</span> of{' '}
          <span className="font-medium text-foreground">{pageCount}</span>
        </span>
        <Button
          variant="outline"
          type="button"
          onClick={() => onPageChange(Math.min(pageCount, page + 1))}
          disabled={disabled || page >= pageCount}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
