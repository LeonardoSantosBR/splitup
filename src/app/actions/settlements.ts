"use server";

import { AuthUserGroupMember } from "@/auth/auth";
import { prisma } from "@/db/prismaDb";
import type { ActionResultProps, GroupSettlementsProps } from "@/types";
import { calculateGroupBalances } from "@/utils/domain/groupFinancialDomain";
import { cents } from "@/utils/domain/moneyDomain";
import { simplifyDebts } from "@/utils/domain/settlementsDomain";
import { errorMessage } from "@/utils/functions/errorMessageFunction";

export async function getGroupSettlements(
  groupId: string,
): Promise<ActionResultProps<GroupSettlementsProps>> {
  try {
    await AuthUserGroupMember(groupId);
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        members: { include: { user: true } },
        expenses: { include: { shares: true } },
        settlements: true,
      },
    });
    if (!group) return { success: false, formError: "Grupo não encontrado." };
    const balances = calculateGroupBalances(
      group.expenses.map((expense) => ({
        payerId: expense.payerId,
        shares: new Map(
          expense.shares.map((share) => [
            share.memberId,
            cents(share.amountCents),
          ]),
        ),
      })),
      group.settlements,
    );
    const names = new Map(
      group.members.map(({ user }) => [
        user.id,
        user.name ?? user.email ?? "Membro",
      ]),
    );
    return {
      success: true,
      data: {
        settlements: simplifyDebts(balances).map((settlement) => ({
          fromMemberId: settlement.fromMemberId,
          fromMemberName: names.get(settlement.fromMemberId) ?? "Membro",
          toMemberId: settlement.toMemberId,
          toMemberName: names.get(settlement.toMemberId) ?? "Membro",
          amountCents: settlement.amount,
        })),
      },
    };
  } catch (error) {
    return {
      success: false,
      formError: errorMessage(error, "Não foi possível calcular os acertos."),
    };
  }
}

export async function createSettlement(input: {
  groupId: string;
  fromMemberId: string;
  toMemberId: string;
  amountCents: number;
}): Promise<ActionResultProps<null>> {
  try {
    await AuthUserGroupMember(input.groupId);
    if (
      input.fromMemberId === input.toMemberId ||
      input.amountCents <= 0 ||
      !Number.isInteger(input.amountCents)
    )
      return { success: false, formError: "Pagamento inválido." };
    await prisma.settlement.create({ data: input });
    return { success: true, data: null };
  } catch (error) {
    return {
      success: false,
      formError: errorMessage(error, "Não foi possível registrar o pagamento."),
    };
  }
}
