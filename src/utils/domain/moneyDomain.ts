export type Cents = number & { readonly __brand: "Cents" };

export function cents(value: number): Cents {
  if (!Number.isSafeInteger(value))
    throw new Error("Money must be a safe integer number of cents");

  return value as Cents;
}

export function assertNonNegativeCents(value: Cents): void {
  if (value < 0) throw new Error("Money cannot be negative");
}
