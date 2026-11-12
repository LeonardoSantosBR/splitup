"use client";

import { signOut } from "next-auth/react";
import { useState, useTransition } from "react";
import { toast } from "react-toastify";
import { createGroup, joinGroup, listUserGroups } from "@/app/actions/groups";
import { HomeGroupCreateOrJoin, HomeGroupList } from "@/components/group";
import { Header } from "@/components/header";
import { HomeTitle } from "@/components/home";
import type { HomeProps } from "@/types";

export function Home({
  initialGroups,
  userName,
  userImage,
  initialPage,
  initialTotalPages,
}: HomeProps) {
  const [groups, setGroups] = useState(initialGroups);
  const [groupName, setGroupName] = useState("");
  const [inviteToken, setInviteToken] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isPagePending, startPageTransition] = useTransition();
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);

  function handleCreate(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => {
      const result = await createGroup({ name: groupName });
      if (!result.success) {
        toast.error(
          result.fieldErrors?.name?.[0] ??
            result.formError ??
            "Não foi possível criar o grupo."
        );
        return;
      }
      console.log(result);
      setGroups((current) => [result.data, ...current]);
      setGroupName("");
      toast.success(`Grupo “${result.data.name}” criado.`);
    });
  }

  function handleJoin(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => {
      const result = await joinGroup({ inviteToken });
      if (!result.success) {
        toast.error(
          result.fieldErrors?.inviteToken?.[0] ??
            result.formError ??
            "Não foi possível entrar no grupo."
        );
        return;
      }
      setGroups((current) =>
        current.some((group) => group.id === result.data.id)
          ? current
          : [result.data, ...current]
      );
      setInviteToken("");
      toast.success(`Você entrou em “${result.data.name}”.`);
    });
  }

  async function copyInvite(group: (typeof groups)[number]) {
    try {
      await navigator.clipboard.writeText(group.inviteToken);
      toast.success("Link de convite copiado.");
    } catch {
      toast.error("Não foi possível copiar o convite.");
    }
  }

  function changePage(nextPage: number) {
    startPageTransition(async () => {
      const result = await listUserGroups(nextPage);
      if (result.success) {
        setGroups(result.data.items);
        setPage(result.data.page);
        setTotalPages(result.data.totalPages);
      }
    });
  }

  return (
    <main className="min-h-screen bg-background">
      <Header
        userName={userName}
        userImage={userImage}
        onSignOut={() => signOut({ callbackUrl: "/login" })}
      />
      <div className="mx-auto max-w-6xl px-6 py-10">
        <HomeTitle />
        <HomeGroupCreateOrJoin
          groupName={groupName}
          inviteToken={inviteToken}
          isPending={isPending}
          onGroupNameChange={setGroupName}
          onInviteTokenChange={setInviteToken}
          onCreate={handleCreate}
          onJoin={handleJoin}
        />
        <HomeGroupList
          groups={groups}
          onCopyInvite={copyInvite}
          page={page}
          totalPages={totalPages}
          isPending={isPagePending}
          onPageChange={changePage}
        />
      </div>
    </main>
  );
}
