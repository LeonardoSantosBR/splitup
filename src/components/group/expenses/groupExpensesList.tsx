"use client";

import { useState, useTransition } from "react";
import { listGroupExpenses } from "@/app/actions/expenses";
import { Pagination } from "@/components/pagination";
import type { GroupExpensesProps } from "@/types";
import { formatCents } from "@/utils/functions/formatCentsFunction";
import { GroupExpensesForm } from "./GroupExpensesForm";

export function GroupExpensesList({
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

  function changePage(nextPage: number) {
    startTransition(async () => {
      const result = await listGroupExpenses(groupId, nextPage);
      if (!result.success) return;
      setExpenses(result.data.items);
      setPage(result.data.page);
      setTotalPages(result.data.totalPages);
    });
  }

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[360px_1fr]">
      <GroupExpensesForm
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
                    {formatCents(expense.amountCents)}
                  </strong>
                </div>
              </article>
            ))}
          </div>
        )}
        {totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            isPending={isPending}
            onPageChange={changePage}
          />
        )}
      </section>
    </div>
  );
}
