import { TrendingUp, TrendingDown, Wallet, Activity } from 'lucide-react';
import { formatCurrency } from '../utils/constants';

const cards = [
  {
    key: 'balance',
    label: 'Total Balance',
    icon: Wallet,
    color: '#6366f1',
    gradient: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.1))',
  },
  {
    key: 'income',
    label: 'Monthly Income',
    icon: TrendingUp,
    color: '#10b981',
    gradient: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.05))',
  },
  {
    key: 'expense',
    label: 'Monthly Expenses',
    icon: TrendingDown,
    color: '#ef4444',
    gradient: 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(239,68,68,0.05))',
  },
  {
    key: 'monthBalance',
    label: 'Monthly Net',
    icon: Activity,
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.05))',
  },
];

export default function SummaryCards({ summary, loading }) {
  const values = {
    balance: summary?.overall?.balance ?? 0,
    income: summary?.currentMonth?.income ?? 0,
    expense: summary?.currentMonth?.expense ?? 0,
    monthBalance: summary?.currentMonth?.balance ?? 0,
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
      }}
    >
      {cards.map(({ key, label, icon: Icon, color, gradient }) => {
        const value = values[key];
        const isNegative = value < 0;
        return (
          <div
            key={key}
            className="glass-card"
            style={{ padding: '1.5rem', background: gradient }}
          >
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div
                  style={{
                    height: '16px',
                    width: '60%',
                    background: 'var(--border)',
                    borderRadius: '4px',
                    animation: 'pulse 1.5s infinite',
                  }}
                />
                <div
                  style={{
                    height: '28px',
                    width: '80%',
                    background: 'var(--border)',
                    borderRadius: '4px',
                    animation: 'pulse 1.5s infinite',
                  }}
                />
              </div>
            ) : (
              <>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.75rem',
                  }}
                >
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    {label}
                  </span>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: `${color}22`,
                      border: `1px solid ${color}44`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={18} color={color} />
                  </div>
                </div>
                <div
                  style={{
                    fontSize: '1.6rem',
                    fontWeight: 700,
                    color: isNegative ? '#ef4444' : 'var(--text-primary)',
                    letterSpacing: '-0.5px',
                  }}
                >
                  {formatCurrency(value)}
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
