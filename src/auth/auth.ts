import { auth } from "@/auth";
import { prisma } from "@/db/prismaDb";
import { ForbiddenError, UnauthorizedError } from "../errors";

export async function AuthUserSessionAuth() {
  const session = await auth();
  if (!session?.user?.id) throw new UnauthorizedError();
  return { ...session.user, id: session.user.id };
}

export async function AuthUserGroupMember(groupId: string) {
  const user = await AuthUserSessionAuth();
  const userId = user.id;
  if (!userId) throw new UnauthorizedError();
  const membership = await prisma.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId } },
  });
  if (!membership) throw new ForbiddenError();
  return { user, membership };
}
