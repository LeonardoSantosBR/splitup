"use client";

type GroupsHeaderProps = { userName: string; onSignOut: () => void };

export function GroupsHeader({ userName, onSignOut }: GroupsHeaderProps) {
  return (
    <header className="border-b border-(--slate)/20 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--primary) font-black text-white">
            S
          </span>
          <span className="font-bold text-foreground">SplitUp</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-(--dark-teal) sm:inline">
            Olá, {userName}
          </span>
          <button
            type="button"
            onClick={onSignOut}
            className="text-sm font-semibold text-(--dark-teal) hover:text-(--primary)"
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}
