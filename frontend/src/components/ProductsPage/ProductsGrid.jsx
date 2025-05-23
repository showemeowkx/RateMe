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
  const [minRating, setMinRating] = useState(0);
  const [maxRating, setMaxRating] = useState(100);
  const [tempMinRating, setTempMinRating] = useState(0);
  const [tempMaxRating, setTempMaxRating] = useState(100);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [sorting, setSorting] = useState(ProductSortKind.BEST);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [iterator, setIterator] = useState(null);
  const search = useQuery().get('search')?.toLowerCase() || '';
  const category = useQuery().get('category')?.toLowerCase() || '';
  const productsAmount = 35;

  useEffect(() => {
    fetchProducts(category, search, minRating, maxRating)
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  }, [category, search, minRating, maxRating]);

  const handleSortingChange = (e) => {
    setSorting(e.target.value);
  };

  const matchesSorting = (sort) => {
    if (sort === ProductSortKind.BEST) return (a, b) => b.rating - a.rating;
    if (sort === ProductSortKind.WORST) return (a, b) => a.rating - b.rating;
    return () => 0;
  };

  const sortedProducts = useMemo(() => {
    const sortingFn = matchesSorting(sorting);
    return [...products].sort(sortingFn);
  }, [products, sorting]);

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

  const handleApplyRating = () => {
    setMinRating(tempMinRating);
    setMaxRating(tempMaxRating);
  };

  const isApplyDisabled =
    tempMinRating > tempMaxRating || tempMinRating < 0 || tempMaxRating > 100;

  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div>
      <div className={styles.controls}>
        <div className={styles.ratingFilter}>
          <label>
            Min Rating:
            <input
              type='number'
              value={tempMinRating}
              min={0}
              max={100}
              onChange={(e) => setTempMinRating(Number(e.target.value))}
            />
          </label>

          <label>
            Max Rating:
            <input
              type='number'
              value={tempMaxRating}
              min={0}
              max={100}
              onChange={(e) => setTempMaxRating(Number(e.target.value))}
            />
          </label>

          <button onClick={handleApplyRating} disabled={isApplyDisabled}>
            Apply
          </button>
        </div>
        <div className={styles.sorting}>
          <label>Сортування</label>
          <select
            className={styles.dropdown}
            value={sorting}
            onChange={handleSortingChange}
          >
            <option value={ProductSortKind.BEST}>{ProductSortKind.BEST}</option>
            <option value={ProductSortKind.WORST}>
              {ProductSortKind.WORST}
            </option>
          </select>
        </div>
      </div>
      {sortedProducts.length ? (
        <div>
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
    </div>
  );
}
