'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import type { MembersFilter } from '@/lib/types/filters';
import type { AccountStatus, VerificationStatus } from '@/lib/types/member';
import { cn } from '@/lib/utils/cn';
import type { FilterOptions } from '@/lib/utils/filter_cache';
import {
  formatAccountStatusLabel,
  formatReversedDateTime,
  formatVerificationStatusLabel,
} from '@/lib/utils/format';
import { ChevronDown, RotateCcw } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { DateRangePicker } from './date_range_picker/DateRangePicker';

type FiltersPanelProps = {
  filters: MembersFilter;
  filterOptions: FilterOptions;
  loading: boolean;
  onFiltersChange: (partial: Partial<MembersFilter>) => void;
  onReset: () => void;
};

const chipBaseStyles =
  'flex h-10 items-center gap-2 rounded-md border border-neutral/30 bg-background px-3 text-sm text-neutral transition hover:border-secondary hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

const statusOptions: AccountStatus[] = ['ACTIVE', 'DISABLED', 'BLACKLISTED'];
const verificationStatusOptions: VerificationStatus[] = [
  'VERIFIED',
  'PENDING',
  'UNVERIFIED',
];

type FilterChipProps = {
  label: string;
  displayValue?: string;
  isActive?: boolean;
  children: React.ReactNode;
  disabled?: boolean;
};

const FilterChip = ({
  label,
  displayValue,
  isActive,
  children,
  disabled,
}: FilterChipProps) => {
  const [open, setOpen] = useState(false);
  const content =
    typeof children === 'object' && children && 'props' in (children as any)
      ? React.cloneElement(children as React.ReactElement<any>, {
          onClose: () => setOpen(false),
        })
      : children;
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        <button
          type="button"
          className={cn(chipBaseStyles, {
            'border-secondary text-secondary': isActive,
            'opacity-60': disabled,
          })}
        >
          <span className="truncate">{displayValue ?? label}</span>
          <ChevronDown className="h-4 w-4 shrink-0 text-primary" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 border border-border bg-background/90 p-4 shadow-lg">
        {content}
      </PopoverContent>
    </Popover>
  );
};

const hasRange = (from?: string, to?: string) => Boolean(from || to);

const formatRangeLabel = (from?: string, to?: string) => {
  if (!from && !to) return undefined;
  const formattedFrom = from ? formatReversedDateTime(from) : undefined;
  const formattedTo = to ? formatReversedDateTime(to) : undefined;

  if (formattedFrom && formattedTo) {
    return `${formattedFrom} - ${formattedTo}`;
  }

  if (formattedFrom) {
    return `From ${formattedFrom}`;
  }

  return `Until ${formattedTo}`;
};

