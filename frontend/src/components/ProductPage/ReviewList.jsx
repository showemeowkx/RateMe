import React from 'react';
import styles from './ReviewList.module.css';

export default function ReviewList({ product }) {
  return (
    <>
      {product.reviews.map((review) => (
        <div className={styles.review}>
          <div className={styles.user}>
            <img
              className={styles.userImg}
              src={`../${review.author.imagePath}`}
              alt='img'
            />
            <h2>{review.author.name}</h2>
            <h5>{review.author.username}</h5>
          </div>
          <div>
            <div className={styles.reviewsPoints}>
              <h3>Cподобалось:</h3>
              <p className={styles.reviewPar}>{review.liked}</p>
            </div>
            <div className={styles.reviewsPoints}>
              <h3>Не сподобалось:</h3>
              <p className={styles.reviewPar}>{review.disliked}</p>
            </div>
            <div className={styles.reviewsPoints}>
              <h3>Досвід використання:</h3>
              <p className={styles.reviewPar}>{review.usePeriod}</p>
            </div>
            <div>
              <p className={styles.reviewPar}>{review.text}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
