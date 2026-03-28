import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Pagination({ pagination, onPageChange }) {
  const { t } = useTranslation();
  const { page, totalPages, total, limit } = pagination;
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 0',
        fontSize: '0.875rem',
        color: 'var(--text-secondary)',
      }}
    >
      <span>
        {t('pagination.showing', { start: startItem, end: endItem, total })}
      </span>
      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="btn-ghost"
          style={{ padding: '0.4rem 0.6rem' }}
        >
          <ChevronLeft size={16} />
        </button>

        {/* Page numbers */}
        {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
          let p;
          if (totalPages <= 7) {
            p = i + 1;
          } else if (page <= 4) {
            p = i + 1;
          } else if (page >= totalPages - 3) {
            p = totalPages - 6 + i;
          } else {
            p = page - 3 + i;
          }

          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={page === p ? 'btn-primary' : 'btn-ghost'}
              style={{ padding: '0.4rem 0.7rem', minWidth: '36px' }}
            >
              {p}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="btn-ghost"
          style={{ padding: '0.4rem 0.6rem' }}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
