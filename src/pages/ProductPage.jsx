import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts, deleteProduct } from '../services/productService';

const s = {
  page: { padding: '40px 32px', maxWidth: 1200, margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 },
  eyebrow: { fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 },
  title: { fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em' },
  count: { fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-dim)' },

  toolbar: {
    display: 'flex', gap: 12, marginBottom: 24, alignItems: 'center', flexWrap: 'wrap',
  },
  searchWrap: { flex: 1, minWidth: 200, position: 'relative' },
  searchIcon: { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)', fontSize: 14, pointerEvents: 'none' },
  input: {
    width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)', padding: '10px 12px 10px 36px',
    color: 'var(--text)', fontFamily: 'var(--font-display)', fontSize: 13,
    outline: 'none', transition: 'border-color var(--transition)',
  },
  select: {
    background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)', padding: '10px 14px',
    color: 'var(--text)', fontFamily: 'var(--font-display)', fontSize: 13,
    outline: 'none', cursor: 'pointer', minWidth: 130,
  },

  table: { width: '100%', borderCollapse: 'separate', borderSpacing: 0 },
  th: {
    fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)',
    letterSpacing: '0.08em', textTransform: 'uppercase', padding: '12px 16px',
    textAlign: 'left', borderBottom: '1px solid var(--border)',
    cursor: 'pointer', userSelect: 'none',
    transition: 'color var(--transition)',
  },
  tr: {
    transition: 'background var(--transition)',
  },
  td: {
    padding: '14px 16px', borderBottom: '1px solid var(--border)',
    verticalAlign: 'middle',
  },
  prodName: { fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 2 },
  prodDesc: { fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-faint)' },
  sku: { fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-faint)' },
  price: { fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 500, color: 'var(--text)' },
  catBadge: { fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 6, background: 'var(--accent-dim)', color: 'var(--accent)', display: 'inline-block' },
  badge: { fontFamily: 'var(--font-mono)', fontSize: 12, padding: '3px 10px', borderRadius: 6, fontWeight: 500 },

  actions: { display: 'flex', gap: 8 },
  editBtn: {
    fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 600,
    padding: '6px 14px', borderRadius: 6, background: 'var(--accent-dim)',
    color: 'var(--accent)', border: '1px solid var(--accent-glow)',
    textDecoration: 'none', cursor: 'pointer', transition: 'all var(--transition)',
    display: 'inline-flex', alignItems: 'center', gap: 4,
  },
  deleteBtn: {
    fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 600,
    padding: '6px 14px', borderRadius: 6, background: 'var(--red-dim)',
    color: 'var(--red)', border: '1px solid transparent',
    cursor: 'pointer', transition: 'all var(--transition)', display: 'inline-flex', alignItems: 'center', gap: 4,
  },
  emptyState: { textAlign: 'center', padding: '80px 0', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)', fontSize: 14 },
  addBtn: {
    fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 600,
    padding: '10px 18px', borderRadius: 8, background: 'var(--accent)',
    color: '#fff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6,
    boxShadow: '0 0 20px var(--accent-glow)', transition: 'all var(--transition)',
  },

  modal: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200,
    backdropFilter: 'blur(6px)',
  },
  modalBox: {
    background: 'var(--bg-card)', border: '1px solid var(--border-bright)',
    borderRadius: 'var(--radius)', padding: 32, maxWidth: 380, width: '90%',
  },
  modalTitle: { fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 8 },
  modalSub: { fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--text-dim)', marginBottom: 28 },
  modalActions: { display: 'flex', gap: 12, justifyContent: 'flex-end' },
  cancelBtn: {
    fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 600,
    padding: '8px 18px', borderRadius: 8, background: 'transparent',
    color: 'var(--text-dim)', border: '1px solid var(--border)', cursor: 'pointer',
  },
  confirmBtn: {
    fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 600,
    padding: '8px 18px', borderRadius: 8, background: 'var(--red)',
    color: '#fff', border: 'none', cursor: 'pointer',
  },
};

const StockBadge = ({ stock }) => {
  const cfg = stock === 0
    ? { bg: 'var(--red-dim)', color: 'var(--red)', label: 'Out of Stock' }
    : stock < 5
    ? { bg: 'var(--amber-dim)', color: 'var(--amber)', label: `${stock} — Low` }
    : { bg: 'var(--green-dim)', color: 'var(--green)', label: `${stock} In Stock` };
  return <span style={{ ...s.badge, background: cfg.bg, color: cfg.color }}>{cfg.label}</span>;
};

