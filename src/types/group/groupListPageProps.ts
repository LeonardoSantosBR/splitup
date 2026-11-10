import type { HomeGroupProps } from "../home/homeGroupProps";

export type GroupListPageProps = {
  items: HomeGroupProps[];
  page: number;
  totalPages: number;
};
