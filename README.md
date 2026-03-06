# Inventory Management App

A modern React-based inventory management system with a dark UI.

## Features
- **Dashboard** — stats overview (total products, total value, out-of-stock count, low-stock alerts) + stock chart
- **Product List** — search, filter by category, sort by any column, delete with confirmation modal
- **Add Product** — form with validation, SKU, category, description fields
- **Edit Product** — pre-filled form, update any field
- **Local Storage** — all data persists in the browser (no backend required)

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm start
```

App runs at **http://localhost:3000**

## Project Structure

```
src/
  components/
    Navbar.jsx
    AddProduct.jsx
    EditProduct.jsx
  pages/
    Dashboard.jsx
    ProductPage.jsx
  services/
    productService.js   ← swap API_URL here for a real backend
  App.js
  index.js
  index.css
```

## Connecting a Real Backend

Edit `src/services/productService.js` — replace the localStorage logic with axios/fetch calls to your API.
