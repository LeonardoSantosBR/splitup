"use client";

import Avatar from "@mui/material/Avatar";
import type { HeaderProps } from "@/types";

export function Header({
  userName,
  userImage,
  onSignOut,
  onViewProfile,
}: HeaderProps) {
  return (
    <header className="border-b border-(--slate)/20 bg-white">
      <div className="mx-auto flex min-h-16 w-full min-w-0 max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:min-h-18 sm:px-6 sm:py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--primary) font-black text-white">
            S
          </span>
          <span className="font-bold text-foreground">SplitUp</span>
        </div>
        <div className="flex min-w-0 items-center gap-2 sm:gap-5">
          <div
            onClick={onViewProfile}
            className="cursor-pointer flex min-w-0 items-center gap-2 sm:gap-3"
          >
            <span className="hidden text-sm font-medium text-(--dark-teal) sm:inline">
              Olá, <span className="hover:underline">{userName}</span>
            </span>
            <button
              type="button"
              aria-label="Abrir perfil"
              className="cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-(--primary) focus:ring-offset-2"
            >
              <Avatar
                sx={{ width: 36, height: 36 }}
                alt={userName || "Avatar do usuário"}
                src={userImage ?? undefined}
                slotProps={{ img: { referrerPolicy: "no-referrer" } }}
              />
            </button>
          </div>
          <button
            type="button"
            onClick={onSignOut}
            className="rounded-lg px-2 py-1.5 text-sm font-semibold text-(--dark-teal) transition hover:bg-(--primary)/10 hover:text-(--primary)"
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}
