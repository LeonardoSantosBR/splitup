import Link from "next/link";
import type { HomeGroupProps } from "@/types/home";
import { HomeMembersImage } from "./HomeMembersImage";

export function HomeGroupCards({
  groups,
  onCopyInvite,
}: {
  groups: HomeGroupProps[];
  onCopyInvite: (group: HomeGroupProps) => void;
}) {
  return (
    <div className="mt-4 grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {groups.map((group) => (
        <article
          key={group.id}
          className="flex h-full min-w-0 min-h-28 flex-col rounded-2xl bg-white p-4 shadow-sm ring-1 ring-(--slate)/15 sm:p-5"
        >
          <div className="flex min-h-10 items-start justify-between gap-3">
            <Link
              href={`/home/${group.id}`}
              title={group.name}
              className="min-w-0 flex-1 truncate font-bold text-foreground hover:text-(--primary)"
            >
              {group.name}
            </Link>
            <HomeMembersImage
              groupId={group.id}
              membersImages={group.membersImages}
            />
          </div>
          <Link
            href={`/home/${group.id}`}
            className="block text-xs text-(--slate)"
          >
            Criado em{" "}
            {new Intl.DateTimeFormat("pt-BR").format(new Date(group.createdAt))}
          </Link>
          <button
            type="button"
            onClick={() => onCopyInvite(group)}
            className="mt-4 w-full rounded-lg bg-(--teal)/20 px-3 py-2 text-sm font-semibold text-foreground hover:bg-(--teal)/35"
          >
            Copiar convite
          </button>
        </article>
      ))}
    </div>
  );
}
