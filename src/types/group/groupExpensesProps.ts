import type { Member } from "./groupExpensesFormProps";
import type { ExpenseSummaryProps } from "./groupExpensesPageProps";

export type GroupExpensesProps = {
  groupId: string;
  members: Member[];
  initialExpenses: ExpenseSummaryProps[];
  initialTotalPages: number;
  onExpenseCreated?: () => void;
};
