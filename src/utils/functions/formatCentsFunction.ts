export function formatCents(amountCents: number): string {
  return (amountCents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
