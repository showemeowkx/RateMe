import React from 'react';
import CategoryCard from './CategoryCard';
import styles from './CategoryGrid.module.css';

export default function CategoryGrid({ categories }) {
  return (
    <div className={styles.categoryGrid}>
      {categories.map((category) => (
        <CategoryCard category={category} key={category.id} />
      ))}
    </div>
  );
}
