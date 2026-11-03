import type { Cents } from "@/utils/domain/money";

export type BalanceProps = {
  memberId: string;
  amount: Cents;
};
