"use client";

import { useState } from "react";
import type { GroupDetailsProps } from "@/types";
import { refreshBalances } from "@/utils/functions/refreshBalancesFunction";
import { refreshSettlements } from "@/utils/functions/refreshSettlementsFunction";
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
    initialSettlements.settlements,
  );

  return (
    <>
      <GroupNameEditor
        groupId={expenseProps.groupId}
        initialName={initialGroupName}
      />
      <GroupExpenses
        {...expenseProps}
        onExpenseCreated={() => {
          refreshBalances(expenseProps.groupId, setBalances);
          refreshSettlements(expenseProps.groupId, setSettlements);
        }}
      />
      <GroupBalances balances={balances} />
      <GroupSettlements
        groupId={expenseProps.groupId}
        settlements={settlements}
        onSettled={() =>
          refreshSettlements(expenseProps.groupId, setSettlements)
        }
      />
      <GroupReport groupId={expenseProps.groupId} />
    </>
  );
}
