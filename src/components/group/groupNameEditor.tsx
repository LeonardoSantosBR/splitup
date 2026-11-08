"use client";

import { useState, useTransition } from "react";
import { updateGroupName } from "@/app/actions/groups";
import { MdOutlineEdit } from "react-icons/md";

export function GroupNameEditor({
  groupId,
  initialName,
}: {
  groupId: string;
  initialName: string;
}) {
  const [name, setName] = useState(initialName);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function save() {
    startTransition(async () => {
      const result = await updateGroupName({ groupId, name });
      if (!result.success) {
        setError(
          result.fieldErrors?.name?.[0] ??
            result.formError ??
            "Não foi possível atualizar o nome."
        );
        return;
      }
      setName(result.data.name);
      setError("");
      setEditing(false);
    });
  }

  return (
    <section className="mt-5">
      {editing ? (
        <div className="flex flex-wrap items-center gap-3">
          <input
            aria-label="Nome do grupo"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-(--slate)/30 bg-white px-3 py-2 text-2xl font-bold text-foreground"
          />
          <button
            type="button"
            disabled={isPending}
            onClick={save}
            className="rounded-lg bg-(--primary) px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            Salvar
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => {
              setName(initialName);
              setError("");
              setEditing(false);
            }}
            className="rounded-lg border border-(--slate)/30 px-3 py-2 text-sm font-semibold text-foreground"
          >
            Cancelar
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-bold text-foreground">{name}</h1>
          <MdOutlineEdit size={25} onClick={() => setEditing(true)} />
        </div>
      )}
      {error && <p className="mt-2 text-sm text-(--primary)">{error}</p>}
    </section>
  );
}
