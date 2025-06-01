import { fetchData } from '../api';
import { URL } from '../api';
import Cookies from 'js-cookie';

export const signIn = async (dto) => {
  try {
    const params = new URLSearchParams();
    params.append('login', dto.login);
    params.append('password', dto.password);

    const response = await fetchData(`${URL}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });
    const token = response.accessToken;
    Cookies.set('token', token);
  } catch (err) {
    throw new Error(err.message);
  }
};
