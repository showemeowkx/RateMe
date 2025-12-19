import React from "react";
import styles from "./ProductsCard.module.css";
import { Link } from "react-router-dom";
import { URL } from "../../services/api";

export default function ProductsCard({ product }) {
  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${URL}/${path}`;
  };

  return (
    <Link to={`/products/${product.id}`} className={styles.product}>
      <div className={styles.productButton}>
        <div className={styles.imgContainer}>
          <img
            className={styles.productImg}
            src={getImageUrl(product.imagePath)}
            alt={product.name}
          />
        </div>
        <div className={styles.textContainer}>
          <div className={styles.productTitle} title={product.name}>
            {product.name}
          </div>
          <div className={styles.productRating}>Rating: {product.rating}</div>
        </div>
      </div>
    </Link>
  );
}
