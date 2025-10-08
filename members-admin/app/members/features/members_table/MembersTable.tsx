'use client';

import { Badge } from '@/components/ui/badge';
import type { Member } from '@/lib/types/member';
import { cn } from '@/lib/utils/cn';
import {
  formatPhone,
  formatReversedDate,
  formatReversedDateTime,
  getAccountBadgeVariant,
  getVerificationBadgeVariant,
} from '@/lib/utils/format';
import { AlertCircle, Ban, CheckCircle2 } from 'lucide-react';

type MembersTableProps = {
  members: Member[];
  loading: boolean;
  error?: string;
};

const headers = [
  'Name',
  'Verification',
  'Email',
  'Mobile',
  'Domain',
  'Registered',
  'Status',
  'Last Active',
];

const verificationDotColors: Record<Member['verificationStatus'], string> = {
  Verified: 'bg-success',
  Pending: 'bg-warning',
  Unverified: 'bg-error',
};

const statusIconMap: Record<Member['status'], React.ReactNode> = {
  Active: <CheckCircle2 className="h-3.5 w-3.5" />,
  Blocklisted: <AlertCircle className="h-3.5 w-3.5" />,
  Disabled: <Ban className="h-3.5 w-3.5" />,
};

const statusBackgroundMap: Record<Member['status'], string> = {
  Active: 'bg-[#053321] border-transparent',
  Blocklisted: 'bg-[#55160C] border-transparent',
  Disabled: 'bg-[#161B26] border-transparent text-neutral',
};

export const MembersTable = ({
  members,
  loading,
  error,
}: MembersTableProps) => {
  if (loading && members.length === 0) {
    return (
      <div className="p-6 text-center text-sm text-neutral">
        Fetching member records...
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-center text-sm text-error">{error}</div>;
  }

  if (!loading && members.length === 0) {
    return (
      <div className="p-6 text-center text-sm text-neutral">
        No members match the current filter criteria.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-border">
        <thead>
          <tr className="bg-background-secondary text-left text-xs uppercase tracking-wide text-muted border-b border-neutral/30">
            {headers.map((header) => (
              <th key={header} className="px-4 py-3 font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-sm bg-background-secondary">
          {members.map((member) => (
            <tr
              key={member.id}
              className="transition hover:bg-neutral/10 border-b border-neutral/30"
            >
              <td className="px-4 py-3">
                <div className="font-medium text-[12px]">{member.name}</div>
              </td>
              <td className="px-4 py-3">
                <Badge
                  variant={getVerificationBadgeVariant(
                    member.verificationStatus
                  )}
                  className="gap-2"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      'h-2.5 w-2.5 rounded-full',
                      verificationDotColors[member.verificationStatus]
                    )}
                  />
                  <span>{member.verificationStatus}</span>
                </Badge>
              </td>
              <td className="px-4 py-3">
                <a
                  className="text-muted underline-offset-4 hover:underline text-[12px]"
                  href={`mailto:${member.email}`}
                >
                  {member.email}
                </a>
              </td>
              <td className="px-4 py-3 text-muted text-[12px]">
                {formatPhone(member.mobile)}
              </td>
              <td className="px-4 py-3">
                <a
                  className="text-muted underline-offset-4 hover:underline text-[12px]"
                  href={member.domain}
                  target="_blank"
                  rel="noreferrer"
                >
                  {member.domain}
                </a>
              </td>
              <td className="px-4 py-3 text-muted text-[12px]">
                {formatReversedDate(member.dateRegistered)}
              </td>
              <td className="px-4 py-3">
                <Badge
                  variant={getAccountBadgeVariant(member.status)}
                  className={cn('gap-2', statusBackgroundMap[member.status])}
                >
                  <span className="flex h-4 w-4 items-center justify-center">
                    {statusIconMap[member.status]}
                  </span>
                  <span>{member.status}</span>
                </Badge>
              </td>
              <td className="px-4 py-3 text-muted text-[12px]">
                {formatReversedDateTime(member.lastActive)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {loading && members.length > 0 && (
        <div className="p-4 text-center text-xs text-neutral">
          Refreshing results...
        </div>
      )}
    </div>
  );
};
