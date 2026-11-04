import { Member } from "./expense-form-props";
import { ExpenseSummaryProps } from "./expense-summary-props";

export type GroupExpensesProps = {
  groupId: string;
  members: Member[];
  initialExpenses: ExpenseSummaryProps[];
};
