"use client";

import type { GroupActionCardsProps } from "@/types";

export function GroupActionCards({
  groupName,
  inviteToken,
  isPending,
  onGroupNameChange,
  onInviteTokenChange,
  onCreate,
  onJoin,
}: GroupActionCardsProps) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <form
        onSubmit={onCreate}
        className="rounded-2xl bg-(--dark-teal) p-6 text-white shadow-sm"
      >
        <p className="text-sm font-semibold uppercase tracking-wider text-white/65">
          Novo grupo
        </p>
        <h2 className="mt-2 text-xl font-bold">Comece uma nova divisão</h2>
        <label
          htmlFor="group-name"
          className="mt-6 block text-sm font-medium text-white/80"
        >
          Nome do grupo
        </label>
        <input
          id="group-name"
          value={groupName}
          onChange={(event) => onGroupNameChange(event.target.value)}
          placeholder="Ex.: Viagem para Madrid"
          className="mt-2 w-full rounded-xl border-0 bg-white px-4 py-3 text-foreground outline-none placeholder:text-(--slate) focus:ring-4 focus:ring-(--primary)/30"
          disabled={isPending}
        />
        <button
          type="submit"
          disabled={isPending}
          className="mt-4 w-full rounded-xl bg-(--primary) px-4 py-3 font-bold text-white transition hover:brightness-95 disabled:opacity-60"
        >
          {isPending ? "Salvando..." : "Criar grupo"}
        </button>
      </form>
      <form
        onSubmit={onJoin}
        className="rounded-2xl border border-(--slate)/25 bg-white p-6 shadow-sm"
      >
        <p className="text-sm font-semibold uppercase tracking-wider text-(--primary)">
          Convite
        </p>
        <h2 className="mt-2 text-xl font-bold text-foreground">
          Entrar em um grupo
        </h2>
        <label
          htmlFor="invite-token"
          className="mt-6 block text-sm font-medium text-(--dark-teal)"
        >
          Código do convite
        </label>
        <input
          id="invite-token"
          value={inviteToken}
          onChange={(event) => onInviteTokenChange(event.target.value)}
          placeholder="Cole o código recebido"
          className="mt-2 w-full rounded-xl border border-(--slate)/35 bg-background px-4 py-3 text-foreground outline-none focus:border-(--primary) focus:ring-4 focus:ring-(--primary)/15"
          disabled={isPending}
        />
        <button
          type="submit"
          disabled={isPending}
          className="mt-4 w-full rounded-xl border-2 border-(--primary) px-4 py-3 font-bold text-(--primary) transition hover:bg-(--primary) hover:text-white disabled:opacity-60"
        >
          Entrar no grupo
        </button>
      </form>
    </div>
  );
}
