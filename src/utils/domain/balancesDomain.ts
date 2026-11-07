import type { Cents } from "./moneyDomain";
import { cents } from "./moneyDomain";

export type { BalanceProps } from "@/types/balanceProps";

export function calculateBalances(
  expenses: readonly { payerId: string; shares: ReadonlyMap<string, Cents> }[]
): Map<string, Cents> {
  const balances = new Map<string, number>();
  for (const expense of expenses) {
    balances.set(
      expense.payerId,
      (balances.get(expense.payerId) ?? 0) +
        [...expense.shares.values()].reduce((sum, share) => sum + share, 0)
    );
    for (const [memberId, share] of expense.shares) {
      balances.set(memberId, (balances.get(memberId) ?? 0) - share);
    }
  }
  return new Map(
    [...balances.entries()].map(([memberId, amount]) => [
      memberId,
      cents(amount),
    ])
  );
}

export function assertBalancesSumToZero(
  balances: ReadonlyMap<string, Cents>
): void {
  const sum = [...balances.values()].reduce(
    (total, balance) => total + balance,
    0
  );
  if (sum !== 0) throw new Error(`Balance invariant violated: sum is ${sum}`);
}
