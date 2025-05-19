const fetchData = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch from ${url}`);
  }
  return response.json();
};

export const fetchCategories = () =>
  fetchData('http://localhost:3001/categories');
export const fetchProducts = () => fetchData('http://localhost:3001/items');
