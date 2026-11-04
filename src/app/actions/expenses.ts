"use server";

import { errorMessage, validationErrors } from "@/errors";
import type { ActionResultProps } from "@/types/action-result-props";
import type { ExpenseSummaryProps } from "@/types/expense-summary-props";
import { checkUserGroupMember } from "@/utils/auth/authorization";
import { prisma } from "@/utils/db/prisma";
import { splitEqually } from "@/utils/domain/splits";
import { parseAmountToCents } from "@/utils/helpers/money-input-helper";
import { createExpenseSchema } from "@/utils/schemas/expense-schemas";

export async function createExpense(
  input: unknown,
): Promise<ActionResultProps<ExpenseSummaryProps>> {
  const parsed = createExpenseSchema.safeParse(input);
  if (!parsed.success)
    return { success: false, fieldErrors: validationErrors(parsed.error) };
  try {
    const { groupId } = parsed.data;
    await checkUserGroupMember(groupId);
    const amount = parseAmountToCents(parsed.data.amount);
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: { members: { include: { user: true } } },
    });
    if (
      !group ||
      !group.members.some((member) => member.userId === parsed.data.payerId)
    )
      return { success: false, formError: "Pagador inválido para este grupo." };
    const memberIds = [...new Set(parsed.data.participantIds)];
    if (
      memberIds.some(
        (memberId) =>
          !group.members.some((member) => member.userId === memberId),
      )
    )
      return {
        success: false,
        formError: "Participante inválido para este grupo.",
      };
    const shares = splitEqually(amount, memberIds);
    const expense = await prisma.expense.create({
      data: {
        groupId,
        payerId: parsed.data.payerId,
        description: parsed.data.description,
        amountCents: amount,
        shares: {
          create: [...shares].map(([memberId, amountCents]) => ({
            memberId,
            amountCents,
          })),
        },
      },
    });
    const payer = group.members.find(
      (member) => member.userId === expense.payerId,
    );
    return {
      success: true,
      data: {
        id: expense.id,
        description: expense.description,
        amountCents: expense.amountCents,
        payerName: payer?.user.name ?? payer?.user.email ?? "Membro",
        occurredAt: expense.occurredAt.toISOString(),
      },
    };
  } catch (error) {
    return {
      success: false,
      formError: errorMessage(error, "Não foi possível criar a despesa."),
    };
  }
}
