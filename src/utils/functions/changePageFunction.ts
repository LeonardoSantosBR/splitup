import { listGroupExpenses } from "@/app/actions/expenses";
import { ExpenseSummaryProps } from "@/types";
import { SetStateAction, TransitionStartFunction } from "react";

export function changePage(
  startTransition: TransitionStartFunction,
  groupId: string,
  setExpenses: (value: SetStateAction<ExpenseSummaryProps[]>) => void,
  setPage: (value: SetStateAction<number>) => void,
  setTotalPages: (value: SetStateAction<number>) => void,
  nextPage: number
) {
  startTransition(async () => {
    const result = await listGroupExpenses(groupId, nextPage);
    if (result.success) {
      setExpenses(result.data.items);
      setPage(result.data.page);
      setTotalPages(result.data.totalPages);
    }
  });
}
