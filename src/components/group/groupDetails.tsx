"use client";

import { useState } from "react";
import type { GroupWorkspaceProps } from "@/types";
import { refreshBalances } from "@/utils/functions/refreshBalancesFunction";
import { GroupBalances } from "./groupBalances";
import { GroupExpenses } from "./expenses/groupExpenses";

export function GroupDetails({
  initialBalances,
  ...expenseProps
}: GroupWorkspaceProps) {
  const [balances, setBalances] = useState(initialBalances.balances);
  return (
    <>
      <GroupExpenses
        {...expenseProps}
        onExpenseCreated={() =>
          refreshBalances(expenseProps.groupId, setBalances)
        }
      />
      <GroupBalances balances={balances} />
    </>
  );
}
