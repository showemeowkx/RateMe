import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductsCard from './ProductsCard';
import Loader from '../Loader';
import styles from './ProductsGrid.module.css';
import { fetchProducts } from '../../services/products/productsFetch';
import { productGen } from '../../utilities/productsLoading';
import { asyncDecorator } from '../../utilities/asyncDecorator';
const SORT_OPTIONS = {
  BEST: '★ Найкращі',
  WORST: '☆ Найгірші',
};

const useQueryParams = () => {
  const query = new URLSearchParams(useLocation().search);
  return {
    search: query.get('search')?.toLowerCase() || '',
    category: query.get('category')?.toLowerCase() || '',
    minRating: query.get('minRating'),
    maxRating: query.get('maxRating'),
  };
};

export default function ProductsGrid() {
  const {
    search,
    category,
    minRating: minRatingQuery,
    maxRating: maxRatingQuery,
  } = useQueryParams();
  const navigate = useNavigate();

  const initialMinRating = minRatingQuery !== null ? Number(minRatingQuery) : 0;
  const initialMaxRating =
    maxRatingQuery !== null ? Number(maxRatingQuery) : 100;

  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [iterator, setIterator] = useState(null);

  const [minRating, setMinRating] = useState(initialMinRating);
  const [maxRating, setMaxRating] = useState(initialMaxRating);
  const [tempMinRating, setTempMinRating] = useState(initialMinRating);
  const [tempMaxRating, setTempMaxRating] = useState(initialMaxRating);

  const [sorting, setSorting] = useState(SORT_OPTIONS.BEST);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showContent, setShowContent] = useState(false);

  const PRODUCTS_BATCH = 35;

  useEffect(() => {
    setMinRating(initialMinRating);
    setMaxRating(initialMaxRating);
    setTempMinRating(initialMinRating);
    setTempMaxRating(initialMaxRating);
  }, [initialMinRating, initialMaxRating]);

  const fetchProductsWithStatus = useMemo(
    () =>
      asyncDecorator(fetchProducts, {
        onStart: () => {
          setLoading(true);
          setError(null);
          setShowContent(false);
        },
        onSuccess: (data) => setProducts(data),
        onError: (err) => setError(err.message),
        onFinish: () => {
          setLoading(false);
          setTimeout(() => setShowContent(true), 150);
        },
      }),
    [setLoading, setError, setProducts, setShowContent]
  );

  useEffect(() => {
    fetchProductsWithStatus(category, search, minRating, maxRating);
  }, [category, search, minRating, maxRating, fetchProductsWithStatus]);

  const sortedProducts = useMemo(() => {
    const sortFn =
      sorting === SORT_OPTIONS.BEST
        ? (a, b) => b.rating - a.rating
        : (a, b) => a.rating - b.rating;
    return [...products].sort(sortFn);
  }, [products, sorting]);

  useEffect(() => {
    const initIter = async () => {
      const gen = productGen(sortedProducts, PRODUCTS_BATCH);
      setIterator(gen);
      const { value } = await gen.next();
      setVisibleProducts(value || []);
    };
    initIter();
  }, [sortedProducts]);

  const loadMore = async () => {
    if (!iterator) return;
    const { value, done } = await iterator.next();
    if (!done && value) {
      setVisibleProducts((current) => [...current, ...value]);
    }
  };

  const handleRatingApply = () => {
    setMinRating(tempMinRating);
    setMaxRating(tempMaxRating);

    const params = new URLSearchParams(window.location.search);
    params.set('minRating', tempMinRating);
    params.set('maxRating', tempMaxRating);

    navigate({ search: params.toString() }, { replace: true });
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
          <button onClick={handleRatingApply} disabled={isApplyDisabled}>
            Apply
          </button>
        </div>

        <div className={styles.sorting}>
          <label>Сортування</label>
          <select
            className={styles.dropdown}
            value={sorting}
            onChange={(e) => setSorting(e.target.value)}
          >
            {Object.values(SORT_OPTIONS).map((label) => (
              <option key={label} value={label}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : showContent ? (
        sortedProducts.length > 0 ? (
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
        )
      ) : null}
    </div>
  );
}
