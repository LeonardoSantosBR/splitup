"use client";

import { useState, useTransition } from "react";
import { FaFileDownload } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";
import { updateGroupName } from "@/app/actions/groups";
import { getGroupReportPdf } from "@/app/actions/reports";

export function GroupNameEditor({
  groupId,
  initialName,
  isClosed,
}: {
  groupId: string;
  initialName: string;
  isClosed: boolean;
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

  function downloadReport() {
    startTransition(async () => {
      const result = await getGroupReportPdf(groupId);
      if (!result.success) {
        setError(result.formError ?? "Não foi possível gerar o relatório.");
        return;
      }
      const binary = atob(result.data.contentBase64);
      const bytes = Uint8Array.from(binary, (character) =>
        character.charCodeAt(0)
      );
      const url = URL.createObjectURL(
        new Blob([bytes], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = result.data.fileName;
      link.click();
      URL.revokeObjectURL(url);
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
          <button
            type="button"
            onClick={downloadReport}
            disabled={!isClosed || isPending}
            aria-label="Baixar relatório em PDF"
            title={
              isClosed
                ? "Baixar relatório em PDF"
                : "Encerre o grupo para baixar o relatório"
            }
            className={`transition ${
              isClosed ? "text-(--primary)" : "cursor-not-allowed text-gray-400"
            } disabled:opacity-100`}
          >
            <FaFileDownload size={25} />
          </button>
        </div>
      )}
      {error && <p className="mt-2 text-sm text-(--primary)">{error}</p>}
    </section>
  );
}
