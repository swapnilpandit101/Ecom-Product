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

  // Generate page numbers range intelligently for responsive display
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push('...');

      const startPage = Math.max(2, page - 1);
      const endPage = Math.min(totalPages - 1, page + 1);

      for (let i = startPage; i <= endPage; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (page < totalPages - 2) pages.push('...');
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

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

          {getPageNumbers().map((p, idx) => {
            if (p === '...') {
              return (
                <span key={`dots-${idx}`} className="pagination__ellipsis">
                  ...
                </span>
              );
            }

            return (
              <button
                key={p}
                className={`pagination__btn ${page === p ? 'pagination__btn--active' : ''}`}
                onClick={() => onPageChange(p)}
              >
                {p}
              </button>
            );
          })}

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

