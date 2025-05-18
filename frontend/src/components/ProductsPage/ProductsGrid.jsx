import React from 'react';
import ProductsCard from './ProductsCard';

export default function ProductsGrid({ products }) {
  return (
    <div>
      {products.map((product) => (
        <ProductsCard product={product} key={product.id} />
      ))}
    </div>
  );
}
