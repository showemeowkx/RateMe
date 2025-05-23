const fetchData = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch from ${url}`);
  }
  return response.json();
};

export const fetchCategories = () =>
  fetchData('http://localhost:3001/categories');
export const fetchProducts = (category, search) => {
  if (category) {
    if (search)
      return fetchData(
        `http://localhost:3001/items?category=${category}&name=${search}`
      );
    else return fetchData(`http://localhost:3001/items?category=${category}`);
  } else {
    if (search) return fetchData(`http://localhost:3001/items?name=${search}`);
    else return fetchData('http://localhost:3001/items');
  }
};
