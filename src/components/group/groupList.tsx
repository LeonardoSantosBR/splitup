"use client";

import { Pagination } from "@/components/group/pagination";
import type { GroupListProps } from "@/types";
import { GroupCards } from "./groupCards";
import { GroupEmptyState } from "./groupEmptyState";
import { GroupInfoTooltip } from "./groupInfoTooltip";

export function GroupList({
  groups,
  onCopyInvite,
  page,
  totalPages,
  isPending,
  onPageChange,
}: GroupListProps) {
  return (
    <section className="mt-10">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-bold text-foreground">
          Grupos dos quais você participa
        </h2>
        <GroupInfoTooltip />
      </div>
      {groups.length === 0 ? (
        <GroupEmptyState />
      ) : (
        <GroupCards groups={groups} onCopyInvite={onCopyInvite} />
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
