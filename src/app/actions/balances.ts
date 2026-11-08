"use server";

import { AuthUserGroupMember } from "@/auth/auth";
import { prisma } from "@/db/prismaDb";
import type { ActionResultProps, GroupBalancesProps } from "@/types";
import {
  assertBalancesSumToZero,
  calculateBalances,
} from "@/utils/domain/balancesDomain";
import { cents } from "@/utils/domain/moneyDomain";
import { errorMessage } from "@/utils/functions/errorMessageFunction";

export async function getGroupBalances(
  groupId: string,
): Promise<ActionResultProps<GroupBalancesProps>> {
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

    const balances = calculateBalances(
      group.expenses.map((expense) => ({
        payerId: expense.payerId,
        shares: new Map(
          expense.shares.map((share) => [
            share.memberId,
            cents(share.amountCents),
          ]),
        ),
      })),
    );
    for (const settlement of group.settlements) {
      balances.set(
        settlement.fromMemberId,
        cents(
          (balances.get(settlement.fromMemberId) ?? 0) + settlement.amountCents,
        ),
      );
      balances.set(
        settlement.toMemberId,
        cents(
          (balances.get(settlement.toMemberId) ?? 0) - settlement.amountCents,
        ),
      );
    }
    assertBalancesSumToZero(balances);
    return {
      success: true,
      data: {
        balances: group.members.map(({ user }) => ({
          memberId: user.id,
          memberName: user.name ?? user.email ?? "Membro",
          amountCents: balances.get(user.id) ?? cents(0),
        })),
      },
    };
  } catch (error) {
    return {
      success: false,
      formError: errorMessage(error, "Não foi possível carregar os saldos."),
    };
  }
}
