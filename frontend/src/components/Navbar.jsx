import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Target,
  LogOut,
  Sun,
  Moon,
  DollarSign,
  Award,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const navLinks = [
  { to: '/dashboard', labelKey: 'nav.dashboard', icon: LayoutDashboard },
  { to: '/transactions', labelKey: 'nav.transactions', icon: ArrowLeftRight },
  { to: '/budgets', labelKey: 'nav.budgets', icon: Target },
  { to: '/goals', labelKey: 'nav.goals', icon: Award },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const { t, i18n } = useTranslation();

  return (
    <nav
      style={{
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        backdropFilter: 'blur(12px)',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px',
        }}
      >
        {/* Logo */}
        <Link to="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <DollarSign size={20} color="white" />
          </div>
          <span
            style={{ fontWeight: 700, fontSize: '1.1rem' }}
            className="gradient-text"
          >
            {t('nav.financeFlow', 'FinanceFlow')}
          </span>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          {navLinks.map(({ to, labelKey, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.4rem 0.875rem',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: active ? 600 : 400,
                  background: active ? 'rgba(99,102,241,0.15)' : 'transparent',
                  color: active ? '#6366f1' : 'var(--text-secondary)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = 'rgba(99,102,241,0.08)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }
                }}
              >
                <Icon size={16} />
                {t(labelKey)}
              </Link>
            );
          })}
        </div>

        {/* Right side actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* User info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.875rem',
                fontWeight: 700,
                color: 'white',
              }}
            >
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'none' }}>
              {user?.name}
            </span>
          </div>

          {/* Language toggle */}
          <select
            value={i18n.language?.split('-')[0] || 'en'}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            className="btn-ghost"
            style={{
              padding: '0.4rem',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'transparent',
              color: 'var(--text-primary)',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="en">EN</option>
            <option value="vi">VI</option>
          </select>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="btn-ghost"
            style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)' }}
            title={t(isDark ? 'nav.switchToLight' : 'nav.switchToDark')}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Logout */}
          <button
            onClick={logout}
            className="btn-ghost"
            style={{ padding: '0.5rem 0.875rem', fontSize: '0.8rem' }}
            title={t('nav.logout')}
          >
            <LogOut size={14} />
            {t('nav.logout')}
          </button>
        </div>
      </div>
    </nav>
  );
}
