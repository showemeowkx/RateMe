import Cookies from 'js-cookie';

export const fetchAuthData = (fn, url, options = { method: 'GET' }) => {
  const token = Cookies.get('token');
  let newOptions = options;
  if (token) {
    newOptions = {
      ...options,
      Headers: { ...options.headers, Authorization: `Bearer ${token}` },
    };
  }
  return fn(url, newOptions);
};
