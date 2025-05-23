const fetchData = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch from ${url}`);
  }
  return response.json();
};

export const fetchCategories = () =>
  fetchData('http://localhost:3001/categories');
export const fetchProducts = (category) => {
  if (category)
    return fetchData(`http://localhost:3001/items?category=${category}`);
  else return fetchData(`http://localhost:3001/items`);
};
