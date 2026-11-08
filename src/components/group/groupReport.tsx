"use client";

import { useState, useTransition } from "react";
import { getGroupReportPdf } from "@/app/actions/reports";

export function GroupReport({ groupId }: { groupId: string }) {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function download() {
    startTransition(async () => {
      const result = await getGroupReportPdf(groupId);
      if (!result.success) {
        setMessage(result.formError ?? "Não foi possível gerar o relatório.");
        return;
      }
      const binary = atob(result.data.contentBase64);
      const bytes = Uint8Array.from(binary, (character) =>
        character.charCodeAt(0),
      );
      const blob = new Blob([bytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = result.data.fileName;
      link.click();
      URL.revokeObjectURL(url);
      setMessage("Relatório baixado.");
    });
  }

  return (
    <section className="mt-8 rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            Relatório do grupo
          </h2>
          <p className="mt-1 text-sm text-(--dark-teal)">
            Exporte as despesas e os acertos registrados.
          </p>
        </div>
        <button
          type="button"
          onClick={download}
          disabled={isPending}
          className="rounded-lg bg-(--primary) px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {isPending ? "Gerando..." : "Baixar PDF"}
        </button>
      </div>
      {message && <p className="mt-3 text-sm text-(--dark-teal)">{message}</p>}
    </section>
  );
}
