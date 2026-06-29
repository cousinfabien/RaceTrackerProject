import api from './api';

export const joinLeague = async (
  leagueId: number,
) => {
  const response = await api.post(
    `/leagues/${leagueId}/drivers`,
  );

  return response.data;
};
