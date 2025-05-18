export default async function fetchCategories() {
  const response = await fetch('http://localhost:3001/categories');
  if (!response.ok) {
    throw new Error('Failed to fetch');
  }
  return response.json();
}
