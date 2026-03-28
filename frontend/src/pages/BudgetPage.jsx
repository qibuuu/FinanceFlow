import { useState, useEffect, useCallback } from 'react';
import { budgetAPI } from '../api';
import BudgetForm from '../components/BudgetForm';
import { formatCurrency, CATEGORY_COLORS, formatMonth } from '../utils/constants';
import { Plus, Trash2, AlertTriangle, CheckCircle, Target } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BudgetPage() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const fetchBudgets = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await budgetAPI.getAll({ month, year });
      setBudgets(data.data);
    } catch {
      toast.error('Failed to load budgets');
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this budget?')) return;
    try {
      await budgetAPI.delete(id);
      toast.success('Budget deleted');
      fetchBudgets();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  // Count alerts
  const alertCount = budgets.filter((b) => b.alert).length;
  const warningCount = budgets.filter((b) => b.warning).length;

  return (
    <div className="animate-fade-in" style={{ padding: '1.5rem', maxWidth: '1280px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>Budget Planner</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Manage spending limits by category
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
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
          <button onClick={() => setShowForm(true)} className="btn-primary" id="add-budget-btn">
            <Plus size={16} />
            Add Budget
          </button>
        </div>
      </div>

      {/* Alert banners */}
      {alertCount > 0 && (
        <div
          className="animate-fade-in"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem 1.25rem',
            background: 'rgba(239,68,68,0.12)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '12px',
            marginBottom: '1rem',
            color: '#ef4444',
          }}
        >
          <AlertTriangle size={18} />
          <strong>{alertCount} budget{alertCount > 1 ? 's' : ''} exceeded!</strong>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            You've gone over your spending limit for {alertCount} {alertCount > 1 ? 'categories' : 'category'}.
          </span>
        </div>
      )}

      {warningCount > 0 && !alertCount && (
        <div
          className="animate-fade-in"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem 1.25rem',
            background: 'rgba(245,158,11,0.12)',
            border: '1px solid rgba(245,158,11,0.3)',
            borderRadius: '12px',
            marginBottom: '1rem',
            color: '#f59e0b',
          }}
        >
          <AlertTriangle size={18} />
          <strong>{warningCount} budget{warningCount > 1 ? 's' : ''} approaching limit</strong>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            You've used 80%+ of your budget in {warningCount} {warningCount > 1 ? 'categories' : 'category'}.
          </span>
        </div>
      )}

      {/* Budget cards */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          Loading budgets...
        </div>
      ) : budgets.length === 0 ? (
        <div
          className="glass-card"
          style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}
        >
          <Target size={48} color="var(--border)" style={{ margin: '0 auto 1rem' }} />
          <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            No budgets set for {months[month - 1]} {year}
          </p>
          <p style={{ fontSize: '0.875rem' }}>Create a budget to start tracking your spending limits</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1rem',
          }}
        >
          {budgets.map((budget) => {
            const color = budget.alert
              ? '#ef4444'
              : budget.warning
              ? '#f59e0b'
              : '#10b981';
            const catColor = CATEGORY_COLORS[budget.category] || '#94a3b8';

            return (
              <div key={budget._id} className="glass-card" style={{ padding: '1.5rem' }}>
                {/* Card header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: `${catColor}22`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.1rem',
                      }}
                    >
                      {budget.alert ? '🔴' : budget.warning ? '🟡' : '🟢'}
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>{budget.category}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {formatMonth(month, year)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(budget._id)}
                    className="btn-danger"
                    style={{ padding: '0.35rem 0.6rem' }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                {/* Progress */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {formatCurrency(budget.spent)} spent
                    </span>
                    <span style={{ fontWeight: 600, color }}>
                      {budget.percentage}%
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${Math.min(budget.percentage, 100)}%`,
                        background: color,
                      }}
                    />
                  </div>
                </div>

                {/* Amounts */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: '0.15rem' }}>Limit</p>
                    <p style={{ fontWeight: 700 }}>{formatCurrency(budget.limit)}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: '0.15rem' }}>
                      {budget.remaining >= 0 ? 'Remaining' : 'Over by'}
                    </p>
                    <p style={{ fontWeight: 700, color }}>
                      {formatCurrency(Math.abs(budget.remaining))}
                    </p>
                  </div>
                </div>

                {/* Status badge */}
                {budget.alert && (
                  <div
                    style={{
                      marginTop: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.4rem 0.75rem',
                      background: 'rgba(239,68,68,0.1)',
                      borderRadius: '8px',
                      color: '#ef4444',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    <AlertTriangle size={12} />
                    Budget exceeded!
                  </div>
                )}
                {budget.warning && !budget.alert && (
                  <div
                    style={{
                      marginTop: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.4rem 0.75rem',
                      background: 'rgba(245,158,11,0.1)',
                      borderRadius: '8px',
                      color: '#f59e0b',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    <AlertTriangle size={12} />
                    Approaching limit
                  </div>
                )}
                {!budget.alert && !budget.warning && (
                  <div
                    style={{
                      marginTop: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.4rem 0.75rem',
                      background: 'rgba(16,185,129,0.1)',
                      borderRadius: '8px',
                      color: '#10b981',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    <CheckCircle size={12} />
                    On track
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <BudgetForm
          onClose={() => setShowForm(false)}
          onSuccess={fetchBudgets}
          month={month}
          year={year}
        />
      )}
    </div>
  );
}
