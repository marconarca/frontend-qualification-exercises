'use client';

import { Badge } from '@/components/ui/badge';
import type { Member } from '@/lib/types/member';
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatPhone,
  getAccountBadgeVariant,
  getVerificationBadgeVariant,
} from '@/lib/utils/format';

type MembersTableProps = {
  members: Member[];
  loading: boolean;
  error?: string;
};

const headers = [
  'Name',
  'Verification',
  'Balance',
  'Email',
  'Mobile',
  'Domain',
  'Registered',
  'Status',
  'Last Active',
];

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
                <p className="text-xs text-muted">{member.username}</p>
              </td>
              <td className="px-4 py-3">
                <Badge
                  variant={getVerificationBadgeVariant(
                    member.verificationStatus
                  )}
                >
                  {member.verificationStatus}
                </Badge>
              </td>
              <td className="px-4 py-3 text-muted text-[12px]">
                {formatCurrency(member.balance)}
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
                {formatDate(member.dateRegistered)}
              </td>
              <td className="px-4 py-3">
                <Badge variant={getAccountBadgeVariant(member.status)}>
                  {member.status}
                </Badge>
              </td>
              <td className="px-4 py-3 text-muted text-[12px]">
                {formatDateTime(member.lastActive)}
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
