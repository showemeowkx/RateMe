import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import CategoryGrid from '../../components/HomePage/CategoryGrid';
import { fetchCategories } from '../../services/categories/categoriesFetch';
import styles from './Home.module.css';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchCategories()
      .then((data) => {
        setCategories(data);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setCategories([]);
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 150);
      });
  }, []);

  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Header />
      <main style={{ flex: 1 }}>
        <CategoryGrid categories={categories} loading={loading} />
      </main>
      <Footer />
    </div>
  );
}
