import api from './api';

export interface League {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;

  organizerId: number;

  organizer: {
    id: number;
    username: string;
  };

  _count: {
    drivers: number;
    races: number;
  };
}

export async function getMyLeagues() {
  const response = await api.get<League[]>('/leagues/mine');

  return response.data;
}