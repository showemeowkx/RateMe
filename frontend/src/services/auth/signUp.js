import { URL } from '../api';
import { signIn } from './signIn';
import { fetchData } from '../api';

export const signUp = async (dto) => {
  const params = new URLSearchParams();
  params.append('name', dto.name);
  params.append('surname', dto.surname);
  params.append('username', dto.username);
  params.append('email', dto.email);
  params.append('password', dto.password);

  await fetchData(`${URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  await signIn({ login: dto.username, password: dto.password });
};
