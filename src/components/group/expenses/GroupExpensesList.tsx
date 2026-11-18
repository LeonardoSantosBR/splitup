"use client";

import { useState, useTransition } from "react";
import { motion } from "motion/react";
import { deleteExpense, listGroupExpenses } from "@/app/actions/expenses";
import { showDeleteExpenseConfirmation } from "@/components/alerts";
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
  onExpenseDeleted,
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

  async function removeExpense(expense: (typeof expenses)[number]) {
    if (!(await showDeleteExpenseConfirmation(expense.description))) return;
    startTransition(async () => {
      const result = await deleteExpense(groupId, expense.id);
      if (!result.success) return;
      const updated = await listGroupExpenses(groupId, page);
      if (updated.success) {
        setExpenses(updated.data.items);
        setPage(Math.min(page, updated.data.totalPages));
        setTotalPages(updated.data.totalPages);
      }
      onExpenseDeleted?.();
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
              <motion.article
                key={expense.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
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
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <strong className="text-(--primary)">
                      {formatCents(expense.amountCents)}
                    </strong>
                    <button
                      type="button"
                      onClick={() => void removeExpense(expense)}
                      disabled={isPending}
                      className="text-xs font-semibold text-(--slate) hover:text-(--primary) disabled:opacity-50"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </motion.article>
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
