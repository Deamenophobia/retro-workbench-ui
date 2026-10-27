function integer(value: number, fallback: number) {
  return Number.isFinite(value) ? Math.trunc(value) : fallback;
}

/** One-based pages; indexes are suitable for slice(startIndex, endIndex). */
export function getPagination(totalItems: number, requestedPage: number, requestedSize: number) {
  const total = Math.max(0, integer(totalItems, 0));
  const pageSize = Math.max(1, integer(requestedSize, 1));
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(pageCount, Math.max(1, integer(requestedPage, 1)));
  const startIndex = (page - 1) * pageSize;
  return {
    total,
    pageSize,
    pageCount,
    page,
    startIndex,
    endIndex: Math.min(total, startIndex + pageSize),
  };
}

/** Bounded output even when the data source has millions of pages. */
export function pageNumbers(page: number, pageCount: number): (number | "gap-start" | "gap-end")[] {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, index) => index + 1);
  if (page <= 4) return [1, 2, 3, 4, 5, "gap-end", pageCount];
  if (page >= pageCount - 3)
    return [1, "gap-start", pageCount - 4, pageCount - 3, pageCount - 2, pageCount - 1, pageCount];
  return [1, "gap-start", page - 1, page, page + 1, "gap-end", pageCount];
}
