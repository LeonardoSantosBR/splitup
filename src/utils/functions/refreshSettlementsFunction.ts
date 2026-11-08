import type { Dispatch, SetStateAction } from "react";
import { getGroupSettlements } from "@/app/actions/settlements";
import type { GroupSettlementProps } from "@/types";

export function refreshSettlements(
  groupId: string,
  setSettlements: Dispatch<SetStateAction<GroupSettlementProps[]>>,
) {
  void getGroupSettlements(groupId).then((result) => {
    if (result.success) setSettlements(result.data.settlements);
  });
}
