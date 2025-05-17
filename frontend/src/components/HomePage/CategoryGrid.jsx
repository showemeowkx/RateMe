import React from 'react';
import CategoryCard from './CategoryCard';

export default function CategoryGrid({ categories }) {
  return (
    <div>
      {categories.map((category) => (
        <CategoryCard category={category} key={category.id} />
      ))}
    </div>
  );
}
