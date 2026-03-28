import { useState, useEffect, useCallback } from 'react';
import { transactionAPI } from '../api';
import TransactionTable from '../components/TransactionTable';
import TransactionForm from '../components/TransactionForm';
import Pagination from '../components/Pagination';
import { CATEGORIES } from '../utils/constants';
import { Plus, Search, Download, Filter, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, limit: 10, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [exporting, setExporting] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    search: '',
    startDate: '',
    endDate: '',
    page: 1,
    limit: 10,
  });

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      // Remove empty filters
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== '' && v !== null)
      );
      const { data } = await transactionAPI.getAll(params);
      setTransactions(data.data);
      setPagination(data.pagination);
    } catch (err) {
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    try {
      await transactionAPI.delete(id);
      toast.success('Transaction deleted');
      fetchTransactions();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleEdit = (transaction) => {
    setEditData(transaction);
    setShowForm(true);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([k, v]) => v !== '' && !['page', 'limit'].includes(k))
      );
      const { data } = await transactionAPI.exportCSV(params);
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `transactions-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('CSV exported!');
    } catch {
      toast.error('Export failed');
    } finally {
      setExporting(false);
    }
  };

  const resetFilters = () => {
    setFilters({ type: '', category: '', search: '', startDate: '', endDate: '', page: 1, limit: 10 });
  };

  const hasActiveFilters = filters.type || filters.category || filters.search || filters.startDate || filters.endDate;

  return (
    <div className="animate-fade-in" style={{ padding: '1.5rem', maxWidth: '1280px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>Transactions</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            {pagination.total} total transactions
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={handleExport} className="btn-ghost" disabled={exporting}>
            <Download size={15} />
            {exporting ? 'Exporting...' : 'Export CSV'}
          </button>
          <button
            id="add-transaction-btn"
            onClick={() => { setEditData(null); setShowForm(true); }}
            className="btn-primary"
          >
            <Plus size={16} />
            Add Transaction
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
            <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search description..."
              value={filters.search}
              onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value, page: 1 }))}
              style={{ paddingLeft: '2.25rem' }}
            />
          </div>

          {/* Type filter */}
          <select
            className="form-input"
            value={filters.type}
            onChange={(e) => setFilters((p) => ({ ...p, type: e.target.value, page: 1 }))}
            style={{ width: 'auto', cursor: 'pointer' }}
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          {/* Category filter */}
          <select
            className="form-input"
            value={filters.category}
            onChange={(e) => setFilters((p) => ({ ...p, category: e.target.value, page: 1 }))}
            style={{ width: 'auto', cursor: 'pointer' }}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Date range */}
          <input
            type="date"
            className="form-input"
            value={filters.startDate}
            onChange={(e) => setFilters((p) => ({ ...p, startDate: e.target.value, page: 1 }))}
            style={{ width: 'auto' }}
            title="From date"
          />
          <input
            type="date"
            className="form-input"
            value={filters.endDate}
            onChange={(e) => setFilters((p) => ({ ...p, endDate: e.target.value, page: 1 }))}
            style={{ width: 'auto' }}
            title="To date"
          />

          {/* Clear filters */}
          {hasActiveFilters && (
            <button onClick={resetFilters} className="btn-ghost" style={{ padding: '0.625rem 0.875rem' }}>
              <X size={14} />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <TransactionTable
          transactions={transactions}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />

        {pagination.totalPages > 1 && (
          <div style={{ padding: '0 1.25rem', borderTop: '1px solid var(--border)' }}>
            <Pagination
              pagination={pagination}
              onPageChange={(p) => setFilters((prev) => ({ ...prev, page: p }))}
            />
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <TransactionForm
          onClose={() => { setShowForm(false); setEditData(null); }}
          onSuccess={fetchTransactions}
          editData={editData}
        />
      )}
    </div>
  );
}
