import type { HomeGroupProps } from "@/types/home/homeGroupProps";

export function toGroupSummary(group: {
  id: string;
  name: string;
  inviteToken: string;
  createdAt: Date;
  members?: Array<{ user: { image: string | null } }>;
}): HomeGroupProps {
  return {
    id: group.id,
    name: group.name,
    inviteToken: group.inviteToken,
    createdAt: group.createdAt.toISOString(),
    membersImages: group.members?.map(({ user }) => user.image) ?? [],
  };
}
