import type { GroupSummaryProps } from "./groupProps";

export type GroupListPageProps = {
  items: GroupSummaryProps[];
  page: number;
  totalPages: number;
};
