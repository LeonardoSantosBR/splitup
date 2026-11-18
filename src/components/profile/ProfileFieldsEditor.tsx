"use client";

import Avatar from "@mui/material/Avatar";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { IoArrowBack } from "react-icons/io5";
import { toast } from "react-toastify";
import { updateUserProfile } from "@/app/actions/profile";
import { UserProfileProps } from "@/types";

export function ProfileFieldsEditor({
  profile,
}: {
  profile: UserProfileProps;
}) {
  const router = useRouter();
  const [name, setName] = useState(profile.name);
  const [isPending, startTransition] = useTransition();

  function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => {
      const result = await updateUserProfile({ name });
      if (!result.success) {
        toast.error(result.fieldErrors?.name?.[0] ?? result.formError);
        return;
      }
      setName(result.data.name);
      toast.success("Perfil atualizado.");
      router.back();
    });
  }

  return (
    <form
      onSubmit={saveProfile}
      className="mx-auto mt-8 max-w-xl rounded-2xl bg-white p-6 shadow-sm"
    >
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-(--primary) transition hover:opacity-75"
      >
        <IoArrowBack aria-hidden="true" />
        Voltar
      </button>
      <div className="flex items-center gap-4">
        <Avatar
          src={profile.image ?? undefined}
          alt={name}
          sx={{ width: 64, height: 64 }}
        />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Minha conta</h1>
          <p className="text-sm text-(--dark-teal)">
            Edite suas informações pessoais.
          </p>
        </div>
      </div>
      <label
        htmlFor="profile-name"
        className="mt-6 block text-sm font-semibold"
      >
        Nome
      </label>
      <input
        id="profile-name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        disabled={isPending}
        className="mt-2 w-full rounded-xl border border-(--slate)/35 px-4 py-3 outline-none focus:border-(--primary)"
      />
      <label
        htmlFor="profile-email"
        className="mt-4 block text-sm font-semibold"
      >
        E-mail
      </label>
      <input
        id="profile-email"
        value={profile.email}
        disabled
        className="mt-2 w-full rounded-xl border border-(--slate)/20 bg-background px-4 py-3 text-(--slate)"
      />
      <button
        type="submit"
        disabled={isPending}
        className="mt-6 w-full rounded-xl bg-(--primary) px-4 py-3 font-bold text-white disabled:opacity-60"
      >
        {isPending ? "Salvando..." : "Salvar alterações"}
      </button>
    </form>
  );
}
