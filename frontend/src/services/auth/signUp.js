import { URL } from '../api';
import { signIn } from './signIn';

export const signUp = async (dto) => {
  const params = new URLSearchParams();
  params.append('name', dto.name);
  params.append('surname', dto.surname);
  params.append('username', dto.username);
  params.append('email', dto.email);
  params.append('password', dto.password);

  const response = await fetch(`${URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    const error = new Error('Validation error');
    error.status = response.status;
    error.messages = errorData.message;
    throw error;
  }

  await signIn({ login: dto.username, password: dto.password });
};
