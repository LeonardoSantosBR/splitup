import type { Cents } from "@/utils/domain/moneyDomain";

export type BalanceProps = {
  memberId: string;
  amount: Cents;
};
