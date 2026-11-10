"use client";

import { useState } from "react";
import { getGroupBalances } from "@/app/actions/balances";
import { getGroupSettlements } from "@/app/actions/settlements";
import type { GroupDetailsProps } from "@/types/group";
import { GroupExpensesList } from "./expenses";
import { GroupBalances } from "./GroupBalances";
import { GroupCloseButton } from "./GroupCloseButton";
import { GroupNameEditor } from "./GroupNameEditor";
import { GroupSettlements } from "./GroupSettlements";

export function GroupDetails({
  initialBalances,
  initialSettlements,
  initialGroupName,
  isClosed,
  canClose,
  ...expenseProps
}: GroupDetailsProps) {
  const [balances, setBalances] = useState(initialBalances.balances);
  const [settlements, setSettlements] = useState(
    initialSettlements.settlements,
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
        isClosed={isClosed}
      />
      <GroupExpensesList
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
      {canClose && !isClosed && (
        <GroupCloseButton groupId={expenseProps.groupId} />
      )}
    </>
  );
}
