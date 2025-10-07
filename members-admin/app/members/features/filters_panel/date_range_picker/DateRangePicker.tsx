'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils/cn';
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  set,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
  subMonths,
  subWeeks,
} from 'date-fns';
import * as React from 'react';
import { DateRange, DayPicker } from 'react-day-picker';

type DateRangePickerProps = {
  from?: string;
  to?: string;
  onApply: (range: { from?: string; to?: string }) => void;
  onClear: () => void;
  onClose?: () => void;
};

type QuickRange = {
  id: string;
  label: string;
  getRange: () => { range?: DateRange; fromTime?: string; toTime?: string };
};

const defaultFromTime = '00:00';
const defaultToTime = '23:59';

const normalizeDate = (value?: string) => {
  if (!value) return undefined;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
};

const quickRanges: QuickRange[] = [
  {
    id: 'today',
    label: 'Today',
    getRange: () => {
      const today = new Date();
      return {
        range: { from: startOfDay(today), to: endOfDay(today) },
        fromTime: defaultFromTime,
        toTime: defaultToTime,
      };
    },
  },
  {
    id: 'yesterday',
    label: 'Yesterday',
    getRange: () => {
      const yesterday = subDays(new Date(), 1);
      return {
        range: { from: startOfDay(yesterday), to: endOfDay(yesterday) },
        fromTime: defaultFromTime,
        toTime: defaultToTime,
      };
    },
  },
  {
    id: 'this-week',
    label: 'This week',
    getRange: () => {
      const now = new Date();
      return {
        range: {
          from: startOfWeek(now, { weekStartsOn: 1 }),
          to: endOfWeek(now, { weekStartsOn: 1 }),
        },
        fromTime: defaultFromTime,
        toTime: defaultToTime,
      };
    },
  },
  {
    id: 'last-week',
    label: 'Last week',
    getRange: () => {
      const now = new Date();
      const lastWeekStart = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
      return {
        range: {
          from: lastWeekStart,
          to: endOfWeek(lastWeekStart, { weekStartsOn: 1 }),
        },
        fromTime: defaultFromTime,
        toTime: defaultToTime,
      };
    },
  },
  {
    id: 'this-month',
    label: 'This month',
    getRange: () => {
      const now = new Date();
      return {
        range: {
          from: startOfMonth(now),
          to: endOfMonth(now),
        },
        fromTime: defaultFromTime,
        toTime: defaultToTime,
      };
    },
  },
  {
    id: 'last-month',
    label: 'Last month',
    getRange: () => {
      const now = new Date();
      const lastMonth = subMonths(now, 1);
      return {
        range: {
          from: startOfMonth(lastMonth),
          to: endOfMonth(lastMonth),
        },
        fromTime: defaultFromTime,
        toTime: defaultToTime,
      };
    },
  },
  {
    id: 'this-year',
    label: 'This year',
    getRange: () => {
      const now = new Date();
      return {
        range: {
          from: startOfYear(now),
          to: endOfDay(now),
        },
        fromTime: defaultFromTime,
        toTime: defaultToTime,
      };
    },
  },
  {
    id: 'all-time',
    label: 'All time',
    getRange: () => ({
      range: undefined,
      fromTime: defaultFromTime,
      toTime: defaultToTime,
    }),
  },
];

const buildDateWithTime = (date: Date | undefined, time: string) => {
  if (!date) return undefined;
  const [hours = '00', minutes = '00'] = time.split(':');
  const withTime = set(date, {
    hours: Number(hours),
    minutes: Number(minutes),
    seconds: 0,
    milliseconds: 0,
  });
  return withTime;
};

