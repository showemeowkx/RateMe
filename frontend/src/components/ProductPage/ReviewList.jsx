import React from "react";
import styles from "./ReviewList.module.css";
import { URL } from "../../services/api";

const REVIEWS_PERIOD = {
  some_hours: "Кілька годин",
  some_days: "Кілька днів",
  some_weeks: "Кілька тижнів",
  some_months: "Кілька місяців",
  some_years: "Кілька років",
};

export default function ReviewList({ product }) {
  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${URL}/${path}`;
  };

  return (
    <>
      {product.reviews.map((review) => (
        <div className={styles.review}>
          <div className={styles.user}>
            <img
              className={styles.userImg}
              src={getImageUrl(review.author.imagePath)}
              alt="img"
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
              <p className={styles.reviewPar}>
                {REVIEWS_PERIOD[review.usePeriod]}
              </p>
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
