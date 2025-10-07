'use client';

import { Badge } from '@/components/ui/badge';

const verificationStatuses = [
  { label: 'Verified', variant: 'success' as const, description: 'Identity confirmed.' },
  { label: 'Pending', variant: 'warning' as const, description: 'Awaiting verification.' },
  { label: 'Unverified', variant: 'error' as const, description: 'Action required.' },
];

const accountStatuses = [
  { label: 'Active', variant: 'success' as const, description: 'Account in good standing.' },
  { label: 'Disabled', variant: 'neutral' as const, description: 'Temporarily disabled by admin.' },
  { label: 'Blocklisted', variant: 'error' as const, description: 'Access permanently revoked.' },
];

export const StatusLegend = () => (
  <section className="grid gap-6 rounded-lg border border-border bg-background/80 p-6 shadow-lg backdrop-blur md:grid-cols-2">
    <div>
      <h3 className="text-lg font-semibold">Verification Status</h3>
      <ul className="mt-3 space-y-3 text-sm text-neutral">
        {verificationStatuses.map((status) => (
          <li key={status.label} className="flex items-center gap-3">
            <Badge variant={status.variant}>{status.label}</Badge>
            <span>{status.description}</span>
          </li>
        ))}
      </ul>
    </div>
    <div>
      <h3 className="text-lg font-semibold">Account Status</h3>
      <ul className="mt-3 space-y-3 text-sm text-neutral">
        {accountStatuses.map((status) => (
          <li key={status.label} className="flex items-center gap-3">
            <Badge variant={status.variant}>{status.label}</Badge>
            <span>{status.description}</span>
          </li>
        ))}
      </ul>
    </div>
  </section>
);
