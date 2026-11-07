import type { GroupSummaryProps } from "./groupProps";

export type GroupListProps = {
  groups: GroupSummaryProps[];
  onCopyInvite: (group: GroupSummaryProps) => void;
};
