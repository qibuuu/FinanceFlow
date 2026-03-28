import { useState } from 'react';
import { X, Target } from 'lucide-react';
import { EXPENSE_CATEGORIES, baseToForm, formToBase } from '../utils/constants';
import toast from 'react-hot-toast';
import { budgetAPI } from '../api';
import { useTranslation } from 'react-i18next';

export default function BudgetForm({ onClose, onSuccess, month, year }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({ category: '', limit: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category) return toast.error(t('budget.form.selectCategoryErr'));
    if (!form.limit || Number(form.limit) <= 0) return toast.error(t('budget.form.invalidLimitErr'));

    setLoading(true);
    try {
      await budgetAPI.upsert({ ...form, limit: formToBase(Number(form.limit)), month, year });
      toast.success(t('budget.form.saveSuccess'));
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || t('budget.form.saveError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="glass-card animate-slide-down" style={{ width: '100%', maxWidth: '420px', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{t('budget.form.title')}</h2>
          <button onClick={onClose} className="btn-ghost" style={{ padding: '0.4rem' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
              {t('budget.form.category')}
            </label>
            <select
              className="form-input"
              value={form.category}
              onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
              required
              style={{ cursor: 'pointer' }}
            >
              <option value="">{t('budget.form.selectCategory')}</option>
              {EXPENSE_CATEGORIES.map((c) => <option key={c} value={c}>{t(`category.${c}`, c)}</option>)}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
              {t('budget.form.monthlyLimit')}
            </label>
            <input
              type="number"
              className="form-input"
              value={form.limit}
              onChange={(e) => setForm((p) => ({ ...p, limit: e.target.value }))}
              placeholder="0"
              min="1"
              step="any"
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '0.5rem' }}>
            <Target size={16} />
            {loading ? t('budget.form.saving') : t('budget.form.save')}
          </button>
        </form>
      </div>
    </div>
  );
}
