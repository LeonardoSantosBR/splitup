export type PaginationProps = {
  page: number;
  totalPages: number;
  isPending: boolean;
  onChangePage: (page: number) => void;
};
