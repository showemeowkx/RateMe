import { fetchData } from '../api';
import { URL } from '../api';

export const fetchCategories = () => fetchData(`${URL}/categories`);
