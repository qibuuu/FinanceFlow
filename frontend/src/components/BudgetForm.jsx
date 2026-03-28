import { useState } from 'react';
import { X, Target } from 'lucide-react';
import { EXPENSE_CATEGORIES } from '../utils/constants';
import toast from 'react-hot-toast';
import { budgetAPI } from '../api';

export default function BudgetForm({ onClose, onSuccess, month, year }) {
  const [form, setForm] = useState({ category: '', limit: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category) return toast.error('Select a category');
    if (!form.limit || Number(form.limit) <= 0) return toast.error('Enter a valid limit');

    setLoading(true);
    try {
      await budgetAPI.upsert({ ...form, limit: Number(form.limit), month, year });
      toast.success('Budget saved!');
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving budget');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="glass-card animate-slide-down" style={{ width: '100%', maxWidth: '420px', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Set Budget</h2>
          <button onClick={onClose} className="btn-ghost" style={{ padding: '0.4rem' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
              Category
            </label>
            <select
              className="form-input"
              value={form.category}
              onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
              required
              style={{ cursor: 'pointer' }}
            >
              <option value="">Select category...</option>
              {EXPENSE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
              Monthly Limit ($)
            </label>
            <input
              type="number"
              className="form-input"
              value={form.limit}
              onChange={(e) => setForm((p) => ({ ...p, limit: e.target.value }))}
              placeholder="0.00"
              min="1"
              step="1"
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '0.5rem' }}>
            <Target size={16} />
            {loading ? 'Saving...' : 'Save Budget'}
          </button>
        </form>
      </div>
    </div>
  );
}
