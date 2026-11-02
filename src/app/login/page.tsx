import { signIn } from "@/auth";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-12">
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-(--teal)/30 blur-3xl" />
      <div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-(--mauve)/30 blur-3xl" />
      <section className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-[0_24px_80px_rgba(36,48,47,0.14)] md:grid-cols-[1.05fr_0.95fr]">
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
              Organize os gastos do grupo, acompanhe os saldos e descubra a
              forma mais simples de acertar as contas.
            </p>
          </div>
          <div className="flex gap-2 pt-12" aria-hidden="true">
            <span className="h-2 w-16 rounded-full bg-(--primary)" />
            <span className="h-2 w-8 rounded-full bg-(--teal)" />
            <span className="h-2 w-8 rounded-full bg-(--mauve)" />
          </div>
        </div>
        <div className="flex min-h-140 flex-col justify-center p-8 sm:p-12">
          <div className="mx-auto w-full max-w-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-(--primary)">
              Bem-vindo
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground">
              Entre no SplitUp
            </h2>
            <p className="mt-4 leading-7 text-(--dark-teal)">
              Entre com sua conta Google para começar a organizar seus grupos.
            </p>
            <form
              className="mt-10"
              action={async () => {
                "use server";
                await signIn("google", { redirectTo: "/groups" });
              }}
            >
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-(--slate)/35
                 bg-white px-5 py-3.5 font-semibold text-foreground shadow-sm transition hover:border-(--primary) 
                   hover:shadow-md focus:outline-none focus:ring-4 focus:ring-(--primary)/20"
              >
                <FcGoogle size={25} />
                Continuar com Google
              </button>
            </form>
            <p className="mt-8 text-center text-xs leading-5 text-(--slate)">
              Ao continuar, você concorda com o uso do SplitUp para organizar
              suas despesas em grupo.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
