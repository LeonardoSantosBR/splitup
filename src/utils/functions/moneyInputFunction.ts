import { cents } from "@/utils/domain/moneyDomain";

export function parseAmountToCents(value: string): ReturnType<typeof cents> {
  const normalized = value.trim().replace(/\./g, "").replace(",", ".");
  const amount = Number(normalized);
  if (
    !Number.isFinite(amount) ||
    amount <= 0 ||
    !/^\d+(,\d{1,2}|\.\d{1,2})?$/.test(value.trim())
  ) {
    throw new Error("Informe um valor monetário válido.");
  }
  return cents(Math.round(amount * 100));
}
