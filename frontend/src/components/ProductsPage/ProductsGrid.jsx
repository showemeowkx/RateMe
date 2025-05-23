import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductsCard from './ProductsCard';
import styles from './ProductsGrid.module.css';
import { productGen } from '../../utilities/productsLoading';
import { fetchProducts } from '../../services/api';

const ProductSortKind = {
  BEST: '★ Найкращі',
  WORST: '☆ Найгірші',
};

const useQuery = () => new URLSearchParams(useLocation().search);

export default function ProductsGrid() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [sorting, setSorting] = useState(ProductSortKind.BEST);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [iterator, setIterator] = useState(null);
  const query = useQuery().get('search')?.toLowerCase() || '';
  const category = useQuery().get('category')?.toLowerCase() || '';
  const productsAmount = 35;

  useEffect(() => {
    fetchProducts(category)
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  }, [category]);

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

  useEffect(() => {
    const initIter = async () => {
      const gen = productGen(sortedProducts, productsAmount);
      setIterator(gen);
      const { value } = await gen.next();
      setVisibleProducts(value || []);
    };
    initIter();
  }, [sortedProducts]);

  const loadMore = async () => {
    if (!iterator) return;
    const { value, done } = await iterator.next();
    if (!done && value) setVisibleProducts((current) => [...current, ...value]);
  };

  if (error) return <div className={styles.error}>Error: {error}</div>;

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
            {visibleProducts.map((product) => (
              <ProductsCard product={product} key={product.id} />
            ))}
          </div>
          {visibleProducts.length < sortedProducts.length && (
            <button className={styles.loadMoreBtn} onClick={loadMore}>
              Завантажити ще
            </button>
          )}
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
