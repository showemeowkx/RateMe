import React from 'react';
import { Link } from 'react-router-dom';

export default function CategoryCard({ category }) {
  return (
    <Link to={`/products?category=${category.slug}`} key={category.id}>
      <div>
        <button style={{ backgroundColor: category.color }}>
          <img
            src={`data/images/categories/${category.image}`}
            alt={category.title}
          />
          <div>
            <h3>{category.title}</h3>
          </div>
        </button>
      </div>
    </Link>
  );
}
