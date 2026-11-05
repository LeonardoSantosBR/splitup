import { Dispatch, SetStateAction } from "react";

export function clearMessages(
  setFeedback: Dispatch<SetStateAction<string | null>>,
  setError: Dispatch<SetStateAction<string | null>>
) {
  setFeedback(null);
  setError(null);
}