const SORTS = ['name', 'price', 'stock', 'category'];

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    fetchProducts().then(data => { setProducts(data); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  const handleSort = (col) => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir('asc'); }
  };

  const filtered = products
    .filter(p => {
      const q = search.toLowerCase();
      return (p.name?.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q));
    })
    .filter(p => categoryFilter === 'All' || p.category === categoryFilter)
    .sort((a, b) => {
      let av = a[sortBy], bv = b[sortBy];
      if (typeof av === 'string') av = av.toLowerCase();
      if (typeof bv === 'string') bv = bv.toLowerCase();
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

  const confirmDelete = () => {
    setDeleting(true);
    deleteProduct(deleteModal.id).then(() => {
      setProducts(prev => prev.filter(p => p.id !== deleteModal.id));
      setDeleteModal(null);
      setDeleting(false);
    });
  };

  const sortArrow = (col) => sortBy === col ? (sortDir === 'asc' ? ' ↑' : ' ↓') : '';

  if (loading) return <div style={{ ...s.page, ...s.emptyState }}>Loading products...</div>;

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <div style={s.eyebrow}>Catalog</div>
          <h1 style={s.title}>Products</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={s.count}>{filtered.length} of {products.length} items</span>
          <Link
            to="/add-product"
            style={s.addBtn}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
          >
            <span style={{ fontSize: 16 }}>+</span> New Product
          </Link>
        </div>
      </div>

      <div style={s.toolbar}>
        <div style={s.searchWrap}>
          <span style={s.searchIcon}>⌕</span>
          <input
            style={s.input}
            placeholder="Search by name, SKU, category…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
        </div>
        <select style={s.select} value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select style={s.select} value={sortBy} onChange={e => setSortBy(e.target.value)}>
          {SORTS.map(s => <option key={s} value={s}>Sort: {s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        <button
          style={{ ...s.select, cursor: 'pointer', minWidth: 'auto', padding: '10px 16px' }}
          onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')}
        >
          {sortDir === 'asc' ? '↑ Asc' : '↓ Desc'}
        </button>
      </div>

      {filtered.length === 0 ? (
        <div style={s.emptyState}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⬡</div>
          <div>No products found</div>
        </div>
      ) : (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
          <table style={s.table}>
            <thead>
              <tr>
                {[['name', 'Product'], ['sku', 'SKU'], ['category', 'Category'], ['price', 'Price'], ['stock', 'Stock']].map(([col, label]) => (
                  <th
                    key={col}
                    style={s.th}
                    onClick={() => handleSort(col)}
                    onMouseEnter={e => e.target.style.color = 'var(--text)'}
                    onMouseLeave={e => e.target.style.color = 'var(--text-dim)'}
                  >
                    {label}{sortArrow(col)}
                  </th>
                ))}
                <th style={{ ...s.th, cursor: 'default' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product, i) => (
                <tr
                  key={product.id}
                  style={i % 2 === 0 ? s.tr : { ...s.tr }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={s.td}>
                    <div style={s.prodName}>{product.name}</div>
                    {product.description && <div style={s.prodDesc}>{product.description}</div>}
                  </td>
                  <td style={s.td}><span style={s.sku}>{product.sku || '—'}</span></td>
                  <td style={s.td}>{product.category ? <span style={s.catBadge}>{product.category}</span> : '—'}</td>
                  <td style={s.td}><span style={s.price}>${Number(product.price).toFixed(2)}</span></td>
                  <td style={s.td}><StockBadge stock={product.stock} /></td>
                  <td style={s.td}>
                    <div style={s.actions}>
                      <Link
                        to={`/edit-product/${product.id}`}
                        style={s.editBtn}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent-dim)'; e.currentTarget.style.color = 'var(--accent)'; }}
                      >
                        ✎ Edit
                      </Link>
                      <button
                        style={s.deleteBtn}
                        onClick={() => setDeleteModal(product)}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--red)'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'var(--red-dim)'; e.currentTarget.style.color = 'var(--red)'; }}
                      >
                        ✕ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div style={s.modal} onClick={() => setDeleteModal(null)}>
          <div style={s.modalBox} onClick={e => e.stopPropagation()}>
            <div style={s.modalTitle}>Delete Product?</div>
            <div style={s.modalSub}>
              Are you sure you want to delete <strong style={{ color: 'var(--text)' }}>{deleteModal.name}</strong>? This action cannot be undone.
            </div>
            <div style={s.modalActions}>
              <button style={s.cancelBtn} onClick={() => setDeleteModal(null)}>Cancel</button>
              <button style={s.confirmBtn} onClick={confirmDelete} disabled={deleting}>
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
