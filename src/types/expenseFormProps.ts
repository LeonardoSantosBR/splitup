import type { ExpenseSummaryProps } from "./expenseSummaryProps";

export type Member = { id: string; name: string };

export type ExpenseFormProps = {
  groupId: string;
  members: Member[];
  onCreated?: (expense: ExpenseSummaryProps) => void;
};
