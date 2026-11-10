"use server";

import { AuthUserGroupMember } from "@/auth/auth";
import { prisma } from "@/db/prismaDb";
import { GroupExpensePageProps, GroupExpenseProps } from "@/types";
import type { ActionResultProps } from "@/types/actionResultProps";
import { EXPENSES_PAGE_SIZE } from "@/utils/constants";
import { splitEqually } from "@/utils/domain/splitsDomain";
import { errorMessage } from "@/utils/functions/errorMessageFunction";
import { parseAmountToCents } from "@/utils/functions/moneyInputFunction";
import { validationErrors } from "@/utils/functions/validationErrorsFunction";
import { createExpenseSchema } from "@/utils/schemas/expenseSchema";

export async function createExpense(
  input: unknown
): Promise<ActionResultProps<GroupExpenseProps>> {
  const parsed = createExpenseSchema.safeParse(input);
  if (!parsed.success)
    return { success: false, fieldErrors: validationErrors(parsed.error) };
  try {
    const { groupId } = parsed.data;
    await AuthUserGroupMember(groupId);
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
          !group.members.some((member) => member.userId === memberId)
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
      (member) => member.userId === expense.payerId
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

export async function listGroupExpenses(
  groupId: string,
  page = 1
): Promise<ActionResultProps<GroupExpensePageProps>> {
  try {
    await AuthUserGroupMember(groupId);
    const safePage = Math.max(1, Math.floor(page));
    const [total, expenses] = await prisma.$transaction([
      prisma.expense.count({ where: { groupId } }),
      prisma.expense.findMany({
        where: { groupId },
        include: { payer: true },
        orderBy: { occurredAt: "desc" },
        skip: (safePage - 1) * EXPENSES_PAGE_SIZE,
        take: EXPENSES_PAGE_SIZE,
      }),
    ]);
    return {
      success: true,
      data: {
        page: safePage,
        totalPages: Math.max(1, Math.ceil(total / EXPENSES_PAGE_SIZE)),
        items: expenses.map((expense) => ({
          id: expense.id,
          description: expense.description,
          amountCents: expense.amountCents,
          payerName: expense.payer.name ?? expense.payer.email ?? "Membro",
          occurredAt: expense.occurredAt.toISOString(),
        })),
      },
    };
  } catch (error) {
    return {
      success: false,
      formError: errorMessage(error, "Não foi possível carregar as despesas."),
    };
  }
}
