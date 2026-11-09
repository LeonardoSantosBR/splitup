"use client";

import Link from "next/link";
import { useState } from "react";
import { IoInformationCircleOutline } from "react-icons/io5";
import { Pagination } from "@/components/group/pagination";
import type { GroupListProps } from "@/types";

export function GroupList({
  groups,
  onCopyInvite,
  page,
  totalPages,
  isPending,
  onPageChange,
}: GroupListProps) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <section className="mt-10">
      <div className="relative flex items-center gap-2">
        <h2 className="text-xl font-bold text-foreground">
          Grupos dos quais você participa
        </h2>
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
          className={`mt-10 z-10 ml-2 w-max max-w-xs -translate-y-1/2 rounded-lg bg-(--dark-teal) px-3 py-2 text-xs text-white shadow-lg transition-opacity duration-500 ${
            showInfo ? "visible opacity-100" : "invisible opacity-0"
          }`}
          aria-hidden={!showInfo}
        >
          Grupos finalizados continuam aparecendo nesta lista pelos próximos 30
          dias.
        </p>
      </div>
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
                  href={`/home/${group.id}`}
                  className="font-bold text-foreground hover:text-(--primary)"
                >
                  {group.name}
                </Link>
                <span className="h-3 w-3 rounded-full bg-(--primary)" />
              </div>
              <Link
                href={`/home/${group.id}`}
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
      <Pagination
        page={page}
        totalPages={totalPages}
        isPending={isPending}
        onPageChange={onPageChange}
      />
    </section>
  );
}
