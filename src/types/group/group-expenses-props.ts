import type { Member } from "../expense-form-props";
import type { ExpenseSummaryProps } from "../expense-summary-props";

export type GroupExpensesProps = {
  groupId: string;
  members: Member[];
  initialExpenses: ExpenseSummaryProps[];
  initialTotalPages: number;
};
