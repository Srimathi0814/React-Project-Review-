import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import ProductPage from './pages/ProductPage';
import AddProduct from './components/AddProduct';
import EditProduct from './components/EditProduct';

const App = () => {
  return (
    <Router>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/edit-product/:id" element={<EditProduct />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
