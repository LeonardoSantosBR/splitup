"use client";

import { closeGroup } from "@/app/actions/groups";

export function GroupCloseButton({ groupId }: { groupId: string }) {
  function handleClose() {
    if (!window.confirm("Tem certeza que deseja fechar este grupo?")) return;
    void closeGroup(groupId).then(() => window.location.reload());
  }

  return (
    <div className="mt-10 flex justify-center border-(--slate)/20 pt-8">
      <button
        type="button"
        onClick={handleClose}
        className="rounded-lg border border-(--primary) px-5 py-2 text-sm font-semibold text-(--primary) transition hover:bg-(--primary) hover:text-white"
      >
        Fechar grupo
      </button>
    </div>
  );
}
