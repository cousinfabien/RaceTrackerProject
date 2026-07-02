import api from './api';

export const getLeague = async (
  leagueId: number,
) => {
  const response = await api.get(
    `/leagues/${leagueId}`,
  );

  return response.data;
};
