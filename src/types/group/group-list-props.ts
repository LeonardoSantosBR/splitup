import type { GroupSummaryProps } from "./group-props";

export type GroupListProps = {
  groups: GroupSummaryProps[];
  onCopyInvite: (group: GroupSummaryProps) => void;
};
