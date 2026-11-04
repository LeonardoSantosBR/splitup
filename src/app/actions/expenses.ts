"use server";

import { errorMessage, validationErrors } from "@/errors";
import type { ActionResultProps } from "@/types/action-result-props";
import { checkUserGroupMember } from "@/utils/auth/authorization";
import { prisma } from "@/utils/db/prisma";
import { splitEqually } from "@/utils/domain/splits";
import { parseAmountToCents } from "@/utils/helpers/money-input-helper";
import { createExpenseSchema } from "@/utils/schemas/expense-schemas";

export async function createExpense(
  input: unknown,
): Promise<ActionResultProps<{ id: string }>> {
  const parsed = createExpenseSchema.safeParse(input);
  if (!parsed.success)
    return { success: false, fieldErrors: validationErrors(parsed.error) };
  try {
    const { groupId } = parsed.data;
    await checkUserGroupMember(groupId);
    const amount = parseAmountToCents(parsed.data.amount);
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: { members: true },
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
    return { success: true, data: { id: expense.id } };
  } catch (error) {
    return {
      success: false,
      formError: errorMessage(error, "Não foi possível criar a despesa."),
    };
  }
}
