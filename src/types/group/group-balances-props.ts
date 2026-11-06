import type { Cents } from "@/utils/domain/money-domain";

export type GroupBalanceProps = {
  memberId: string;
  memberName: string;
  amountCents: Cents;
};

export type GroupBalancesProps = {
  balances: GroupBalanceProps[];
};
