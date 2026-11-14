"use client";

import type { HomeGroupListProps } from "@/types/home";
import { Pagination } from "../pagination";
import { HomeGroupCards } from "./HomeGroupCards";
import { HomeGroupEmptyState } from "./HomeGroupEmptyState";
import { HomeGroupInfoTooltip } from "./HomeGroupInfoTooltip";

export function HomeGroupList({
  groups,
  onCopyInvite,
  page,
  totalPages,
  isPending,
  onChangePage,
}: HomeGroupListProps) {
  return (
    <section className="mt-10">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-bold text-foreground">
          Grupos dos quais você participa
        </h2>
        <HomeGroupInfoTooltip />
      </div>
      {groups.length === 0 ? (
        <HomeGroupEmptyState />
      ) : (
        <HomeGroupCards groups={groups} onCopyInvite={onCopyInvite} />
      )}
      <Pagination
        page={page}
        totalPages={totalPages}
        isPending={isPending}
        onChangePage={onChangePage}
      />
    </section>
  );
}
