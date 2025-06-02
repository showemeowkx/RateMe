import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductsCard from './ProductsCard';
import Loader from '../Loader';
import styles from './ProductsGrid.module.css';
import { fetchProducts } from '../../services/products/productsFetch';
import { asyncDecorator } from '../../utilities/asyncDecorator';

const SORT_OPTIONS = {
  BEST: '★ Найкращі',
  WORST: '☆ Найгірші',
};

const SORTING_REQUEST = {
  [SORT_OPTIONS.BEST]: 'DESC',
  [SORT_OPTIONS.WORST]: 'ASC',
};

const useQueryParams = () => {
  const query = new URLSearchParams(useLocation().search);
  return {
    search: query.get('search')?.toLowerCase() || '',
    category: query.get('category')?.toLowerCase() || '',
    minRatingQuery: query.get('minRating'),
    maxRatingQuery: query.get('maxRating'),
    page: Number(query.get('page')) || 1,
  };
};

export default function ProductsGrid() {
  const { search, category, minRatingQuery, maxRatingQuery, page } =
    useQueryParams();
  const navigate = useNavigate();

  const initialMinRating = minRatingQuery !== null ? Number(minRatingQuery) : 0;
  const initialMaxRating =
    maxRatingQuery !== null ? Number(maxRatingQuery) : 100;

  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(null);

  const [minRating, setMinRating] = useState(initialMinRating);
  const [maxRating, setMaxRating] = useState(initialMaxRating);
  const [tempMinRating, setTempMinRating] = useState(initialMinRating);
  const [tempMaxRating, setTempMaxRating] = useState(initialMaxRating);

  const [sorting, setSorting] = useState(SORT_OPTIONS.BEST);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showContent, setShowContent] = useState(false);

  const sortingValue = SORTING_REQUEST[sorting];
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
        onSuccess: (data) => {
          setProducts(data.items);
          setTotalPages(Math.ceil(data.total / data.limit));
        },
        onError: (err) => setError(err.message),
        onFinish: () => {
          setLoading(false);
          setTimeout(() => setShowContent(true), 150);
        },
      }),
    []
  );

  useEffect(() => {
    fetchProductsWithStatus(
      category,
      search,
      minRating,
      maxRating,
      PRODUCTS_BATCH,
      sortingValue,
      page
    );
  }, [
    category,
    search,
    minRating,
    maxRating,
    fetchProductsWithStatus,
    PRODUCTS_BATCH,
    sortingValue,
    page,
  ]);

  useEffect(() => {
    if (page !== 1) {
      const params = new URLSearchParams(window.location.search);
      params.set('page', '1');
      navigate({ search: params.toString() }, { replace: true });
    }
  }, [category, search, minRating, maxRating, sorting, navigate]);

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

  const goToPage = (page) => {
    const params = new URLSearchParams(window.location.search);
    params.set('page', page);
    navigate({ search: params.toString() });
  };

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
        products.length ? (
          <div>
            <div className={styles.productGrid}>
              {products.map((product) => (
                <ProductsCard product={product} key={product.id} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className={styles.pagination}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNumber) => (
                    <button
                      key={pageNumber}
                      onClick={() => goToPage(pageNumber)}
                      className={styles.page}
                      style={
                        pageNumber === page
                          ? { backgroundColor: '#7ed5ad' }
                          : {}
                      }
                    >
                      {pageNumber}
                    </button>
                  )
                )}
              </div>
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
