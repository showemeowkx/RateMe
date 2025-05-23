import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import CategoryGrid from '../../components/HomePage/CategoryGrid';
import fetchCategories from '../../services/api';
import styles from './Home.module.css';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories()
      .then((data) => {
        setCategories(data);
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
      <CategoryGrid categories={categories} />
      <Footer />
    </div>
  );
}
