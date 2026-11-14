import type { HomeGroupProps } from "./homeGroupProps";

export type HomeGroupListProps = {
  groups: HomeGroupProps[];
  onCopyInvite: (group: HomeGroupProps) => void;
  page: number;
  totalPages: number;
  isPending: boolean;
  onChangePage: (page: number) => void;
};
