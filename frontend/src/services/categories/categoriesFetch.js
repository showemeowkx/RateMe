import { fetchData } from '../api';
import { URL } from '../api';

export const fetchCategories = async () => await fetchData(`${URL}/categories`);
