import { Pencil, Trash2 } from 'lucide-react';
import { formatCurrency, formatDate, CATEGORY_COLORS } from '../utils/constants';
import { useTranslation } from 'react-i18next';

export default function TransactionTable({ transactions, onEdit, onDelete, loading }) {
  const { t } = useTranslation();
  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        {t('transaction.loading')}
      </div>
    );
  }

  if (!transactions?.length) {
    return (
      <div
        style={{
          padding: '3rem',
          textAlign: 'center',
          color: 'var(--text-secondary)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <span style={{ fontSize: '2rem' }}>📭</span>
        <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{t('transaction.noData')}</p>
        <p style={{ fontSize: '0.875rem' }}>{t('transaction.noDataDesc')}</p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            {['date', 'description', 'category', 'type', 'amount', 'actions'].map((h) => (
              <th
                key={h}
                style={{
                  padding: '0.875rem 1rem',
                  textAlign: h === 'amount' || h === 'actions' ? 'right' : 'left',
                  color: 'var(--text-secondary)',
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {t('transaction.table.' + h)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr
              key={t._id}
              style={{
                borderBottom: '1px solid var(--border)',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(99,102,241,0.04)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <td style={{ padding: '0.875rem 1rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                {formatDate(t.date)}
              </td>
              <td style={{ padding: '0.875rem 1rem', maxWidth: '200px' }}>
                <span
                  style={{
                    display: 'block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    color: 'var(--text-primary)',
                  }}
                >
                  {t.description || '—'}
                </span>
              </td>
              <td style={{ padding: '0.875rem 1rem' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    background: `${CATEGORY_COLORS[t.category] || '#94a3b8'}22`,
                    color: CATEGORY_COLORS[t.category] || '#94a3b8',
                  }}
                >
                  {t('category.' + t.category, t.category)}
                </span>
              </td>
              <td style={{ padding: '0.875rem 1rem' }}>
                <span className={`badge badge-${t.type}`}>
                  {t('transaction.' + t.type)}
                </span>
              </td>
              <td
                style={{
                  padding: '0.875rem 1rem',
                  textAlign: 'right',
                  fontWeight: 700,
                  color: t.type === 'income' ? '#10b981' : '#ef4444',
                  whiteSpace: 'nowrap',
                }}
              >
                {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
              </td>
              <td style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>
                <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => onEdit(t)}
                    className="btn-ghost"
                    style={{ padding: '0.35rem 0.6rem' }}
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => onDelete(t._id)}
                    className="btn-danger"
                    style={{ padding: '0.35rem 0.6rem' }}
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
