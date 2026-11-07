import { FcGoogle } from "react-icons/fc";
import type { LoginFormProps } from "@/types";

export function LoginForm({ signInAction }: LoginFormProps) {
  return (
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
        <form className="mt-10" action={signInAction}>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-(--slate)/35 bg-white px-5 py-3.5 font-semibold text-foreground shadow-sm transition hover:border-(--primary) hover:shadow-md focus:outline-none focus:ring-4 focus:ring-(--primary)/20"
          >
            <FcGoogle size={25} />
            Continuar com Google
          </button>
        </form>
        <p className="mt-8 text-center text-xs leading-5 text-(--slate)">
          Ao continuar, você concorda com o uso do SplitUp para organizar suas
          despesas em grupo.
        </p>
      </div>
    </div>
  );
}
