import axios from 'axios';

export async function getStandings(
  leagueId: number,
) {
  const response = await axios.get(
    `http://localhost:3000/leagues/${leagueId}/standings`,
  );

  return response.data;
}