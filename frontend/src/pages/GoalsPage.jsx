import { useState, useEffect, useCallback } from 'react';
import { Plus, Target, PiggyBank, Trash2, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { goalAPI } from '../api';
import { formatCurrency, formatDate } from '../utils/constants';
import GoalForm from '../components/GoalForm';

export default function GoalsPage() {
  const { t } = useTranslation();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchGoals = useCallback(async () => {
    try {
      const { data } = await goalAPI.getAll();
      setGoals(data.data);
    } catch {
      toast.error(t('goals.loadFailed', 'Failed to load goals'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const handleDelete = async (id) => {
    if (!window.confirm(t('goals.deleteConfirm', 'Delete this goal?'))) return;
    try {
      await goalAPI.delete(id);
      toast.success(t('goals.deleteSuccess', 'Goal deleted!'));
      fetchGoals();
    } catch {
      toast.error(t('goals.deleteFailed', 'Failed to delete'));
    }
  };

  const calculateProgress = (saved, target) => {
    if (target === 0) return 0;
    return Math.min(Math.round((saved / target) * 100), 100);
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        {t('app.loading')}
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ padding: '1.5rem', maxWidth: '1280px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>{t('goals.title', 'Financial Goals')}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            {t('goals.subtitle', 'Track and achieve your savings targets')}
          </p>
        </div>
        <button
          onClick={() => { setEditData(null); setShowForm(true); }}
          className="btn-primary"
        >
          <Plus size={16} />
          {t('goals.addGoal', 'Add Goal')}
        </button>
      </div>

      {!goals.length ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <Target size={40} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
          <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            {t('goals.empty', 'No goals set yet')}
          </p>
          <p style={{ fontSize: '0.875rem' }}>
            {t('goals.emptyDesc', 'Set your first financial target to start saving!')}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {goals.map(goal => {
            const progress = calculateProgress(goal.savedAmount, goal.targetAmount);
            const isCompleted = goal.status === 'completed';

            return (
              <div key={goal._id} className="glass-card" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                {isCompleted && (
                  <div style={{
                    position: 'absolute', top: '1rem', right: '-2rem', background: '#10b981', color: '#fff',
                    padding: '0.25rem 2.5rem', transform: 'rotate(45deg)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1px'
                  }}>
                    {t('goals.completedLabel', 'COMPLETED')}
                  </div>
                )}
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', paddingRight: isCompleted ? '1.5rem' : '0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ padding: '0.75rem', background: isCompleted ? 'rgba(16,185,129,0.1)' : 'rgba(99,102,241,0.1)', borderRadius: '12px', color: isCompleted ? '#10b981' : '#6366f1' }}>
                      <Target size={24} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{goal.title}</h3>
                      {goal.deadline && (
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                          {t('goals.deadline', 'Target date:')} {formatDate(goal.deadline)}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.3rem' }}>
                    <button
                      onClick={() => { setEditData(goal); setShowForm(true); }}
                      className="btn-ghost"
                      style={{ padding: '0.4rem' }}
                      title={t('goals.edit', 'Edit')}
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(goal._id)}
                      className="btn-ghost"
                      style={{ padding: '0.4rem', color: '#ef4444' }}
                      title={t('goals.delete', 'Delete')}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{formatCurrency(goal.savedAmount)}</span>
                    <span style={{ fontWeight: 600 }}>{formatCurrency(goal.targetAmount)}</span>
                  </div>
                  <div className="progress-bar" style={{ height: '8px' }}>
                    <div
                      className="progress-fill"
                      style={{
                        width: `${progress}%`,
                        background: isCompleted ? '#10b981' : '#6366f1'
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.4rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isCompleted ? '#10b981' : '#6366f1' }}>
                      {progress}%
                    </span>
                  </div>
                </div>
                
                {!isCompleted && (
                  <button
                    onClick={() => { setEditData({ ...goal, isFundMode: true }); setShowForm(true); }}
                    className="btn"
                    style={{
                      width: '100%',
                      padding: '0.6rem',
                      background: 'rgba(99,102,241,0.1)',
                      color: '#6366f1',
                      border: '1px solid rgba(99,102,241,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      fontWeight: 600
                    }}
                  >
                    <PiggyBank size={15} />
                    {t('goals.fund', 'Fund Goal')}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <GoalForm
          editData={editData}
          onClose={() => setShowForm(false)}
          onSuccess={fetchGoals}
        />
      )}
    </div>
  );
}
