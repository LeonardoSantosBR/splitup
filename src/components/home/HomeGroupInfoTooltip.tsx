"use client";

import { IoInformationCircleOutline } from "react-icons/io5";
import { ICON_SIZE } from "@/utils/constants";
import { toast } from "react-toastify";

export function HomeGroupInfoTooltip() {
  async function showGroupInfoToast() {
    try {
      toast.info(
        "Grupos finalizados continuam aparecendo nesta lista pelos próximos 30 dias."
      );
    } catch {
      toast.error("Não foi possível copiar o convite.");
    }
  }

  return (
    <div className="relative flex items-center gap-2">
      <button
        type="button"
        onClick={showGroupInfoToast}
        aria-label="Informações sobre grupos finalizados"
        className="text-(--dark-teal) transition hover:text-(--primary)"
      >
        <IoInformationCircleOutline size={ICON_SIZE} />
      </button>
    </div>
  );
}
