import type { Cents } from "@/utils/domain/moneyDomain";

export type GroupBalanceProps = {
  memberId: string;
  memberName: string;
  amountCents: Cents;
};

export type GroupBalancesProps = {
  balances: GroupBalanceProps[];
};
