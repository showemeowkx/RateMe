import { fetchAuthData as fetchData } from '../auth/fetchAuthData';
import { URL } from '../api';

export const getProfile = async () => await fetchData(`${URL}/auth/profile`);
