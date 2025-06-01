import { fetchData } from '../api';
import { URL } from '../api';
import Cookies from 'js-cookie';

export const signIn = async (dto) => {
  const params = new URLSearchParams();
  params.append('login', dto.login);
  params.append('password', dto.password);

  const data = await fetchData(`${URL}/auth/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  Cookies.set('token', data.accessToken);
};
