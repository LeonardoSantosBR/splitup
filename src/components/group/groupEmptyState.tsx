export function GroupEmptyState() {
  return (
    <div className="mt-4 rounded-2xl border border-dashed border-(--slate)/40 bg-white p-10 text-center">
      <p className="font-semibold text-foreground">Ainda não há grupos</p>
      <p className="mt-2 text-sm text-(--dark-teal)">
        Crie um grupo ou use um convite para começar.
      </p>
    </div>
  );
}
