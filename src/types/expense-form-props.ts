import type { ExpenseSummaryProps } from "./expense-summary-props";

export type Member = { id: string; name: string };

export type ExpenseFormProps = {
  groupId: string;
  members: Member[];
  onCreated?: (expense: ExpenseSummaryProps) => void;
};
