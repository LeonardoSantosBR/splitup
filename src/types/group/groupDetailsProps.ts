import type { GroupBalancesProps } from "./groupBalancesProps";
import type { GroupExpensesProps } from "./groupExpensesProps";
import type { GroupSettlementsProps } from "./groupSettlementsProps";

export type GroupDetailsProps = GroupExpensesProps & {
  initialGroupName: string;
  isClosed: boolean;
  canClose: boolean;
  initialBalances: GroupBalancesProps;
  initialSettlements: GroupSettlementsProps;
};
