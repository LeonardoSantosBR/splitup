import type { Member } from "../expenseFormProps";
import type { ExpenseSummaryProps } from "../expenseSummaryProps";

export type GroupExpensesProps = {
  groupId: string;
  members: Member[];
  initialExpenses: ExpenseSummaryProps[];
  initialTotalPages: number;
  onExpenseCreated?: () => void;
};
