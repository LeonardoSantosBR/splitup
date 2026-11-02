"use server";

import { checkUserSessionAuth } from "@/lib/auth/authorization";
import { prisma } from "@/lib/db/prisma";
import {
  errorMessage,
  toGroupSummary,
  validationErrors,
} from "@/lib/functions/group-action-helpers";
import {
  createGroupSchema,
  joinGroupSchema,
} from "@/lib/validation/group-schemas";
import type { ActionResult } from "@/types/action-result";
import type { GroupSummary } from "@/types/group";

export async function createGroup(
  input: unknown,
): Promise<ActionResult<GroupSummary>> {
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
    return { success: false, formError: errorMessage(error) };
  }
}

export async function joinGroup(
  input: unknown,
): Promise<ActionResult<GroupSummary>> {
  const parsed = joinGroupSchema.safeParse(input);
  if (!parsed.success)
    return { success: false, fieldErrors: validationErrors(parsed.error) };

  try {
    const user = await checkUserSessionAuth();
    const group = await prisma.group.findUnique({
      where: { inviteToken: parsed.data.inviteToken },
    });
    if (!group)
      return { success: false, formError: "Invalid or expired invitation." };

    await prisma.groupMember.upsert({
      where: { groupId_userId: { groupId: group.id, userId: user.id } },
      create: { groupId: group.id, userId: user.id },
      update: {},
    });
    return { success: true, data: toGroupSummary(group) };
  } catch (error) {
    return { success: false, formError: errorMessage(error) };
  }
}

export async function listUserGroups(): Promise<ActionResult<GroupSummary[]>> {
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
    return { success: false, formError: errorMessage(error) };
  }
}
