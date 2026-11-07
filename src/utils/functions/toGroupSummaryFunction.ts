import type { GroupSummaryProps } from "@/types/group/groupProps";

export function toGroupSummary(group: {
  id: string;
  name: string;
  inviteToken: string;
  createdAt: Date;
}): GroupSummaryProps {
  return {
    id: group.id,
    name: group.name,
    inviteToken: group.inviteToken,
    createdAt: group.createdAt.toISOString(),
  };
}
