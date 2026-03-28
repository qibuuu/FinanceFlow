import { useState, useEffect } from 'react';
import { X, Target, PiggyBank } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { goalAPI } from '../api';
import { baseToForm, formToBase } from '../utils/constants';

const defaultForm = {
  title: '',
  targetAmount: '',
  deadline: '',
};

export default function GoalForm({ onClose, onSuccess, editData }) {
  const { t } = useTranslation();
  
  // If editData.isFundMode is true, we only show funding UI
  const isFundMode = editData?.isFundMode;

  const [form, setForm] = useState(defaultForm);
  const [fundAmount, setFundAmount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData && !isFundMode) {
      setForm({
        title: editData.title,
        targetAmount: baseToForm(editData.targetAmount),
        deadline: editData.deadline ? editData.deadline.split('T')[0] : '',
      });
    }
  }, [editData, isFundMode]);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isFundMode) {
        if (!fundAmount || Number(fundAmount) <= 0) {
          toast.error(t('goals.form.errAmount', 'Invalid amount'));
          setLoading(false);
          return;
        }
        await goalAPI.update(editData._id, { addAmount: formToBase(Number(fundAmount)) });
        toast.success(t('goals.form.fundSuccess', 'Goal funded!'));
      } else if (editData) {
        if (!form.title || !form.targetAmount) {
           toast.error(t('goals.form.errRequired', 'Required fields missing'));
           setLoading(false);
           return;
        }
        const payload = { ...form, targetAmount: formToBase(Number(form.targetAmount)) };
        await goalAPI.update(editData._id, payload);
        toast.success(t('goals.form.updateSuccess', 'Goal updated!'));
      } else {
        if (!form.title || !form.targetAmount) {
          toast.error(t('goals.form.errRequired', 'Required fields missing'));
          setLoading(false);
          return;
       }
        const payload = { ...form, targetAmount: formToBase(Number(form.targetAmount)) };
        await goalAPI.create(payload);
        toast.success(t('goals.form.addSuccess', 'Goal created!'));
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || t('goals.form.error', 'Something went wrong'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
      backdropFilter: 'blur(4px)'
    }}>
      <div className="glass-card animate-fade-in" onClick={(e) => e.stopPropagation()} style={{
        width: '100%', maxWidth: '400px', padding: '1.5rem', background: 'var(--bg-primary)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {isFundMode ? <PiggyBank size={18} color="#6366f1"/> : <Target size={18} color="#6366f1"/>}
            {isFundMode 
              ? t('goals.form.fundTitle', 'Fund Goal: {{title}}', { title: editData.title }) 
              : editData ? t('goals.form.editTitle', 'Edit Goal') : t('goals.form.addTitle', 'Create Goal')}
          </h2>
          <button onClick={onClose} className="btn-ghost" style={{ padding: '0.4rem' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {isFundMode ? (
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'block' }}>
                {t('goals.form.amountToAdd', 'Amount to add')}
              </label>
              <input
                type="number"
                className="form-input"
                value={fundAmount}
                onChange={(e) => setFundAmount(e.target.value)}
                placeholder="0"
                min="1"
                step="any"
                required
                autoFocus
              />
            </div>
          ) : (
            <>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'block' }}>
                  {t('goals.form.goalName', 'Goal Name')}
                </label>
                <input
                  type="text"
                  name="title"
                  className="form-input"
                  value={form.title}
                  onChange={handleChange}
                  placeholder={t('goals.form.namePlaceholder', 'e.g. New Car, Vacation')}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'block' }}>
                  {t('goals.form.targetAmount', 'Target Amount')}
                </label>
                <input
                  type="number"
                  name="targetAmount"
                  className="form-input"
                  value={form.targetAmount}
                  onChange={handleChange}
                  placeholder="0"
                  min="1"
                  step="any"
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'block' }}>
                  {t('goals.form.deadline', 'Deadline (optional)')}
                </label>
                <input
                  type="date"
                  name="deadline"
                  className="form-input"
                  value={form.deadline}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '0.5rem' }}>
            {loading ? t('transaction.form.saving', 'Saving...') : t('goals.form.submitBtn', 'Confirm')}
          </button>
        </form>
      </div>
    </div>
  );
}
