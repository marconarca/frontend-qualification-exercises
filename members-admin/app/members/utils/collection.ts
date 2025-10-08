import type { Member } from '@/lib/types/member';

export const uniqueMembers = (members: Member[]) => {
  const map = new Map<string, Member>();
  members.forEach((member) => map.set(member.id, member));
  return Array.from(map.values());
};
