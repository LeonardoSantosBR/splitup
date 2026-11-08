import type { GroupBalancesProps } from "./groupBalancesProps";
import type { GroupExpensesProps } from "./groupExpensesProps";
import type { GroupSettlementsProps } from "./groupSettlementsProps";

export type GroupDetailsProps = GroupExpensesProps & {
  initialGroupName: string;
  initialBalances: GroupBalancesProps;
  initialSettlements: GroupSettlementsProps;
};
