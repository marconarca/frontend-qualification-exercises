import type { Member } from '@/lib/types/member';

export const uniqueMembers = (members: Member[]) => {
  const map = new Map<number, Member>();
  members.forEach((member) => map.set(member.id, member));
  return Array.from(map.values());
};

export const intersectMembers = (
  base: Member[] | undefined,
  incoming: Member[],
) => {
  if (!base || base.length === 0) {
    return uniqueMembers(incoming);
  }

  const baseIds = new Set(base.map((member) => member.id));
  const filtered = incoming.filter((member) => baseIds.has(member.id));
  return uniqueMembers(filtered);
};
