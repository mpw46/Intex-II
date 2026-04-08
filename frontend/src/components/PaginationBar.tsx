interface Props {
  page: number;
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
}

export default function PaginationBar({ page, pageSize, total, onChange }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-stone-200 bg-stone-50 text-sm text-stone-500">
      <span>Showing {from}–{to} of {total}</span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page <= 1}
          className="px-3 py-1.5 rounded-lg border border-stone-200 text-stone-600
            hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >← Prev</button>
        <span className="text-xs font-medium">{page} / {totalPages}</span>
        <button
          onClick={() => onChange(page + 1)}
          disabled={page >= totalPages}
          className="px-3 py-1.5 rounded-lg border border-stone-200 text-stone-600
            hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >Next →</button>
      </div>
    </div>
  );
}
