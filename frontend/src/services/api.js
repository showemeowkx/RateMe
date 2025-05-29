export const URL = 'http://localhost:3001';

export const fetchData = async (url, options = { method: 'GET' }) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Failed to fetch from ${url}`);
  }
  return response.json();
};
