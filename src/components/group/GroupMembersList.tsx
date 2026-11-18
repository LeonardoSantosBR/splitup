"use client";

import { useState } from "react";
import type { Member } from "@/types/group/groupExpensesFormProps";

export function GroupMembersList({ members }: { members: Member[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        className="rounded-lg border border-(--slate)/30 bg-white px-3 py-2 text-sm font-semibold text-foreground transition hover:border-(--primary) hover:text-(--primary)"
      >
        Participantes ({members.length})
      </button>
      {isOpen && (
        <div className="absolute right-0 z-20 mt-2 w-64 max-w-[calc(100vw-2rem)] rounded-xl bg-white p-3 shadow-lg ring-1 ring-(--slate)/20">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-(--dark-teal)">
            Usuários do grupo
          </p>
          <ul className="space-y-2">
            {members.map((member) => (
              <li key={member.id} className="truncate text-sm text-foreground">
                {member.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
