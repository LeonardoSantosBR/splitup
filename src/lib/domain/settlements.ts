import type { Cents } from "./money";
import { cents } from "./money";

export type Settlement = {
  fromMemberId: string;
  toMemberId: string;
  amount: Cents;
};

export function simplifyDebts(
  balances: ReadonlyMap<string, Cents>
): Settlement[] {
  const creditors = [...balances.entries()]
    .filter(([, amount]) => amount > 0)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const debtors = [...balances.entries()]
    .filter(([, amount]) => amount < 0)
    .map(([memberId, amount]) => [memberId, -amount] as const)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

  const settlements: Settlement[] = [];
  let creditorIndex = 0;
  let debtorIndex = 0;
  while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
    const [creditorId, credit] = creditors[creditorIndex];
    const [debtorId, debt] = debtors[debtorIndex];
    const amount = Math.min(credit, debt);
    settlements.push({
      fromMemberId: debtorId,
      toMemberId: creditorId,
      amount: amount as Cents,
    });
    creditors[creditorIndex] = [creditorId, cents(credit - amount)];
    debtors[debtorIndex] = [debtorId, cents(debt - amount)];
    if (credit - amount === 0) creditorIndex++;
    if (debt - amount === 0) debtorIndex++;
  }
  if (creditorIndex < creditors.length || debtorIndex < debtors.length)
    throw new Error("Balances must sum to zero");
  return settlements;
}
