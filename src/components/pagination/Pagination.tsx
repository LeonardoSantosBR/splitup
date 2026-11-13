type PaginationProps = {
  page: number;
  totalPages: number;
  isPending: boolean;
  onPageChange: (page: number) => void;
};

export function Pagination({
  page,
  totalPages,
  isPending,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
      <button
        type="button"
        disabled={page === 1 || isPending}
        onClick={() => onPageChange(page - 1)}
        className="rounded-lg border border-(--slate)/30 bg-white px-3 py-2 text-sm font-semibold text-foreground disabled:opacity-40"
      >
        Anterior
      </button>
      <span className="text-sm text-(--dark-teal)">
        Página {page} de {totalPages}
      </span>
      <button
        type="button"
        disabled={page === totalPages || isPending}
        onClick={() => onPageChange(page + 1)}
        className="rounded-lg border border-(--slate)/30 bg-white px-3 py-2 text-sm font-semibold text-foreground disabled:opacity-40"
      >
        Próxima
      </button>
    </div>
  );
}
