"use client";

import { useState } from "react";
import { getGroupBalances } from "@/app/actions/balances";
import { getGroupSettlements } from "@/app/actions/settlements";
import type { GroupDetailsProps } from "@/types";
import { GroupExpenses } from "./expenses/groupExpenses";
import { GroupBalances } from "./groupBalances";
import { GroupNameEditor } from "./groupNameEditor";
import { GroupReport } from "./groupReport";
import { GroupSettlements } from "./groupSettlements";

export function GroupDetails({
  initialBalances,
  initialSettlements,
  initialGroupName,
  ...expenseProps
}: GroupDetailsProps) {
  const [balances, setBalances] = useState(initialBalances.balances);
  const [settlements, setSettlements] = useState(
    initialSettlements.settlements
  );

  async function refreshFinancialData() {
    const [balancesResult, settlementsResult] = await Promise.all([
      getGroupBalances(expenseProps.groupId),
      getGroupSettlements(expenseProps.groupId),
    ]);
    if (balancesResult.success) setBalances(balancesResult.data.balances);
    if (settlementsResult.success)
      setSettlements(settlementsResult.data.settlements);
  }

  return (
    <>
      <GroupNameEditor
        groupId={expenseProps.groupId}
        initialName={initialGroupName}
      />
      <GroupExpenses
        {...expenseProps}
        onExpenseCreated={() => {
          void refreshFinancialData();
        }}
      />
      <GroupBalances balances={balances} />
      <GroupSettlements
        groupId={expenseProps.groupId}
        settlements={settlements}
        onSettled={() => void refreshFinancialData()}
      />
      <GroupReport groupId={expenseProps.groupId} />
    </>
  );
}
