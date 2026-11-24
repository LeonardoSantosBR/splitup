export type GroupExpenseProps = {
  payerId: string;
  shares: Array<{
    memberId: string;
    amountCents: number;
  }>;
};

export type GroupMemberProps = {
  user: {
    id: string;
    name: string | null;
    email: string | null;
  };
};

export type GroupSettlementProps = {
  fromMemberId: string;
  toMemberId: string;
  amountCents: number;
};

export type GroupFinancialDataProps = {
  members: GroupMemberProps[];
  expenses: GroupExpenseProps[];
  settlements: GroupSettlementProps[];
};
