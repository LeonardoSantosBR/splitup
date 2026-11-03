import { auth } from "@/auth";
import { prisma } from "@/utils/db/prisma";
import { ForbiddenError, UnauthorizedError } from "../../errors";

export async function checkUserSessionAuth() {
  const session = await auth();
  if (!session?.user?.id) throw new UnauthorizedError();
  return { ...session.user, id: session.user.id };
}

export async function checkUserGroupMember(groupId: string) {
  const user = await checkUserSessionAuth();
  const userId = user.id;
  if (!userId) throw new UnauthorizedError();
  const membership = await prisma.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId } },
  });
  if (!membership) throw new ForbiddenError();
  return { user, membership };
}
