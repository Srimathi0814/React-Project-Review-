import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../services/productService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const s = {
  page: { padding: '40px 32px', maxWidth: 1200, margin: '0 auto' },
  header: { marginBottom: 40 },
  eyebrow: {
    fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)',
    letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8,
  },
  title: {
    fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800,
    color: 'var(--text)', letterSpacing: '-0.03em', lineHeight: 1.1,
  },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 40 },
  card: {
    background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', padding: '24px',
    position: 'relative', overflow: 'hidden',
    transition: 'border-color var(--transition)',
  },
  cardLabel: { fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 },
  cardValue: { fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 },
  cardSub: { fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)', marginTop: 8 },
  cardGlow: { position: 'absolute', top: -40, right: -40, width: 120, height: 120, borderRadius: '50%', filter: 'blur(40px)', opacity: 0.15 },

  bottom: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 },
  section: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 28 },
  sectionTitle: { fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  sectionLink: { fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', textDecoration: 'none', letterSpacing: '0.05em' },

  tableRow: { display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 12, alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' },
  rowName: { fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 500, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  badge: { fontFamily: 'var(--font-mono)', fontSize: 11, padding: '3px 8px', borderRadius: 6, fontWeight: 500 },
  price: { fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-dim)', textAlign: 'right' },

  empty: { textAlign: 'center', padding: 40, color: 'var(--text-faint)', fontFamily: 'var(--font-mono)', fontSize: 13 },
};

const StatCard = ({ label, value, sub, color, prefix = '' }) => (
  <div
    style={s.card}
    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-bright)'}
    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
  >
    <div style={{ ...s.cardGlow, background: color }} />
    <div style={s.cardLabel}>{label}</div>
    <div style={{ ...s.cardValue, color }}>{prefix}{value}</div>
    {sub && <div style={s.cardSub}>{sub}</div>}
  </div>
);

const StockBadge = ({ stock }) => {
  const cfg = stock === 0
    ? { bg: 'var(--red-dim)', color: 'var(--red)', label: 'Out' }
    : stock < 5
    ? { bg: 'var(--amber-dim)', color: 'var(--amber)', label: `${stock} left` }
    : { bg: 'var(--green-dim)', color: 'var(--green)', label: `${stock}` };
  return <span style={{ ...s.badge, background: cfg.bg, color: cfg.color }}>{cfg.label}</span>;
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-bright)', borderRadius: 8, padding: '10px 14px' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--text)', marginBottom: 4 }}>{payload[0]?.payload?.name}</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent)' }}>{payload[0]?.value} units</div>
    </div>
  );
};

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts().then(data => { setProducts(data); setLoading(false); });
  }, []);

  if (loading) return <div style={{ ...s.page, ...s.empty }}>Loading...</div>;

  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const outOfStock = products.filter(p => p.stock === 0).length;
  const lowStock = products.filter(p => p.stock > 0 && p.stock < 5).length;

  const lowStockItems = products.filter(p => p.stock < 10).sort((a, b) => a.stock - b.stock).slice(0, 6);
  const chartData = [...products].sort((a, b) => b.stock - a.stock).slice(0, 6).map(p => ({ name: p.name.length > 14 ? p.name.slice(0, 14) + '…' : p.name, stock: p.stock }));

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div style={s.eyebrow}>Overview</div>
        <h1 style={s.title}>Dashboard</h1>
      </div>

      <div style={s.statsGrid}>
        <StatCard label="Total Products" value={totalProducts} sub="in inventory" color="var(--accent)" />
        <StatCard label="Total Value" value={totalValue.toLocaleString()} prefix="$" sub="across all stock" color="var(--green)" />
        <StatCard label="Out of Stock" value={outOfStock} sub="need restock" color="var(--red)" />
        <StatCard label="Low Stock" value={lowStock} sub="below 5 units" color="var(--amber)" />
      </div>

      <div style={s.bottom}>
        {/* Low Stock Alerts */}
        <div style={s.section}>
          <div style={s.sectionTitle}>
            <span>Stock Alerts</span>
            <Link to="/products" style={s.sectionLink}>VIEW ALL →</Link>
          </div>
          {lowStockItems.length === 0 ? (
            <div style={s.empty}>All products well stocked ✓</div>
          ) : (
            lowStockItems.map((p, i) => (
              <div key={p.id} style={{ ...s.tableRow, borderBottom: i === lowStockItems.length - 1 ? 'none' : '1px solid var(--border)' }}>
                <div>
                  <div style={s.rowName}>{p.name}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-faint)', marginTop: 2 }}>{p.sku || 'No SKU'}</div>
                </div>
                <StockBadge stock={p.stock} />
                <div style={s.price}>${p.price}</div>
              </div>
            ))
          )}
        </div>

        {/* Chart */}
        <div style={s.section}>
          <div style={s.sectionTitle}>
            <span>Stock by Product</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-faint)' }}>TOP 6</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <XAxis dataKey="name" tick={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: 'var(--text-faint)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: 'var(--text-faint)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--accent-dim)' }} />
              <Bar dataKey="stock" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.stock === 0 ? 'var(--red)' : entry.stock < 5 ? 'var(--amber)' : 'var(--accent)'} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
