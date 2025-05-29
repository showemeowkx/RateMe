import { fetchData } from '../api';
import { URL } from '../api';
import Cookies from 'js-cookie';

export const signIn = async (dto) => {
  try {
    const response = await fetchData(`${URL}/auth/signin`, {
      method: 'POST',
      body: JSON.stringify(dto),
    });
    const token = response.accessToken;
    Cookies.set('token', token);
  } catch (err) {
    throw new Error(err.message);
  }
};
