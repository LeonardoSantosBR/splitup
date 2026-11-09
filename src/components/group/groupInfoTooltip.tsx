"use client";

import { useState } from "react";
import { IoInformationCircleOutline } from "react-icons/io5";

export function GroupInfoTooltip() {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="relative flex items-center gap-2">
      <button
        type="button"
        onClick={() => setShowInfo((current) => !current)}
        aria-label="Informações sobre grupos finalizados"
        aria-expanded={showInfo}
        className="text-(--dark-teal) transition hover:text-(--primary)"
      >
        <IoInformationCircleOutline size={25} />
      </button>
      <p
        className={`absolute left-full top-1/2 z-10 ml-2 w-max max-w-xs -translate-y-1/2 rounded-lg bg-(--dark-teal) px-3 py-2 text-xs text-white shadow-lg transition-opacity duration-500 ${showInfo ? "visible opacity-100" : "invisible opacity-0"}`}
        aria-hidden={!showInfo}
      >
        Grupos finalizados continuam aparecendo nesta lista pelos próximos 30
        dias.
      </p>
    </div>
  );
}
