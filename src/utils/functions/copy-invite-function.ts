import type { Dispatch, SetStateAction } from "react";
import type { GroupSummaryProps } from "@/types";

export async function copyInvite(
  setError: Dispatch<SetStateAction<string | null>>,
  setFeedback: Dispatch<SetStateAction<string | null>>,
  group: GroupSummaryProps
) {
  await navigator.clipboard.writeText(
    `${window.location.origin}/home?invite=${group.inviteToken}`
  );
  setError(null);
  setFeedback("Link de convite copiado.");
}
