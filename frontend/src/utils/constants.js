// Utility constants and formatters
import i18n from '../i18n';

export const CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Salary',
  'Freelance',
  'Investment',
  'Gift',
  'Other',
];

export const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'];
export const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Other',
];

export const CATEGORY_COLORS = {
  'Food & Dining': '#f59e0b',
  'Transportation': '#3b82f6',
  'Shopping': '#ec4899',
  'Entertainment': '#8b5cf6',
  'Bills & Utilities': '#ef4444',
  'Healthcare': '#10b981',
  'Education': '#06b6d4',
  'Travel': '#f97316',
  'Salary': '#22c55e',
  'Freelance': '#a3e635',
  'Investment': '#6366f1',
  'Gift': '#e879f9',
  'Other': '#94a3b8',
};

export const RATE_USD_TO_VND = 26000;

export const baseToForm = (amount) => {
  if (amount == null) return '';
  const isVi = i18n.language?.startsWith('vi');
  return isVi ? amount * RATE_USD_TO_VND : amount;
};

export const formToBase = (amount) => {
  if (amount == null) return 0;
  const isVi = i18n.language?.startsWith('vi');
  return isVi ? amount / RATE_USD_TO_VND : amount;
};

export const formatCurrency = (amount) => {
  const lang = i18n.language || 'en';
  const isVi = lang.startsWith('vi');
  
  const currency = isVi ? 'VND' : 'USD';
  const locale = isVi ? 'vi-VN' : 'en-US';
  const digits = isVi ? 0 : 2;

  const displayAmount = isVi ? amount * RATE_USD_TO_VND : amount;

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(displayAmount);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatMonth = (month, year) => {
  return new Date(year, month - 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
};

export const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];
