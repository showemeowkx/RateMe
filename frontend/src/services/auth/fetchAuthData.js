import Cookies from 'js-cookie';
import { fetchData } from '../api';

const getFetchAuthData =
  (fn) =>
  (url, options = { method: 'GET' }, result = true) => {
    const token = Cookies.get('token');
    let newOptions = options;
    if (token) {
      newOptions = {
        ...options,
        headers: { ...options.headers, Authorization: `Bearer ${token}` },
      };
    }
    return fn(url, newOptions, result);
  };

export const fetchAuthData = getFetchAuthData(fetchData);
