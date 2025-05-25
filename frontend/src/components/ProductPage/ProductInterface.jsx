import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductById } from '../../services/api';
import Loader from '../Loader';
import styles from './ProductInterface.module.css';
import ReviewList from './ReviewList';

export default function ProductInterface() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProductById(id)
      .then((data) => setProduct(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (error) return <div>Error: {error}</div>;
  if (loading) return <Loader />;

  return (
    <div className={styles.product}>
      <div className={styles.standard}>
        <div className={styles.imgContainer}>
          <img
            className={styles.img}
            style={
              product.category.slug === 'laptops' ? { maxHeight: '300px' } : {}
            }
            src={`../${product.imagePath}`}
            alt={product.category.name}
          />

          <h2 className={styles.rating}>Rating: {product.rating}%</h2>
        </div>
        <div className={styles.info}>
          <h1 className={styles.title}>{product.name}</h1>
          <p className={styles.text}>{product.description}</p>
        </div>
      </div>
      <div>
        {product.reviews.length ? (
          <div>
            <h1>Відгуки:</h1>
            <div className={styles.reviews}>
              <ReviewList product={product} />
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
