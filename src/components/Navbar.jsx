import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const styles = {
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    background: 'rgba(10,10,15,0.85)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid var(--border)',
    padding: '0 32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 64,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    textDecoration: 'none',
  },
  logo: {
    width: 32,
    height: 32,
    background: 'var(--accent)',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    fontWeight: 800,
    color: '#fff',
    fontFamily: 'var(--font-display)',
    boxShadow: '0 0 20px var(--accent-glow)',
  },
  brandName: {
    fontFamily: 'var(--font-display)',
    fontSize: 16,
    fontWeight: 700,
    color: 'var(--text)',
    letterSpacing: '-0.02em',
  },
  brandSub: {
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    color: 'var(--text-dim)',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    listStyle: 'none',
  },
  link: {
    fontFamily: 'var(--font-display)',
    fontSize: 13,
    fontWeight: 500,
    padding: '7px 14px',
    borderRadius: 8,
    textDecoration: 'none',
    color: 'var(--text-dim)',
    transition: 'all var(--transition)',
    letterSpacing: '-0.01em',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  linkActive: {
    color: 'var(--text)',
    background: 'var(--accent-dim)',
    boxShadow: 'inset 0 0 0 1px var(--accent-glow)',
  },
  addBtn: {
    fontFamily: 'var(--font-display)',
    fontSize: 13,
    fontWeight: 600,
    padding: '8px 16px',
    borderRadius: 8,
    background: 'var(--accent)',
    color: '#fff',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    boxShadow: '0 0 20px var(--accent-glow)',
    transition: 'all var(--transition)',
  },
};

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: '⬡' },
  { to: '/products', label: 'Products', icon: '▤' },
];

const Navbar = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav style={{ ...styles.nav, borderBottomColor: scrolled ? 'var(--border-bright)' : 'var(--border)' }}>
      <Link to="/" style={styles.brand}>
        <div style={styles.logo}>I</div>
        <div>
          <div style={styles.brandName}>Inventory</div>
          <div style={styles.brandSub}>Management</div>
        </div>
      </Link>

      <ul style={styles.links}>
        {NAV_ITEMS.map(({ to, label, icon }) => {
          const isActive = location.pathname === to;
          return (
            <li key={to}>
              <Link
                to={to}
                style={{ ...styles.link, ...(isActive ? styles.linkActive : {}) }}
                onMouseEnter={e => { if (!isActive) { e.target.style.color = 'var(--text)'; e.target.style.background = 'var(--bg-hover)'; }}}
                onMouseLeave={e => { if (!isActive) { e.target.style.color = 'var(--text-dim)'; e.target.style.background = 'transparent'; }}}
              >
                <span style={{ fontSize: 14 }}>{icon}</span> {label}
              </Link>
            </li>
          );
        })}
      </ul>

      <Link
        to="/add-product"
        style={styles.addBtn}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 30px var(--accent-glow)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 0 20px var(--accent-glow)'; }}
      >
        <span style={{ fontSize: 16 }}>+</span> Add Product
      </Link>
    </nav>
  );
};

export default Navbar;
