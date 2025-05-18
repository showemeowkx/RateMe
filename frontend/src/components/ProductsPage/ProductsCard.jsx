import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductsCard({ product }) {
  return (
    <Link to={`/products/${product.id}`}>
      <button>
        <div>
          <img src={product.imagePath} alt={product.name} />
        </div>
        <div>
          <div title={product.name}>{product.name}</div>
          <div>Rating: {product.rating}</div>
        </div>
      </button>
    </Link>
  );
}
