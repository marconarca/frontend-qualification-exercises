'use client';

import type { Member } from '@/lib/types/member';
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatPhone,
  getAccountBadgeVariant,
  getVerificationBadgeVariant,
} from '@/lib/utils/format';
import { Badge } from '@/components/ui/badge';

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
    return (
      <div className="p-6 text-center text-sm text-error">
        {error}
      </div>
    );
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
          <tr className="bg-neutral/5 text-left text-xs uppercase tracking-wide text-muted">
            {headers.map((header) => (
              <th key={header} className="px-4 py-3 font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border text-sm">
          {members.map((member) => (
            <tr
              key={member.id}
              className="transition hover:bg-neutral/10"
            >
              <td className="px-4 py-3">
                <div className="font-medium">{member.name}</div>
                <p className="text-xs text-muted">{member.username}</p>
              </td>
              <td className="px-4 py-3">
                <Badge
                  variant={getVerificationBadgeVariant(
                    member.verificationStatus,
                  )}
                >
                  {member.verificationStatus}
                </Badge>
              </td>
              <td className="px-4 py-3">{formatCurrency(member.balance)}</td>
              <td className="px-4 py-3">
                <a
                  className="text-secondary underline-offset-4 hover:underline"
                  href={`mailto:${member.email}`}
                >
                  {member.email}
                </a>
              </td>
              <td className="px-4 py-3">{formatPhone(member.mobile)}</td>
              <td className="px-4 py-3">
                <a
                  className="text-secondary underline-offset-4 hover:underline"
                  href={member.domain}
                  target="_blank"
                  rel="noreferrer"
                >
                  {member.domain}
                </a>
              </td>
              <td className="px-4 py-3">{formatDate(member.dateRegistered)}</td>
              <td className="px-4 py-3">
                <Badge variant={getAccountBadgeVariant(member.status)}>
                  {member.status}
                </Badge>
              </td>
              <td className="px-4 py-3">{formatDateTime(member.lastActive)}</td>
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
