import type { GroupBalancesProps } from "./group-balances-props";
import type { GroupExpensesProps } from "./group-expenses-props";

export type GroupWorkspaceProps = GroupExpensesProps & {
  initialBalances: GroupBalancesProps;
};
