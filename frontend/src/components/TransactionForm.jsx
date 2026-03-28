import { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES, formatDate } from '../utils/constants';
import toast from 'react-hot-toast';
import { transactionAPI } from '../api';
import { useTranslation } from 'react-i18next';

const defaultForm = {
  type: 'expense',
  amount: '',
  category: '',
  description: '',
  date: new Date().toISOString().split('T')[0],
};

export default function TransactionForm({ onClose, onSuccess, editData }) {
  const { t } = useTranslation();
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setForm({
        type: editData.type,
        amount: editData.amount,
        category: editData.category,
        description: editData.description || '',
        date: new Date(editData.date).toISOString().split('T')[0],
      });
    }
  }, [editData]);

  const categories = form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      // Reset category when type changes
      ...(name === 'type' ? { category: '' } : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category) return toast.error(t('transaction.form.errCategory'));
    if (!form.amount || Number(form.amount) <= 0) return toast.error(t('transaction.form.errAmount'));

    setLoading(true);
    try {
      if (editData) {
        await transactionAPI.update(editData._id, form);
        toast.success(t('transaction.form.updateSuccess'));
      } else {
        await transactionAPI.create(form);
        toast.success(t('transaction.form.addSuccess'));
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || t('transaction.form.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div
        className="glass-card animate-slide-down"
        style={{ width: '100%', maxWidth: '480px', padding: '2rem' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
            {editData ? t('transaction.editTransaction') : t('transaction.addTransaction')}
          </h2>
          <button onClick={onClose} className="btn-ghost" style={{ padding: '0.4rem' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Type toggle */}
          <div style={{ display: 'flex', gap: '0.5rem', padding: '0.25rem', background: 'var(--bg-primary)', borderRadius: '10px' }}>
            {['expense', 'income'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, type: t, category: '' }))}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  transition: 'all 0.2s',
                  background:
                    form.type === t
                      ? t === 'income'
                        ? 'rgba(16,185,129,0.2)'
                        : 'rgba(239,68,68,0.2)'
                      : 'transparent',
                  color:
                    form.type === t
                      ? t === 'income'
                        ? '#10b981'
                        : '#ef4444'
                      : 'var(--text-secondary)',
                }}
              >
                {t('transaction.' + t, t.charAt(0).toUpperCase() + t.slice(1))}
              </button>
            ))}
          </div>

          {/* Amount */}
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'block' }}>
              {t('transaction.form.amount')}
            </label>
            <input
              type="number"
              name="amount"
              className="form-input"
              value={form.amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0.01"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'block' }}>
              {t('transaction.table.category')}
            </label>
            <select
              name="category"
              className="form-input"
              value={form.category}
              onChange={handleChange}
              required
              style={{ cursor: 'pointer' }}
            >
              <option value="">{t('budget.form.selectCategory')}</option>
              {categories.map((c) => (
                <option key={c} value={c}>{t(`category.${c}`, c)}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'block' }}>
              {t('transaction.form.description')}
            </label>
            <input
              type="text"
              name="description"
              className="form-input"
              value={form.description}
              onChange={handleChange}
              placeholder={t('transaction.form.descPlaceholder')}
              maxLength={200}
            />
          </div>

          {/* Date */}
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'block' }}>
              {t('transaction.form.date')}
            </label>
            <input
              type="date"
              name="date"
              className="form-input"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>

          {/* Submit */}
          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '0.5rem' }}>
            <Plus size={16} />
            {loading ? t('transaction.form.saving') : editData ? t('transaction.form.updateBtn') : t('transaction.addTransaction')}
          </button>
        </form>
      </div>
    </div>
  );
}
