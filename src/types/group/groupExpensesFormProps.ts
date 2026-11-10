import { GroupExpenseProps } from "./groupExpensesPageProps";

export type Member = { id: string; name: string };

export type groupExpensesFormProps = {
  groupId: string;
  members: Member[];
  onCreated?: (expense: GroupExpenseProps) => void;
};
