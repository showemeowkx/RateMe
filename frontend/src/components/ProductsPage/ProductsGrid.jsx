import React from 'react';
import ProductsCard from './ProductsCard';
import styles from './ProductsGrid.module.css';

export default function ProductsGrid({ products }) {
  return (
    <div className={styles.productGrid}>
      {products.map((product) => (
        <ProductsCard product={product} key={product.id} />
      ))}
    </div>
  );
}
