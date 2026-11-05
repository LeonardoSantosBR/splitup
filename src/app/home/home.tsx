"use client";

import { signOut } from "next-auth/react";
import { useState, useTransition } from "react";
import { createGroup, joinGroup } from "@/app/actions/groups";
import {
  FeedbackMessage,
  GroupActionCards,
  GroupList,
  GroupHeader,
} from "@/components/group";
import type { GroupDashboardProps } from "@/types";
import { clearMessages, copyInvite } from "@/utils/functions";

export function Home({ initialGroups, userName }: GroupDashboardProps) {
  const [groups, setGroups] = useState(initialGroups);
  const [groupName, setGroupName] = useState("");
  const [inviteToken, setInviteToken] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearMessages(setFeedback, setError);
    startTransition(async () => {
      const result = await createGroup({ name: groupName });
      if (!result.success) {
        setError(
          result.fieldErrors?.name?.[0] ??
            result.formError ??
            "Não foi possível criar o grupo."
        );
        return;
      }
      setGroups((current) => [result.data, ...current]);
      setGroupName("");
      setFeedback(`Grupo “${result.data.name}” criado.`);
    });
  }

  function handleJoin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearMessages(setFeedback, setError);
    startTransition(async () => {
      const result = await joinGroup({ inviteToken });
      if (!result.success) {
        setError(
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
      setFeedback(`Você entrou em “${result.data.name}”.`);
    });
  }

  return (
    <main className="min-h-screen bg-background">
      <GroupHeader
        userName={userName}
        onSignOut={() => signOut({ callbackUrl: "/login" })}
      />
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-(--primary)">
            Seu espaço
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Seus grupos
          </h1>
          <p className="mt-2 text-(--dark-teal)">
            Crie um grupo para começar a dividir despesas.
          </p>
        </div>
        <FeedbackMessage feedback={feedback} error={error} />
        <GroupActionCards
          groupName={groupName}
          inviteToken={inviteToken}
          isPending={isPending}
          onGroupNameChange={setGroupName}
          onInviteTokenChange={setInviteToken}
          onCreate={handleCreate}
          onJoin={handleJoin}
        />
        <GroupList
          groups={groups}
          onCopyInvite={(group) => copyInvite(setError, setFeedback, group)}
        />
      </div>
    </main>
  );
}
