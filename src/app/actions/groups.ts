"use server";

import { AuthUserSessionAuth } from "@/auth/auth";
import { prisma } from "@/db/prismaDb";
import type { ActionResultProps } from "@/types/actionResultProps";
import type { GroupSummaryProps } from "@/types/group/groupProps";
import { errorMessage } from "@/utils/functions/errorMessageFunction";
import { toGroupSummary } from "@/utils/functions/toGroupSummaryFunction";
import { validationErrors } from "@/utils/functions/validationErrorsFunction";
import {
  createGroupSchema,
  joinGroupSchema,
  updateGroupNameSchema,
} from "@/utils/schemas/groupSchema";

export async function createGroup(
  input: unknown,
): Promise<ActionResultProps<GroupSummaryProps>> {
  const parsed = createGroupSchema.safeParse(input);
  if (!parsed.success)
    return { success: false, fieldErrors: validationErrors(parsed.error) };

  try {
    const user = await AuthUserSessionAuth();
    const group = await prisma.$transaction(async (transaction) => {
      const createdGroup = await transaction.group.create({
        data: { name: parsed.data.name, creatorId: user.id },
      });
      await transaction.groupMember.create({
        data: { groupId: createdGroup.id, userId: user.id },
      });
      return createdGroup;
    });
    return { success: true, data: toGroupSummary(group) };
  } catch (error) {
    return {
      success: false,
      formError: errorMessage(error, "Não foi possível criar o grupo."),
    };
  }
}

export async function joinGroup(
  input: unknown,
): Promise<ActionResultProps<GroupSummaryProps>> {
  const parsed = joinGroupSchema.safeParse(input);
  if (!parsed.success)
    return { success: false, fieldErrors: validationErrors(parsed.error) };

  try {
    const user = await AuthUserSessionAuth();
    const group = await prisma.group.findUnique({
      where: { inviteToken: parsed.data.inviteToken },
    });
    if (!group)
      return { success: false, formError: "Convite inválido ou expirado." };

    await prisma.groupMember.upsert({
      where: { groupId_userId: { groupId: group.id, userId: user.id } },
      create: { groupId: group.id, userId: user.id },
      update: {},
    });
    return { success: true, data: toGroupSummary(group) };
  } catch (error) {
    return {
      success: false,
      formError: errorMessage(error, "Não foi possível entrar no grupo."),
    };
  }
}

export async function listUserGroups(): Promise<
  ActionResultProps<GroupSummaryProps[]>
> {
  try {
    const user = await AuthUserSessionAuth();
    const memberships = await prisma.groupMember.findMany({
      where: { userId: user.id },
      include: { group: true },
      orderBy: { joinedAt: "desc" },
    });
    return {
      success: true,
      data: memberships.map(({ group }) => toGroupSummary(group)),
    };
  } catch (error) {
    return {
      success: false,
      formError: errorMessage(error, "Não foi possível carregar seus grupos."),
    };
  }
}

export async function updateGroupName(
  input: unknown,
): Promise<ActionResultProps<GroupSummaryProps>> {
  const parsed = updateGroupNameSchema.safeParse(input);
  if (!parsed.success)
    return { success: false, fieldErrors: validationErrors(parsed.error) };
  try {
    const user = await AuthUserSessionAuth();
    const membership = await prisma.groupMember.findUnique({
      where: {
        groupId_userId: { groupId: parsed.data.groupId, userId: user.id },
      },
    });
    if (!membership)
      return { success: false, formError: "Você não participa deste grupo." };
    const group = await prisma.group.update({
      where: { id: parsed.data.groupId },
      data: { name: parsed.data.name },
    });
    return { success: true, data: toGroupSummary(group) };
  } catch (error) {
    return {
      success: false,
      formError: errorMessage(error, "Não foi possível atualizar o grupo."),
    };
  }
}

export async function closeGroup(
  groupId: string,
): Promise<ActionResultProps<null>> {
  try {
    const user = await AuthUserSessionAuth();
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      select: { creatorId: true, isClosed: true },
    });
    if (!group || group.creatorId !== user.id)
      return {
        success: false,
        formError: "Apenas o criador pode fechar o grupo.",
      };
    if (group.isClosed) return { success: true, data: null };
    await prisma.group.update({
      where: { id: groupId },
      data: { isClosed: true },
    });
    return { success: true, data: null };
  } catch (error) {
    return {
      success: false,
      formError: errorMessage(error, "Não foi possível fechar o grupo."),
    };
  }
}
