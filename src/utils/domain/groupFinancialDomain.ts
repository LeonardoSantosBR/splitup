import { calculateBalances } from "./balancesDomain";
import type { Cents } from "./moneyDomain";
import { cents } from "./moneyDomain";

export type FinancialExpense = {
  payerId: string;
  shares: ReadonlyMap<string, Cents>;
};

export type FinancialSettlement = {
  fromMemberId: string;
  toMemberId: string;
  amountCents: number;
};

export function calculateGroupBalances(
  expenses: readonly FinancialExpense[],
  settlements: readonly FinancialSettlement[],
): Map<string, Cents> {
  const balances = calculateBalances(expenses);
  for (const settlement of settlements) {
    balances.set(
      settlement.fromMemberId,
      cents(
        (balances.get(settlement.fromMemberId) ?? 0) + settlement.amountCents,
      ),
    );
    balances.set(
      settlement.toMemberId,
      cents(
        (balances.get(settlement.toMemberId) ?? 0) - settlement.amountCents,
      ),
    );
  }
  return balances;
}
