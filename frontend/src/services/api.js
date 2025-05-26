const URL = 'http://localhost:3001';

const fetchData = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch from ${url}`);
  }
  return response.json();
};

export const fetchCategories = () => fetchData(`${URL}/categories`);

export const fetchProducts = async (
  category,
  search,
  minRating = 0,
  maxRating = 100
) => {
  const params = new URLSearchParams();

  if (category) params.append('category', category);
  if (search) params.append('name', search);
  if (!(minRating === 0 && maxRating === 100)) {
    params.append('minRating', minRating);
    params.append('maxRating', maxRating);
  }

  const itemsUrl = `${URL}/items?${params.toString()}`;

  const response = await fetch(itemsUrl);

  if (!response.ok) {
    throw new Error(`Failed to fetch from ${itemsUrl}`);
  }

  const text = await response.text();

  return text
    .split('\n')
    .filter((line) => line.trim())
    .map((line) => JSON.parse(line));
};

export const fetchProductById = (productId) => {
  return fetchData(`${URL}/items/${productId}`);
};