export const DateRangePicker = ({
  from,
  to,
  onApply,
  onClear,
  onClose,
}: DateRangePickerProps) => {
  const initialFromDate = normalizeDate(from);
  const initialToDate = normalizeDate(to);

  const [range, setRange] = React.useState<DateRange | undefined>(() => {
    if (!initialFromDate && !initialToDate) {
      return undefined;
    }
    return {
      from: initialFromDate ?? undefined,
      to: initialToDate ?? initialFromDate ?? undefined,
    };
  });

  const [fromTime, setFromTime] = React.useState(
    initialFromDate ? format(initialFromDate, 'HH:mm') : defaultFromTime
  );
  const [toTime, setToTime] = React.useState(
    initialToDate ? format(initialToDate, 'HH:mm') : defaultToTime
  );
  const [selectedQuick, setSelectedQuick] = React.useState<string | null>(null);

  const handleQuickSelect = (quick: QuickRange) => {
    const {
      range: quickRange,
      fromTime: quickFrom,
      toTime: quickTo,
    } = quick.getRange();
    setRange(quickRange);
    setFromTime(quickFrom ?? defaultFromTime);
    setToTime(quickTo ?? defaultToTime);
    setSelectedQuick(quick.id);
  };

  const handleApply = () => {
    if (!range?.from && !range?.to) {
      onClear();
      onClose?.();
      return;
    }

    const fromDate = range?.from
      ? buildDateWithTime(range.from, fromTime)
      : undefined;
    const toDate = range?.to ? buildDateWithTime(range.to, toTime) : undefined;

    onApply({
      from: fromDate?.toISOString(),
      to: toDate?.toISOString(),
    });
    onClose?.();
  };

  const handleCancel = () => {
    setRange(
      initialFromDate || initialToDate
        ? { from: initialFromDate ?? undefined, to: initialToDate ?? undefined }
        : undefined
    );
    setFromTime(
      initialFromDate ? format(initialFromDate, 'HH:mm') : defaultFromTime
    );
    setToTime(initialToDate ? format(initialToDate, 'HH:mm') : defaultToTime);
    setSelectedQuick(null);
    onClose?.();
  };

  const handleClear = () => {
    setRange(undefined);
    setSelectedQuick('all-time');
    onClear();
    onClose?.();
  };

  return (
    <Dialog defaultOpen onOpenChange={(open) => !open && onClose?.()}>
      <DialogContent className="flex min-h-[420px] min-w-[640px] gap-6 bg-background text-sm text-muted">
        <aside className="w-36 space-y-1 border-r border-neutral/30 pr-3 pt-3 pl-3">
          {quickRanges.map((quick) => (
            <button
              key={quick.id}
              type="button"
              className={cn(
                'w-full rounded-md px-3 py-2 text-left transition',
                selectedQuick === quick.id
                  ? 'bg-secondary text-background'
                  : 'hover:bg-neutral/10'
              )}
              onClick={() => handleQuickSelect(quick)}
            >
              {quick.label}
            </button>
          ))}
          <button
            type="button"
            className="mt-4 w-full rounded-md border border-neutral/30 px-3 py-2 text-left hover:border-secondary hover:text-secondary"
            onClick={handleClear}
          >
            Clear range
          </button>
        </aside>

        <div className="flex flex-1 flex-col gap-4">
          <DayPicker
            mode="range"
            numberOfMonths={2}
            selected={range}
            onSelect={setRange}
            defaultMonth={range?.from ?? new Date()}
            pagedNavigation
            showOutsideDays
            className="rounded-md bg-background p-4 text-neutral"
            classNames={{
              months: 'flex gap-6',
              caption:
                'flex items-center justify-between px-2 py-2 text-sm font-medium text-foreground',
              caption_label: 'text-sm font-semibold',
              nav: 'flex items-center gap-1',
              nav_button:
                'h-8 w-8 rounded-md border border-neutral/30 text-neutral hover:bg-neutral/10',
              day: 'h-9 w-9 rounded-full text-sm hover:bg-neutral/10 focus:outline-none day-cell',
              selected:
                'bg-secondary text-background hover:bg-secondary/90 focus:bg-secondary/90 text-primary',
              range_start:
                'bg-secondary text-background rounded-full hover:bg-secondary/90 focus:bg-secondary/90',
              range_end:
                'bg-secondary text-background rounded-full hover:bg-secondary/90 focus:bg-secondary/90',
              range_middle: 'bg-secondary/40 text-foreground rounded-none',
              weekday: 'text-xs uppercase text-muted',
              head_cell: 'w-9 text-xs font-medium',
              table: 'w-full border-collapse space-y-1',
              cell: 'text-center',
              day_range_end: 'rounded-full',
            }}
          />

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <label className="text-xs uppercase text-muted">From</label>
              <input
                type="time"
                value={fromTime}
                onChange={(event) => setFromTime(event.target.value)}
                className="rounded-md border border-neutral/30 bg-background-secondary/60 px-3 py-2 text-sm text-neutral"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs uppercase text-muted">To</label>
              <input
                type="time"
                value={toTime}
                onChange={(event) => setToTime(event.target.value)}
                className="rounded-md border border-neutral/30 bg-background-secondary/60 px-3 py-2 text-sm text-neutral"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="transparent" type="button" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="button" onClick={handleApply}>
              Apply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
