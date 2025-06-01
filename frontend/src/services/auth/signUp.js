import { URL, fetchData } from '../api';

export const signUp = async (dto) => {
  try {
    await fetchData(`${URL}/auth/signup`, {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  } catch (err) {
    throw new Error(err.message);
  }
};
