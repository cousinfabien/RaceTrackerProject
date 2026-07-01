import axios from 'axios';

const API_URL = 'http://localhost:3000';

export async function getRaceResults(
  raceId: number,
) {
  const response = await axios.get(
    `${API_URL}/races/${raceId}/results`,
  );

  return response.data;
}

export async function createResult(
  raceId: number,
  data: {
    driverEntryId: number;
    position: number;
    points: number;
    fastestLap: boolean;
  },
) {
  const token = localStorage.getItem('token');

  const response = await axios.post(
    `${API_URL}/races/${raceId}/results`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
}

export async function getDriverResults(
  driverEntryId: number,
) {
  const response = await axios.get(
    `${API_URL}/drivers/${driverEntryId}/results`,
  );

  return response.data;
}

export async function getTitleStatus(
  leagueId: number,
  driverEntryId: number,
) {
  const response = await axios.get(
    `${API_URL}/leagues/${leagueId}/title-status/${driverEntryId}`,
  );

  return response.data;
}
