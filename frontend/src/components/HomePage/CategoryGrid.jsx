import React from 'react';
import CategoryCard from './CategoryCard';
import Loader from '../Loader';
import styles from './CategoryGrid.module.css';

export default function CategoryGrid({ categories, loading }) {
  if (loading) {
    return <Loader />;
  }

  return (
    <div className={styles.categoryGrid}>
      {categories.map((category) => (
        <CategoryCard category={category} key={category.id} />
      ))}
    </div>
  );
}
