export type GroupExpenseProps = {
  id: string;
  description: string;
  amountCents: number;
  payerName: string;
  occurredAt: string;
};

export type GroupExpensePageProps = {
  items: GroupExpenseProps[];
  page: number;
  totalPages: number;
};
