const fetchData = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch from ${url}`);
  }
  return response.json();
};

export const fetchCategories = () =>
  fetchData('http://localhost:3001/categories');

export const fetchProducts = (
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

  const url = `http://localhost:3001/items?${params.toString()}`;

  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch from ${url}`);
      }
      return response.text();
    })
    .then((text) => {
      return text
        .split('\n')
        .filter((line) => line.trim())
        .map((line) => JSON.parse(line));
    });
};
