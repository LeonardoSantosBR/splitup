import type { Cents } from "@/utils/domain/money-domain";

export type BalanceProps = {
  memberId: string;
  amount: Cents;
};
