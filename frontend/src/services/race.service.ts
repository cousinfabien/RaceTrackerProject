import axios from 'axios';
import api from './api';



const API_URL = 'http://localhost:3000';
export interface CreateRaceDto {
  trackId: number;
  raceDate: string;
  laps: number;
  qualifyingFuelConsumption: number;
  raceFuelConsumption: number;
  qualifyingTyreWear: number;
  raceTyreWear: number;
}

export const createRace = async (
  leagueId: number,
  data: CreateRaceDto,
) => {
  const response = await api.post(
    `/leagues/${leagueId}/races`,
    data,
  );

  return response.data;
};

export async function getRace(
  raceId: number,
) {
  const response = await axios.get(
    `${API_URL}/races/${raceId}`,
  );


  return response.data;
};
