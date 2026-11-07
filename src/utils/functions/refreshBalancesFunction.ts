import { getGroupBalances } from "@/app/actions/balances";
import type { GroupBalanceProps } from "@/types";

export function refreshBalances(
  groupId: string,
  setBalances: (balances: GroupBalanceProps[]) => void,
): void {
  void getGroupBalances(groupId).then((result) => {
    if (result.success) setBalances(result.data.balances);
  });
}
