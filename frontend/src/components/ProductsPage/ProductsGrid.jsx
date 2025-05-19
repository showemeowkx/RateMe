import { useState, useMemo } from 'react';
import ProductsCard from './ProductsCard';
import styles from './ProductsGrid.module.css';

export default function ProductsGrid({ products }) {
  const [sorting, setSorting] = useState('★ Найкращі');

  const handleSortingChange = (e) => {
    setSorting(e.target.value);
  };

  const matchesSorting = (sort) => {
    if (sort === '★ Найкращі') return (a, b) => b.rating - a.rating;
    if (sort === '☆ Найгірші') return (a, b) => a.rating - b.rating;
    return () => 0;
  };

  const sortedProducts = useMemo(() => {
    const sortingFn = matchesSorting(sorting);
    return [...products].sort(sortingFn);
  }, [products, sorting]);

  return (
    <div>
      <div>
        <label>Сортування</label>
        <select value={sorting} onChange={handleSortingChange}>
          <option value='★ Найкращі'>★ Найкращі</option>
          <option value='☆ Найгірші'>☆ Найгірші</option>
        </select>
      </div>
      <div className={styles.productGrid}>
        {sortedProducts.map((product) => (
          <ProductsCard product={product} key={product.id} />
        ))}
      </div>
    </div>
  );
}
