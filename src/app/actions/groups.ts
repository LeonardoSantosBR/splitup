"use server";

import { errorMessage, validationErrors } from "@/errors";
import type { ActionResultProps } from "@/types/action-result-props";
import type { GroupSummaryProps } from "@/types/group-props";
import { checkUserSessionAuth } from "@/utils/auth/authorization";
import { prisma } from "@/utils/db/prisma";
import { toGroupSummary } from "@/utils/helpers/to-group-summary-helper";
import {
  createGroupSchema,
  joinGroupSchema,
} from "@/utils/schemas/group-schemas";

export async function createGroup(
  input: unknown
): Promise<ActionResultProps<GroupSummaryProps>> {
  const parsed = createGroupSchema.safeParse(input);
  if (!parsed.success)
    return { success: false, fieldErrors: validationErrors(parsed.error) };

  try {
    const user = await checkUserSessionAuth();
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
  input: unknown
): Promise<ActionResultProps<GroupSummaryProps>> {
  const parsed = joinGroupSchema.safeParse(input);
  if (!parsed.success)
    return { success: false, fieldErrors: validationErrors(parsed.error) };

  try {
    const user = await checkUserSessionAuth();
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
    const user = await checkUserSessionAuth();
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
