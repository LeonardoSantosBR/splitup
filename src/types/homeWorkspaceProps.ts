import type { GroupSummaryProps } from "./group/groupProps";

export type HomeWorkSpaceProps = {
  initialGroups: GroupSummaryProps[];
  initialPage: number;
  initialTotalPages: number;
  userName: string;
  userImage?: string | null;
};
