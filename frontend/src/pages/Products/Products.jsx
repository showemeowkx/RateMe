import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProductsGrid from '../../components/ProductsPage/ProductsGrid';
import { fetchProducts } from '../../services/api';
import styles from './Products.module.css';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts()
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  }, []);

  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div>
      <Header />
      <ProductsGrid products={products} />
      <Footer />
    </div>
  );
}
