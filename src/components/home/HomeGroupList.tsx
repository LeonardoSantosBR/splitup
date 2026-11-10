"use client";

import type { HomeGroupListProps } from "@/types/home";
import { Pagination } from "../pagination";
import { HomeGroupEmptyState } from "./HomeGroupEmptyState";
import { HomeGroupCards } from "./HomeGroupCards";
import { HomeGroupInfoTooltip } from "./HomeGroupInfoTooltip";

export function HomeGroupList({
  groups,
  onCopyInvite,
  page,
  totalPages,
  isPending,
  onPageChange,
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
        onPageChange={onPageChange}
      />
    </section>
  );
}
