"use client";

import { useState, useTransition } from "react";
import type { GroupExpensesProps } from "@/types";
import { GroupExpenseForm } from "./groupExpenseForm";
import { changePage } from "@/utils/functions/changePageFunction";

export function GroupExpenses({
  groupId,
  members,
  initialExpenses,
  initialTotalPages,
  onExpenseCreated,
}: GroupExpensesProps) {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[360px_1fr]">
      <GroupExpenseForm
        groupId={groupId}
        members={members}
        onCreated={(expense) => {
          setExpenses((current) => [expense, ...current].slice(0, 5));
          setPage(1);
          onExpenseCreated?.();
        }}
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
        {totalPages > 1 && (
          <div className="mt-5 flex items-center justify-between">
            <button
              type="button"
              disabled={page === 1 || isPending}
              onClick={() =>
                changePage(
                  startTransition,
                  groupId,
                  setExpenses,
                  setPage,
                  setTotalPages,
                  page - 1
                )
              }
              className="rounded-lg border border-(--slate)/30 bg-white px-3 py-2 text-sm font-semibold text-foreground disabled:opacity-40"
            >
              Anterior
            </button>
            <span className="text-sm text-(--dark-teal)">
              Página {page} de {totalPages}
            </span>
            <button
              type="button"
              disabled={page === totalPages || isPending}
              onClick={() =>
                changePage(
                  startTransition,
                  groupId,
                  setExpenses,
                  setPage,
                  setTotalPages,
                  page + 1
                )
              }
              className="rounded-lg border border-(--slate)/30 bg-white px-3 py-2 text-sm font-semibold text-foreground disabled:opacity-40"
            >
              Próxima
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
