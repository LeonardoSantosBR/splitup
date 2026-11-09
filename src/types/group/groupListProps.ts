import type { GroupSummaryProps } from "./groupProps";

export type GroupListProps = {
  groups: GroupSummaryProps[];
  onCopyInvite: (group: GroupSummaryProps) => void;
  page: number;
  totalPages: number;
  isPending: boolean;
  onPageChange: (page: number) => void;
};
