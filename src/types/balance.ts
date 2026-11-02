import type { Cents } from "@/lib/domain/money";

export type Balance = {
  memberId: string;
  amount: Cents;
};
