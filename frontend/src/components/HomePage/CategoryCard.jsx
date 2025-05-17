import React from 'react';
import styles from './CategoryCard.module.css';
import { Link } from 'react-router-dom';

export default function CategoryCard({ category }) {
  return (
    <Link to={`/products?category=${category.slug}`} key={category.id}>
      <div className={styles.category}>
        <button
          className={styles.categoryButton}
          style={{ backgroundColor: category.color }}
        >
          <img
            className={styles.categoryImg}
            src={`data/images/categories/${category.image}`}
            alt={category.title}
          />
          <div className={styles.categoryTitle}>
            <h3>{category.title}</h3>
          </div>
        </button>
      </div>
    </Link>
  );
}
