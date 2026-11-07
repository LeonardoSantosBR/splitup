import type { GroupBalancesProps } from "./groupBalancesProps";
import type { GroupExpensesProps } from "./groupExpensesProps";

export type GroupWorkspaceProps = GroupExpensesProps & {
  initialBalances: GroupBalancesProps;
};
