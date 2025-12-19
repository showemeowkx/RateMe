import React from "react";
import styles from "./CategoryCard.module.css";
import { Link } from "react-router-dom";
import { URL } from "../../services/api";

export default function CategoryCard({ category }) {
  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${URL}/${path}`;
  };

  return (
    <Link className={styles.link} to={`/products?category=${category.slug}`}>
      <div
        className={styles.categoryButton}
        key={category.id}
        style={{ backgroundColor: category.color }}
      >
        <img
          className={styles.categoryImg}
          src={getImageUrl(category.imagePath)}
          alt={category.name}
        />
        <div className={styles.categoryTitle}>
          <h3>{category.name}</h3>
        </div>
      </div>
    </Link>
  );
}
