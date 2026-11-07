export type ExpenseSummaryProps = {
  id: string;
  description: string;
  amountCents: number;
  payerName: string;
  occurredAt: string;
};

export type ExpensePageProps = {
  items: ExpenseSummaryProps[];
  page: number;
  totalPages: number;
};
