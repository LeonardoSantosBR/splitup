import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ExpenseForm } from "@/components/expenses/expense-form";
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
        <div className="mt-8 grid gap-6 lg:grid-cols-[360px_1fr]">
          <ExpenseForm
            groupId={group.id}
            members={group.members.map(({ user }) => ({
              id: user.id,
              name: user.name ?? user.email ?? "Membro",
            }))}
          />
          <section>
            <h2 className="text-xl font-bold text-foreground">
              Despesas recentes
            </h2>
            {group.expenses.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-dashed border-(--slate)/40 bg-white p-8 text-center text-sm text-(--dark-teal)">
                Nenhuma despesa registrada.
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {group.expenses.map((expense) => (
                  <article
                    key={expense.id}
                    className="rounded-2xl bg-white p-5 shadow-sm"
                  >
                    <div className="flex justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-foreground">
                          {expense.description}
                        </h3>
                        <p className="mt-1 text-sm text-(--dark-teal)">
                          Pago por {expense.payer.name ?? expense.payer.email}
                        </p>
                      </div>
                      <strong className="text-(--primary)">
                        {(expense.amountCents / 100).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </strong>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
