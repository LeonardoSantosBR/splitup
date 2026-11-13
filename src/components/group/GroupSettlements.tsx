"use client";

import { useEffect, useState, useTransition } from "react";
import {
  createSettlement,
  getGroupSettlements,
} from "@/app/actions/settlements";
import type { GroupSettlementsProps } from "@/types";
import { formatCents } from "@/utils/functions/formatCentsFunction";

export function GroupSettlements({
  groupId,
  settlements: initialSettlements,
  onSettled,
}: GroupSettlementsProps & { groupId: string; onSettled?: () => void }) {
  const [settlements, setSettlements] = useState(initialSettlements);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setSettlements(initialSettlements);
  }, [initialSettlements]);

  function settle(settlement: (typeof settlements)[number]) {
    startTransition(async () => {
      const result = await createSettlement({
        groupId,
        ...settlement,
        amountCents: settlement.amountCents,
      });
      if (result.success) {
        const updated = await getGroupSettlements(groupId);
        if (updated.success) setSettlements(updated.data.settlements);
        onSettled?.();
      }
    });
  }

  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold text-foreground">Acerto financeiro</h2>
      {settlements.length === 0 ? (
        <p className="mt-3 text-sm text-(--dark-teal)">
          Tudo certo! Não há pagamentos pendentes.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {settlements.map((settlement) => (
            <article
              key={`${settlement.fromMemberId}-${settlement.toMemberId}`}
              className="flex items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm"
            >
              <p className="text-sm text-foreground">
                <strong>{settlement.fromMemberName}</strong> deve pagar{" "}
                <strong>{settlement.toMemberName}</strong>
                <span className="block text-lg font-bold text-(--primary)">
                  {formatCents(settlement.amountCents)}
                </span>
              </p>
              <button
                type="button"
                disabled={isPending}
                onClick={() => settle(settlement)}
                className="rounded-lg bg-(--primary) px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                Registrar pagamento
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
