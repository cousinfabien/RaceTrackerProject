import api from './api';

export interface Track {
  id: number;
  name: string;
  country: string;
  layout: string;
}

export const getTracks = async () => {
  const response = await api.get('/tracks');

  return response.data;
};
