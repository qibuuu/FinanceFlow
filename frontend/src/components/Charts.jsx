import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Sector,
} from 'recharts';
import { CATEGORY_COLORS, formatCurrency } from '../utils/constants';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

// ─── Income vs Expense Bar Chart ─────────────────────────────────────────────
export function MonthlyBarChart({ monthlyTrend }) {
  const { t } = useTranslation();
  // Transform aggregated data into recharts format
  const dataMap = {};
  (monthlyTrend || []).forEach(({ _id, total }) => {
    const key = `${t(`dashboard.months.${_id.month}`)} '${String(_id.year).slice(2)}`;
    if (!dataMap[key]) dataMap[key] = { month: key, income: 0, expense: 0 };
    dataMap[key][_id.type] = total;
  });

  const data = Object.values(dataMap);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            padding: '0.75rem 1rem',
            fontSize: '0.8rem',
          }}
        >
          <p style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{label}</p>
          {payload.map((p) => (
            <p key={p.dataKey} style={{ color: p.fill, marginBottom: '0.2rem' }}>
              {t(`charts.${p.dataKey}`, p.dataKey)}: {formatCurrency(p.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value) => (
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
              {t(`charts.${value}`, value)}
            </span>
          )}
        />
        <Bar dataKey="income" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={40} />
        <Bar dataKey="expense" fill="#ef4444" radius={[6, 6, 0, 0]} maxBarSize={40} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── Category Pie Chart ───────────────────────────────────────────────────────
const renderActiveShape = (props) => {
  const {
    cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value,
  } = props;

  return (
    <g>
      <text x={cx} y={cy - 12} textAnchor="middle" fill="var(--text-primary)" fontSize={13} fontWeight={600}>
        {payload._id}
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="var(--text-secondary)" fontSize={12}>
        {formatCurrency(value)}
      </text>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 8} startAngle={startAngle} endAngle={endAngle} fill={fill} />
      <Sector cx={cx} cy={cy} innerRadius={outerRadius + 12} outerRadius={outerRadius + 16} startAngle={startAngle} endAngle={endAngle} fill={fill} />
    </g>
  );
};

export function CategoryPieChart({ categoryBreakdown }) {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);

  const data = (categoryBreakdown || []).map((item) => ({
    ...item,
    name: item._id,
    fill: CATEGORY_COLORS[item._id] || '#94a3b8',
  }));

  if (!data.length) {
    return (
      <div
        style={{
          height: 280,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-secondary)',
          fontSize: '0.875rem',
        }}
      >
        {t('charts.noExpenseData')}
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={100}
          dataKey="total"
          onMouseEnter={(_, index) => setActiveIndex(index)}
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.fill} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
