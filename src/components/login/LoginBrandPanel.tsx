export function LoginBrandPanel() {
  return (
    <div className="flex min-h-140 flex-col justify-between bg-(--dark-teal) p-8 text-white sm:p-12">
      <div>
        <div className="mb-16 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--primary) text-lg font-black">
            S
          </span>
          <span className="text-xl font-bold tracking-tight">SplitUp</span>
        </div>
        <p className="mb-5 max-w-sm text-sm font-semibold uppercase tracking-[0.22em] text-white/65">
          Despesas sem complicação
        </p>
        <h1 className="max-w-md text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          Divida momentos, não a amizade.
        </h1>
        <p className="mt-6 max-w-md text-base leading-7 text-white/75">
          Organize os gastos do grupo, acompanhe os saldos e descubra a forma
          mais simples de acertar as contas.
        </p>
      </div>
      <div className="flex gap-2 pt-12" aria-hidden="true">
        <span className="h-2 w-16 rounded-full bg-(--primary)" />
        <span className="h-2 w-8 rounded-full bg-(--teal)" />
        <span className="h-2 w-8 rounded-full bg-(--mauve)" />
      </div>
    </div>
  );
}
