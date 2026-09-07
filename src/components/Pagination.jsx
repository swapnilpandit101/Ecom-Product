import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Pagination.css';

function Pagination({
  page = 1,
  totalPages = 1,
  totalItems = 0,
  limit = 10,
  onPageChange,
  onLimitChange
}) {
  if (totalItems === 0) return null;

  const start = totalItems === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, totalItems);


  return (
    <div className="pagination">
      <div className="pagination__left">
        <div className="pagination__info">
          Showing <strong>{start}</strong> to <strong>{end}</strong> of <strong>{totalItems}</strong> results
        </div>

        {onLimitChange && (
          <div className="pagination__rows-per-page">
            <span className="pagination__rows-label">Rows per page:</span>
            <select
              className="pagination__select"
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              aria-label="Rows per page"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        )}
      </div>

      <div className="pagination__right">
        <div className="pagination__controls">
          <button
            className="pagination__btn pagination__btn--nav"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            aria-label="Previous Page"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            className="pagination__btn pagination__btn--nav"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            aria-label="Next Page"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <span className="pagination__page-text">
          Page {page} of {totalPages}
        </span>
      </div>
    </div>
  );
}

export default Pagination;

