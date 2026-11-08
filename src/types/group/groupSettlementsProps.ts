import type { Cents } from "@/utils/domain/moneyDomain";

export type GroupSettlementProps = {
  fromMemberId: string;
  fromMemberName: string;
  toMemberId: string;
  toMemberName: string;
  amountCents: Cents;
};

export type GroupSettlementsProps = {
  settlements: GroupSettlementProps[];
};
