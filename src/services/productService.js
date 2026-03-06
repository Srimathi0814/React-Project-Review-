const STORAGE_KEY = 'inventory_products';

const SEED_DATA = [
  { id: '1', name: 'MacBook Pro 14"', category: 'Electronics', price: 1999, stock: 12, sku: 'MBP-14-001', description: 'Apple M3 Pro chip, 18GB RAM' },
  { id: '2', name: 'Mechanical Keyboard', category: 'Accessories', price: 149, stock: 45, sku: 'KB-MECH-002', description: 'TKL layout, Cherry MX switches' },
  { id: '3', name: 'USB-C Hub 7-in-1', category: 'Accessories', price: 59, stock: 3, sku: 'HUB-7C-003', description: 'HDMI 4K, 100W PD, USB 3.0' },
  { id: '4', name: 'Ergonomic Chair', category: 'Furniture', price: 599, stock: 8, sku: 'CHR-ERG-004', description: 'Lumbar support, adjustable armrests' },
  { id: '5', name: 'Monitor 27" 4K', category: 'Electronics', price: 699, stock: 0, sku: 'MON-27-005', description: 'IPS panel, 144Hz, HDR600' },
  { id: '6', name: 'Wireless Mouse', category: 'Accessories', price: 79, stock: 60, sku: 'MS-WRL-006', description: 'Ergonomic design, 70hr battery' },
];

function getProducts() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
    return SEED_DATA;
  } catch {
    return SEED_DATA;
  }
}

function saveProducts(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

export const fetchProducts = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getProducts()), 150);
  });
};

export const fetchProductById = (id) => {
  return new Promise((resolve, reject) => {
    const products = getProducts();
    const product = products.find(p => p.id === id);
    if (product) resolve(product);
    else reject(new Error('Product not found'));
  });
};

export const addProduct = (product) => {
  return new Promise((resolve) => {
    const products = getProducts();
    const newProduct = {
      ...product,
      id: Date.now().toString(),
      price: parseFloat(product.price),
      stock: parseInt(product.stock),
    };
    products.push(newProduct);
    saveProducts(products);
    setTimeout(() => resolve(newProduct), 200);
  });
};

export const updateProduct = (id, updates) => {
  return new Promise((resolve, reject) => {
    const products = getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return reject(new Error('Product not found'));
    products[index] = {
      ...products[index],
      ...updates,
      id,
      price: parseFloat(updates.price),
      stock: parseInt(updates.stock),
    };
    saveProducts(products);
    setTimeout(() => resolve(products[index]), 200);
  });
};

export const deleteProduct = (id) => {
  return new Promise((resolve) => {
    const products = getProducts();
    saveProducts(products.filter(p => p.id !== id));
    setTimeout(() => resolve(), 150);
  });
};
