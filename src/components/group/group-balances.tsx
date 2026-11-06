import type { GroupBalancesProps } from "@/types";
import { formatCents } from "@/utils/functions/format-cents-function";

export function GroupBalances({ balances }: GroupBalancesProps) {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold text-foreground">Saldos atuais</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {balances.map((balance) => (
          <article
            key={balance.memberId}
            className="rounded-2xl bg-white p-5 shadow-sm"
          >
            <p className="font-semibold text-foreground">
              {balance.memberName}
            </p>
            <p
              className={`mt-2 text-lg font-bold ${
                balance.amountCents >= 0
                  ? "text-(--dark-teal)"
                  : "text-(--primary)"
              }`}
            >
              {balance.amountCents >= 0 ? "Recebe " : "Deve "}
              {formatCents(Math.abs(balance.amountCents))}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
