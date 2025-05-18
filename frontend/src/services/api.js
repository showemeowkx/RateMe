export const fetchCategories = async () => {
  const response = await fetch('http://localhost:3001/categories');
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return response.json();
};

export const fetchProducts = async () => {
  const response = await fetch('http://localhost:3001/items');
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};
