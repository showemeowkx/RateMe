import { dtoConvert } from '../../utilities/dtoToFormData';
import { URL } from '../api';
import { fetchAuthData as fetchData } from '../auth/fetchAuthData';

export const fetchProducts = async (
  category,
  search,
  minRating = 0,
  maxRating = 100,
  page,
  limit = 35
) => {
  const params = new URLSearchParams();

  if (page) params.append('page', page);
  if (limit) params.append('limit', limit);
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

  const data = await response.json();

  return data.items || [];
};

export const fetchProductById = (productId) => {
  return fetchData(`${URL}/items/${productId}`);
};

export const addProduct = (dto) => {
  return fetchData(`${URL}/items`, {
    method: 'POST',
    body: dtoConvert(dto),
  });
};
