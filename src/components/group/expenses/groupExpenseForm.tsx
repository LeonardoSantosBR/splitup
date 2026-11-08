"use client";

import { useState, useTransition } from "react";
import { createExpense } from "@/app/actions/expenses";
import type { ExpenseFormProps } from "@/types/expenseFormProps";

export function GroupExpenseForm({
  groupId,
  members,
  onCreated,
}: ExpenseFormProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [payerId, setPayerId] = useState(members[0]?.id ?? "");
  const [participantIds, setParticipantIds] = useState(
    members.map((member) => member.id)
  );
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    startTransition(async () => {
      const result = await createExpense({
        groupId,
        description,
        amount,
        payerId,
        participantIds,
      });
      if (!result.success) {
        setMessage(
          result.formError ??
            result.fieldErrors?.description?.[0] ??
            "Revise os campos."
        );
        return;
      }
      setDescription("");
      setAmount("");
      setMessage("Despesa adicionada.");
      onCreated?.(result.data);
    });
  }

  function toggleParticipant(id: string) {
    setParticipantIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl bg-(--dark-teal) p-6 text-white"
    >
      <h2 className="text-xl font-bold">Nova despesa</h2>
      <label htmlFor="description" className="mt-5 block text-sm">
        Descrição
      </label>
      <input
        id="description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        className="mt-2 w-full rounded-xl bg-white px-3 py-2 text-foreground"
        placeholder="Ex.: Jantar"
        disabled={isPending}
      />
      <label htmlFor="amount" className="mt-4 block text-sm">
        Valor (R$)
      </label>
      <input
        id="amount"
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
        className="mt-2 w-full rounded-xl bg-white px-3 py-2 text-foreground"
        placeholder="0,00"
        inputMode="decimal"
        disabled={isPending}
      />
      <label htmlFor="payer" className="mt-4 block text-sm">
        Quem pagou?
      </label>
      <select
        id="payer"
        value={payerId}
        onChange={(event) => setPayerId(event.target.value)}
        className="mt-2 w-full rounded-xl bg-white px-3 py-2 text-foreground"
        disabled={isPending}
      >
        {members.map((member) => (
          <option key={member.id} value={member.id}>
            {member.name}
          </option>
        ))}
      </select>
      <fieldset className="mt-4">
        <legend className="text-sm">Dividir entre</legend>
        <div className="mt-2 space-y-2">
          {members.map((member) => (
            <label key={member.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={participantIds.includes(member.id)}
                onChange={() => toggleParticipant(member.id)}
                disabled={isPending}
              />
              {member.name}
            </label>
          ))}
        </div>
      </fieldset>
      {message && (
        <p
          role="alert"
          className="mt-4 rounded-lg bg-white/15 px-3 py-2 text-sm"
        >
          {message}
        </p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="mt-5 w-full rounded-xl bg-(--primary) px-4 py-3 font-bold disabled:opacity-60"
      >
        {isPending ? "Salvando..." : "Adicionar despesa"}
      </button>
    </form>
  );
}
