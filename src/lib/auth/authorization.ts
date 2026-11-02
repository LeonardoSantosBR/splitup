import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { ForbiddenError, UnauthorizedError } from "../errors";

export async function checkUserAuth() {
  const session = await auth();
  if (!session?.user?.id) throw new UnauthorizedError();
  return session.user;
}

export async function requireGroupMember(groupId: string) {
  const user = await checkUserAuth();
  const userId = user.id;
  if (!userId) throw new UnauthorizedError();
  const membership = await prisma.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId } },
  });
  if (!membership) throw new ForbiddenError();
  return { user, membership };
}
