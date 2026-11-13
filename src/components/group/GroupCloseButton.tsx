"use client";

import { useRouter } from "next/navigation";
import { closeGroup } from "@/app/actions/groups";
import { showCloseGroupConfirmation } from "@/components/alerts";

export function GroupCloseButton({ groupId }: { groupId: string }) {
  const router = useRouter();

  async function handleClose() {
    const confirmed = await showCloseGroupConfirmation();
    if (!confirmed) return;
    const result = await closeGroup(groupId);
    if (result.success) router.refresh();
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
