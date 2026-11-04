import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { GroupExpenses } from "@/components/expenses";
import { checkUserGroupMember } from "@/utils/auth/authorization";
import { prisma } from "@/utils/db/prisma";

export const dynamic = "force-dynamic";

export default async function GroupPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const { groupId } = await params;
  await checkUserGroupMember(groupId);
  const group = await prisma.group.findUnique({
    where: { id: groupId },
    include: {
      members: { include: { user: true } },
      expenses: {
        include: { payer: true },
        orderBy: { occurredAt: "desc" },
        take: 20,
      },
    },
  });
  if (!group) redirect("/groups");
  return (
    <main className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <a href="/groups" className="text-sm font-semibold text-(--primary)">
          ← Voltar para grupos
        </a>
        <h1 className="mt-5 text-4xl font-bold text-foreground">
          {group.name}
        </h1>
        <p className="mt-2 text-(--dark-teal)">
          {group.members.length} participante(s)
        </p>
        <GroupExpenses
          groupId={group.id}
          members={group.members.map(({ user }) => ({
            id: user.id,
            name: user.name ?? user.email ?? "Membro",
          }))}
          initialExpenses={group.expenses.map((expense) => ({
            id: expense.id,
            description: expense.description,
            amountCents: expense.amountCents,
            payerName: expense.payer.name ?? expense.payer.email ?? "Membro",
            occurredAt: expense.occurredAt.toISOString(),
          }))}
        />
      </div>
    </main>
  );
}
