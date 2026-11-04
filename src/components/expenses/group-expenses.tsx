"use client";

import { useState } from "react";
import { ExpenseForm } from "@/components/expenses/expense-form";
import { GroupExpensesProps } from "@/types";

export function GroupExpenses({
  groupId,
  members,
  initialExpenses,
}: GroupExpensesProps) {
  const [expenses, setExpenses] = useState(initialExpenses);
  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[360px_1fr]">
      <ExpenseForm
        groupId={groupId}
        members={members}
        onCreated={(expense) =>
          setExpenses((current) => [expense, ...current].slice(0, 20))
        }
      />
      <section>
        <h2 className="text-xl font-bold text-foreground">Despesas recentes</h2>
        {expenses.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-(--slate)/40 bg-white p-8 text-center text-sm text-(--dark-teal)">
            Nenhuma despesa registrada.
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {expenses.map((expense) => (
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
                      Pago por {expense.payerName}
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
  );
}
