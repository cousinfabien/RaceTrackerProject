import api from './api';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  role: 'ORGANIZER' | 'DRIVER';
}

export const login = async (data: LoginDto) => {
  const response = await api.post('/auth/login', data);

  return response.data;
};

export const register = async (data: RegisterDto) => {
  const response = await api.post('/auth/register', data);

  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/users/me');

  return response.data;
};