export const FiltersPanel = ({
  filters,
  filterOptions,
  loading,
  onFiltersChange,
  onReset,
}: FiltersPanelProps) => {
  const primaryFiltersActive =
    filters.names.length > 0 ||
    filters.emails.length > 0 ||
    filters.mobiles.length > 0;

  const hasFilters = useMemo(() => {
    const {
      statuses,
      verificationStatuses,
      registeredFrom,
      registeredTo,
      lastActiveFrom,
      lastActiveTo,
      ...collections
    } = filters;

    const collectionsHaveValues = Object.values(collections).some((value) =>
      Array.isArray(value) ? value.length > 0 : Boolean(value)
    );

    return (
      collectionsHaveValues ||
      statuses.length > 0 ||
      verificationStatuses.length > 0 ||
      hasRange(registeredFrom, registeredTo) ||
      hasRange(lastActiveFrom, lastActiveTo)
    );
  }, [filters]);

  return (
    <section className="relative z-20 rounded-t-lg border border-neutral/30 bg-background-secondary shadow-lg backdrop-blur">
      <div className="flex justify-end px-4 pt-4">
        <Button
          type="button"
          variant="ghost"
          className="flex h-10 items-center gap-2 text-sm text-neutral hover:text-secondary"
          onClick={onReset}
          disabled={!hasFilters && !loading}
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-3 rounded-lg px-4 py-3">
        <div className="flex items-center gap-3 pr-3">
          <span className="text-sm font-semibold text-primary">Filters</span>
          <span className="h-5 w-px bg-neutral/30" />
        </div>

        <FilterChip
          label="Name"
          displayValue={
            filters.names.length ? `Name (${filters.names.length})` : 'Name'
          }
          isActive={filters.names.length > 0}
        >
          <Command>
            <CommandInput placeholder="Search name" />
            <CommandEmpty>No name found.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {filterOptions.names.map((option) => {
                  const isActive = filters.names.includes(option);
                  return (
                    <CommandItem
                      key={option}
                      onSelect={() =>
                        onFiltersChange({
                          names: isActive
                            ? filters.names.filter((name) => name !== option)
                            : [...filters.names, option],
                        })
                      }
                    >
                      <Checkbox checked={isActive} className="mr-2" />
                      <span className="truncate">{option}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </FilterChip>

        <FilterChip
          label="Verification Status"
          displayValue={
            filters.verificationStatuses.length
              ? `Verification (${filters.verificationStatuses.length})`
              : 'Verification Status'
          }
          isActive={filters.verificationStatuses.length > 0}
          disabled={primaryFiltersActive}
        >
          <Command>
            <CommandInput placeholder="Search verification status" />
            <CommandEmpty>No status found.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {verificationStatusOptions.map((option) => {
                  const isActive =
                    filters.verificationStatuses.includes(option);
                  return (
                    <CommandItem
                      key={option}
                      onSelect={() =>
                        onFiltersChange({
                          verificationStatuses: isActive
                            ? filters.verificationStatuses.filter(
                                (statusOption) => statusOption !== option
                              )
                            : [...filters.verificationStatuses, option],
                        })
                      }
                    >
                      <Checkbox checked={isActive} className="mr-2" />
                      <span>{formatVerificationStatusLabel(option)}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </FilterChip>

        <FilterChip
          label="Email Address"
          displayValue={
            filters.emails.length
              ? `Email Address (${filters.emails.length})`
              : 'Email Address'
          }
          isActive={filters.emails.length > 0}
        >
          <Command>
            <CommandInput placeholder="Search email address" />
            <CommandEmpty>No email found.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {filterOptions.emails.map((option) => {
                  const isActive = filters.emails.includes(option);
                  return (
                    <CommandItem
                      key={option}
                      onSelect={() =>
                        onFiltersChange({
                          emails: isActive
                            ? filters.emails.filter((email) => email !== option)
                            : [...filters.emails, option],
                        })
                      }
                    >
                      <Checkbox checked={isActive} className="mr-2" />
                      <span className="truncate">{option}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
          {filters.emails.length > 0 && (
            <div className="mt-3 text-xs text-muted">
              Selected:{' '}
              <ul className="mt-1 space-y-1">
                {filters.emails.map((email) => (
                  <li key={email} className="truncate">
                    {email}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </FilterChip>

        <FilterChip
          label="Mobile Number"
          displayValue={
            filters.mobiles.length
              ? `Mobile Number (${filters.mobiles.length})`
              : 'Mobile Number'
          }
          isActive={filters.mobiles.length > 0}
        >
          <Command>
            <CommandInput placeholder="Search mobile number" />
            <CommandEmpty>No mobile found.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {filterOptions.mobiles.map((option) => {
                  const isActive = filters.mobiles.includes(option);
                  return (
                    <CommandItem
                      key={option}
                      onSelect={() =>
                        onFiltersChange({
                          mobiles: isActive
                            ? filters.mobiles.filter(
                                (mobile) => mobile !== option
                              )
                            : [...filters.mobiles, option],
                        })
                      }
                    >
                      <Checkbox checked={isActive} className="mr-2" />
                      <span className="truncate">{option}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </FilterChip>

        <FilterChip
          label="Domain"
          displayValue={
            filters.domains.length
              ? `Domain (${filters.domains.length})`
              : 'Domain'
          }
          isActive={filters.domains.length > 0}
          disabled={primaryFiltersActive}
        >
          <Command>
            <CommandInput placeholder="Search domain" />
            <CommandEmpty>No domain found.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {filterOptions.domains.map((option) => {
                  const isActive = filters.domains.includes(option);
                  return (
                    <CommandItem
                      key={option}
                      onSelect={() =>
                        onFiltersChange({
                          domains: isActive
                            ? filters.domains.filter(
                                (domain) => domain !== option
                              )
                            : [...filters.domains, option],
                        })
                      }
                    >
                      <Checkbox checked={isActive} className="mr-2" />
                      <span className="truncate">{option}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </FilterChip>

        <FilterChip
          label="Date Registered"
          displayValue={
            formatRangeLabel(filters.registeredFrom, filters.registeredTo) ??
            'Date Registered'
          }
          isActive={hasRange(filters.registeredFrom, filters.registeredTo)}
          disabled={primaryFiltersActive}
        >
          <DateRangePicker
            from={filters.registeredFrom}
            to={filters.registeredTo}
            onApply={({ from: fromDate, to: toDate }) =>
              onFiltersChange({
                registeredFrom: fromDate,
                registeredTo: toDate,
              })
            }
            onClear={() =>
              onFiltersChange({
                registeredFrom: undefined,
                registeredTo: undefined,
              })
            }
          />
        </FilterChip>

        <FilterChip
          label="Status"
          displayValue={
            filters.statuses.length
              ? `Status (${filters.statuses.length})`
              : 'Status'
          }
          isActive={filters.statuses.length > 0}
          disabled={primaryFiltersActive}
        >
          <Command>
            <CommandInput placeholder="Search status" />
            <CommandEmpty>No status found.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {statusOptions.map((option) => {
                  const isActive = filters.statuses.includes(option);
                  return (
                    <CommandItem
                      key={option}
                      onSelect={() =>
                        onFiltersChange({
                          statuses: isActive
                            ? filters.statuses.filter(
                                (status) => status !== option
                              )
                            : [...filters.statuses, option],
                        })
                      }
                    >
                      <Checkbox checked={isActive} className="mr-2" />
                      <span>{formatAccountStatusLabel(option)}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </FilterChip>

        <FilterChip
          label="Date and Time Last Active"
          displayValue={
            formatRangeLabel(filters.lastActiveFrom, filters.lastActiveTo) ??
            'Date and Time Last Active'
          }
          isActive={hasRange(filters.lastActiveFrom, filters.lastActiveTo)}
          disabled={primaryFiltersActive}
        >
          <DateRangePicker
            from={filters.lastActiveFrom}
            to={filters.lastActiveTo}
            onApply={({ from: fromDate, to: toDate }) =>
              onFiltersChange({
                lastActiveFrom: fromDate,
                lastActiveTo: toDate,
              })
            }
            onClear={() =>
              onFiltersChange({
                lastActiveFrom: undefined,
                lastActiveTo: undefined,
              })
            }
          />
        </FilterChip>
      </div>
    </section>
  );
};
