import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { addProduct } from '../services/productService';

const CATEGORIES = ['Electronics', 'Accessories', 'Furniture', 'Clothing', 'Food & Beverage', 'Tools', 'Other'];

const s = {
  page: { padding: '40px 32px', maxWidth: 700, margin: '0 auto' },
  back: {
    fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-dim)',
    textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6,
    marginBottom: 28, letterSpacing: '0.05em',
    transition: 'color var(--transition)',
  },
  eyebrow: { fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 },
  title: { fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em', marginBottom: 32 },

  card: {
    background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', padding: 32,
  },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
  field: { marginBottom: 20 },
  label: { fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8, display: 'block' },
  input: {
    width: '100%', background: 'var(--bg)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)', padding: '12px 14px',
    color: 'var(--text)', fontFamily: 'var(--font-display)', fontSize: 14,
    outline: 'none', transition: 'border-color var(--transition)', boxSizing: 'border-box',
  },
  select: {
    width: '100%', background: 'var(--bg)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)', padding: '12px 14px',
    color: 'var(--text)', fontFamily: 'var(--font-display)', fontSize: 14,
    outline: 'none', cursor: 'pointer', boxSizing: 'border-box',
  },
  textarea: {
    width: '100%', background: 'var(--bg)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)', padding: '12px 14px',
    color: 'var(--text)', fontFamily: 'var(--font-display)', fontSize: 14,
    outline: 'none', transition: 'border-color var(--transition)', resize: 'vertical',
    minHeight: 80, boxSizing: 'border-box',
  },
  divider: { borderTop: '1px solid var(--border)', margin: '8px 0 24px' },
  footer: { display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 28 },
  cancelBtn: {
    fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600,
    padding: '12px 24px', borderRadius: 8, background: 'transparent',
    color: 'var(--text-dim)', border: '1px solid var(--border)',
    cursor: 'pointer', textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
    transition: 'all var(--transition)',
  },
  submitBtn: {
    fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700,
    padding: '12px 28px', borderRadius: 8, background: 'var(--accent)',
    color: '#fff', border: 'none', cursor: 'pointer',
    boxShadow: '0 0 20px var(--accent-glow)', transition: 'all var(--transition)',
    display: 'inline-flex', alignItems: 'center', gap: 8,
  },
  error: { fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--red)', marginTop: 6 },
  success: {
    background: 'var(--green-dim)', border: '1px solid var(--green)',
    borderRadius: 8, padding: '12px 16px', marginBottom: 20,
    fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--green)',
    display: 'flex', alignItems: 'center', gap: 8,
  },
};

const INIT = { name: '', sku: '', price: '', stock: '', category: '', description: '' };

const AddProduct = () => {
  const [form, setForm] = useState(INIT);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Product name is required';
    if (!form.price || isNaN(form.price) || Number(form.price) < 0) e.price = 'Valid price required';
    if (!form.stock || isNaN(form.stock) || Number(form.stock) < 0) e.stock = 'Valid stock quantity required';
    if (!form.category) e.category = 'Please select a category';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(ev => ({ ...ev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setLoading(true);
    addProduct(form)
      .then(() => {
        setSuccess(true);
        setTimeout(() => navigate('/products'), 1000);
      })
      .catch(() => { setLoading(false); });
  };

  const focusStyle = (e) => { e.target.style.borderColor = 'var(--accent)'; };
  const blurStyle = (e) => { e.target.style.borderColor = errors[e.target.name] ? 'var(--red)' : 'var(--border)'; };

  return (
    <div style={s.page}>
      <Link
        to="/products"
        style={s.back}
        onMouseEnter={e => e.target.style.color = 'var(--accent)'}
        onMouseLeave={e => e.target.style.color = 'var(--text-dim)'}
      >
        ← Back to Products
      </Link>

      <div style={s.eyebrow}>Catalog</div>
      <h1 style={s.title}>Add New Product</h1>

      <div style={s.card}>
        {success && (
          <div style={s.success}>
            <span>✓</span> Product added successfully! Redirecting…
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Basic Info */}
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-faint)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>Basic Information</div>
          <div style={s.divider} />

          <div style={s.grid2}>
            <div style={s.field}>
              <label style={{ ...s.label, color: errors.name ? 'var(--red)' : 'var(--text-dim)' }}>Product Name *</label>
              <input
                name="name" value={form.name} onChange={handleChange}
                onFocus={focusStyle} onBlur={blurStyle}
                placeholder="e.g. MacBook Pro 14"
                style={{ ...s.input, borderColor: errors.name ? 'var(--red)' : 'var(--border)' }}
              />
              {errors.name && <div style={s.error}>{errors.name}</div>}
            </div>
            <div style={s.field}>
              <label style={s.label}>SKU / Code</label>
              <input
                name="sku" value={form.sku} onChange={handleChange}
                onFocus={focusStyle} onBlur={e => { e.target.style.borderColor = 'var(--border)'; }}
                placeholder="e.g. MBP-14-001"
                style={s.input}
              />
            </div>
          </div>

          <div style={s.field}>
            <label style={{ ...s.label, color: errors.category ? 'var(--red)' : 'var(--text-dim)' }}>Category *</label>
            <select
              name="category" value={form.category} onChange={handleChange}
              style={{ ...s.select, borderColor: errors.category ? 'var(--red)' : 'var(--border)' }}
            >
              <option value="">Select a category</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.category && <div style={s.error}>{errors.category}</div>}
          </div>

          <div style={s.field}>
            <label style={s.label}>Description</label>
            <textarea
              name="description" value={form.description} onChange={handleChange}
              onFocus={focusStyle} onBlur={e => { e.target.style.borderColor = 'var(--border)'; }}
              placeholder="Brief product description…"
              style={s.textarea}
            />
          </div>

          {/* Pricing */}
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-faint)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16, marginTop: 8 }}>Pricing & Stock</div>
          <div style={s.divider} />

          <div style={s.grid2}>
            <div style={s.field}>
              <label style={{ ...s.label, color: errors.price ? 'var(--red)' : 'var(--text-dim)' }}>Price (USD) *</label>
              <input
                type="number" name="price" value={form.price} onChange={handleChange}
                onFocus={focusStyle} onBlur={blurStyle}
                placeholder="0.00" min="0" step="0.01"
                style={{ ...s.input, borderColor: errors.price ? 'var(--red)' : 'var(--border)' }}
              />
              {errors.price && <div style={s.error}>{errors.price}</div>}
            </div>
            <div style={s.field}>
              <label style={{ ...s.label, color: errors.stock ? 'var(--red)' : 'var(--text-dim)' }}>Stock Quantity *</label>
              <input
                type="number" name="stock" value={form.stock} onChange={handleChange}
                onFocus={focusStyle} onBlur={blurStyle}
                placeholder="0" min="0"
                style={{ ...s.input, borderColor: errors.stock ? 'var(--red)' : 'var(--border)' }}
              />
              {errors.stock && <div style={s.error}>{errors.stock}</div>}
            </div>
          </div>

          <div style={s.footer}>
            <Link
              to="/products"
              style={s.cancelBtn}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-bright)'; e.currentTarget.style.color = 'var(--text)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-dim)'; }}
            >
              Cancel
            </Link>
            <button
              type="submit"
              style={s.submitBtn}
              disabled={loading}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 30px var(--accent-glow)'; }}}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 0 20px var(--accent-glow)'; }}
            >
              {loading ? '⟳ Adding…' : '+ Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
