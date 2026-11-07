import type { GroupSummaryProps } from "./group/groupProps";

export type HomeWorkSpaceProps = {
  initialGroups: GroupSummaryProps[];
  userName: string;
  userImage?: string | null;
};
