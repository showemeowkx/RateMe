import { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import ProductsCard from './ProductsCard';
import styles from './ProductsGrid.module.css';

export const ProductSortKind = {
  BEST: '★ Найкращі',
  WORST: '☆ Найгірші',
};

const useQuery = () => new URLSearchParams(useLocation().search);

export default function ProductsGrid({ products }) {
  const [sorting, setSorting] = useState(ProductSortKind.BEST);
  const query = useQuery().get('search')?.toLowerCase() || '';

  const handleSortingChange = (e) => {
    setSorting(e.target.value);
  };

  const matchesSorting = (sort) => {
    if (sort === ProductSortKind.BEST) return (a, b) => b.rating - a.rating;
    if (sort === ProductSortKind.WORST) return (a, b) => a.rating - b.rating;
    return () => 0;
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(query)
    );
  }, [products, query]);

  const sortedProducts = useMemo(() => {
    const sortingFn = matchesSorting(sorting);
    return [...filteredProducts].sort(sortingFn);
  }, [filteredProducts, sorting]);

  return (
    <>
      {sortedProducts.length ? (
        <div>
          <div className={styles.sorting}>
            <label>Сортування</label>
            <select
              className={styles.dropdown}
              value={sorting}
              onChange={handleSortingChange}
            >
              <option value={ProductSortKind.BEST}>
                {ProductSortKind.BEST}
              </option>
              <option value={ProductSortKind.WORST}>
                {ProductSortKind.WORST}
              </option>
            </select>
          </div>
          <div className={styles.productGrid}>
            {sortedProducts.map((product) => (
              <ProductsCard product={product} key={product.id} />
            ))}
          </div>
        </div>
      ) : (
        <img
          src='/assets/not_searchable.jpg'
          alt='not_searchable'
          className={styles.defaultImg}
        />
      )}
    </>
  );
}
