export const URL = 'http://localhost:3002';

export const fetchData = async (url, options = { method: 'GET' }) => {
  const response = await fetch(url, options);
  console.log(response);
  const data = await response.json();

  if (!response.ok) {
    const message = data.message || `Error: ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }
  return data;
};
