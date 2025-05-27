import { fetchData } from '../api';
import Cookies from 'js-cookie';

export const fetchAuthData = (url, options = { method: 'GET' }) => {
  const token = Cookies.get('token');
  let newOptions = options;
  if (token) {
    newOptions = {
      ...options,
      Headers: { ...options.headers, Authorization: `Bearer ${token}` },
    };
  }
  return fetchData(url, newOptions);
};
