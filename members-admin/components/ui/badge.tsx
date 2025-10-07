import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium uppercase tracking-wide',
  {
    variants: {
      variant: {
        default: 'border-secondary text-secondary',
        success: 'border-success text-success',
        warning: 'border-warning text-warning',
        error: 'border-error text-error',
        neutral: 'border-neutral text-neutral',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

type BadgeProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof badgeVariants>;

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(badgeVariants({ variant, className }))}
      {...props}
    />
  ),
);

Badge.displayName = 'Badge';

export { Badge, badgeVariants };
