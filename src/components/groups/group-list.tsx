"use client";

import Link from "next/link";
import { GroupListProps } from "@/types";

export function GroupList({ groups, onCopyInvite }: GroupListProps) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold text-foreground">
        Grupos dos quais você participa
      </h2>
      {groups.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-(--slate)/40 bg-white p-10 text-center">
          <p className="font-semibold text-foreground">Ainda não há grupos</p>
          <p className="mt-2 text-sm text-(--dark-teal)">
            Crie um grupo ou use um convite para começar.
          </p>
        </div>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <article
              key={group.id}
              className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-(--slate)/15"
            >
              <div className="flex items-start justify-between gap-3">
                <Link
                  href={`/groups/${group.id}`}
                  className="font-bold text-foreground hover:text-(--primary)"
                >
                  {group.name}
                </Link>
                <span className="h-3 w-3 rounded-full bg-(--primary)" />
              </div>
              <Link
                href={`/groups/${group.id}`}
                className="mt-3 block text-xs text-(--slate)"
              >
                Criado em{" "}
                {new Intl.DateTimeFormat("pt-BR").format(
                  new Date(group.createdAt)
                )}
              </Link>
              <button
                type="button"
                onClick={() => onCopyInvite(group)}
                className="mt-5 w-full rounded-lg bg-(--teal)/20 px-3 py-2 text-sm font-semibold text-foreground hover:bg-(--teal)/35"
              >
                Copiar convite
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
