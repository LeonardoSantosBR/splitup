import { redirect } from "next/navigation";
import { getGroupBalances } from "@/app/actions/balances";
import { getGroupSettlements } from "@/app/actions/settlements";
import { auth } from "@/auth";
import { AuthUserGroupMember } from "@/auth/auth";
import { GroupDetails } from "@/components/group";
import { prisma } from "@/db/prismaDb";

export const dynamic = "force-dynamic";
export default async function GroupByIdPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const { groupId } = await params;
  await AuthUserGroupMember(groupId);

  const group = await prisma.group.findUnique({
    where: { id: groupId },
    include: {
      members: { include: { user: true } },
      _count: { select: { expenses: true } },
      expenses: {
        include: { payer: true },
        orderBy: { occurredAt: "desc" },
        take: 5,
      },
    },
  });

  if (!group) redirect("/home");
  const balancesResult = await getGroupBalances(groupId);
  const settlementsResult = await getGroupSettlements(groupId);

  return (
    <main className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <a href="/home" className="text-sm font-semibold text-(--primary)">
          ← Voltar para grupos
        </a>
        <p className="mt-2 text-(--dark-teal)">
          {group.members.length} participante(s)
        </p>
        <GroupDetails
          groupId={group.id}
          initialGroupName={group.name}
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
          initialTotalPages={Math.max(1, Math.ceil(group._count.expenses / 5))}
          initialBalances={
            balancesResult.success ? balancesResult.data : { balances: [] }
          }
          initialSettlements={
            settlementsResult.success
              ? settlementsResult.data
              : { settlements: [] }
          }
        />
      </div>
    </main>
  );
}
