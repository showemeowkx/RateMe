import React from 'react';
import styles from './ProductsCard.module.css';
import { Link } from 'react-router-dom';

export default function ProductsCard({ product }) {
  return (
    <Link to={`/products/${product.id}`} className={styles.product}>
      <div className={styles.productButton}>
        <div className={styles.imgContainer}>
          <img
            className={styles.productImg}
            src={product.imagePath}
            alt={product.name}
          />
        </div>
        <div className={styles.textContainer}>
          <div className={styles.productTitle} title={product.name}>
            {product.name}
          </div>
          <div className={styles.productRating}>Rating: {product.rating}</div>
        </div>
      </div>
    </Link>
  );
}
