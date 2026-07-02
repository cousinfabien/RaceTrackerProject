import api from './api';

export async function getProfile() {
  const response = await api.get(
    '/profile',
  );

  return response.data;
}
