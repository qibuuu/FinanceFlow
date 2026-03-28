import { useState, useEffect, useCallback } from 'react';
import { transactionAPI } from '../api';
import SummaryCards from '../components/SummaryCards';
import { MonthlyBarChart, CategoryPieChart } from '../components/Charts';
import { formatDate, formatCurrency, CATEGORY_COLORS } from '../utils/constants';
import { RefreshCw, TrendingUp, PieChart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function DashboardPage() {
  const { t } = useTranslation();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await transactionAPI.getSummary({ month, year });
      setSummary(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const months = [
    t('dashboard.months.1'), t('dashboard.months.2'), t('dashboard.months.3'), t('dashboard.months.4'), t('dashboard.months.5'), t('dashboard.months.6'),
    t('dashboard.months.7'), t('dashboard.months.8'), t('dashboard.months.9'), t('dashboard.months.10'), t('dashboard.months.11'), t('dashboard.months.12'),
  ];
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="animate-fade-in" style={{ padding: '1.5rem', maxWidth: '1280px', margin: '0 auto' }}>
      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>{t('dashboard.title')}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{t('dashboard.subtitle')}</p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {/* Month/Year selector */}
          <select
            className="form-input"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            style={{ width: 'auto', cursor: 'pointer' }}
          >
            {months.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
          </select>
          <select
            className="form-input"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            style={{ width: 'auto', cursor: 'pointer' }}
          >
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          <button onClick={fetchSummary} className="btn-ghost" style={{ padding: '0.625rem' }}>
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <SummaryCards summary={summary} loading={loading} />

      {/* Charts row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '1rem',
          marginTop: '1.5rem',
        }}
      >
        {/* Monthly Bar Chart */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <TrendingUp size={18} color="#6366f1" />
            <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>{t('dashboard.incomeVsExpenses')}</h2>
          </div>
          <MonthlyBarChart monthlyTrend={summary?.monthlyTrend} />
        </div>

        {/* Pie Chart */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <PieChart size={18} color="#8b5cf6" />
            <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>{t('dashboard.expenseBreakdown')} — {months[month - 1]}</h2>
          </div>
          <CategoryPieChart categoryBreakdown={summary?.categoryBreakdown} />
        </div>
      </div>

      {/* Category list */}
      {summary?.categoryBreakdown?.length > 0 && (
        <div className="glass-card" style={{ padding: '1.5rem', marginTop: '1rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>{t('dashboard.topCategories')}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {summary.categoryBreakdown.slice(0, 6).map((cat) => {
              const maxVal = summary.categoryBreakdown[0]?.total || 1;
              const pct = (cat.total / maxVal) * 100;
              const color = CATEGORY_COLORS[cat._id] || '#94a3b8';
              return (
                <div key={cat._id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.875rem' }}>
                    <span style={{ fontWeight: 500 }}>{cat._id}</span>
                    <span style={{ color, fontWeight: 600 }}>{formatCurrency(cat.total)}</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${pct}%`, background: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
