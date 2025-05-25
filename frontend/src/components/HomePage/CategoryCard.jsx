import React from 'react';
import styles from './CategoryCard.module.css';
import { Link } from 'react-router-dom';

export default function CategoryCard({ category }) {
  return (
    <Link className={styles.link} to={`/products?category=${category.slug}`}>
      <div
        className={styles.categoryButton}
        key={category.id}
        style={{ backgroundColor: category.color }}
      >
        <img
          className={styles.categoryImg}
          src={category.imagePath}
          alt={category.name}
        />
        <div className={styles.categoryTitle}>
          <h3>{category.name}</h3>
        </div>
      </div>
    </Link>
  );
}
