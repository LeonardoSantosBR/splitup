import type { GroupSummaryProps } from "./group/group-props";

export type HomeWorkSpaceProps = {
  initialGroups: GroupSummaryProps[];
  userName: string;
  userImage?: string | null;
};
