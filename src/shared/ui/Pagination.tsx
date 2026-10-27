import { Button } from "./Button";
import { getPagination, pageNumbers } from "./paginationModel";

export type PaginationProps = {
  label: string;
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
  pageSizeControl?: { options: readonly number[]; onChange: (size: number) => void };
};

export function Pagination({
  label,
  page,
  pageSize,
  totalItems,
  onPageChange,
  disabled,
  pageSizeControl,
}: PaginationProps) {
  const range = getPagination(totalItems, page, pageSize);
  const sizes = [...new Set([range.pageSize, ...(pageSizeControl?.options ?? [])])]
    .filter((size) => Number.isInteger(size) && size > 0)
    .sort((a, b) => a - b);
  return (
    <nav className="pagination" aria-label={label}>
      <div className="pagination-summary">
        <span role="status">
          {range.total ? range.startIndex + 1 : 0}–{range.endIndex} of {range.total}
        </span>
        {pageSizeControl && (
          <label className="page-size">
            Per page
            <select
              aria-label={`${label}: items per page`}
              value={range.pageSize}
              disabled={disabled}
              onChange={(event) => pageSizeControl.onChange(Number(event.target.value))}
            >
              {sizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
      <div className="pagination-buttons">
        <Button
          aria-label="Previous page"
          disabled={disabled || range.page === 1}
          onClick={() => onPageChange(range.page - 1)}
        >
          Previous
        </Button>
        {pageNumbers(range.page, range.pageCount).map((item) =>
          typeof item === "number" ? (
            <Button
              key={item}
              aria-label={`Page ${item}`}
              aria-current={item === range.page ? "page" : undefined}
              disabled={disabled || range.total === 0}
              onClick={() => onPageChange(item)}
            >
              {item}
            </Button>
          ) : (
            <span key={item} className="pagination-gap" aria-hidden="true">
              …
            </span>
          ),
        )}
        <Button
          aria-label="Next page"
          disabled={disabled || range.page === range.pageCount}
          onClick={() => onPageChange(range.page + 1)}
        >
          Next
        </Button>
      </div>
    </nav>
  );
}
