import api from './api';

export interface CreateLeagueDto {
  name: string;
  description?: string;
}

export const createLeague = async (
  data: CreateLeagueDto,
) => {
  const response = await api.post(
    '/leagues',
    data,
  );

  return response.data;
};
