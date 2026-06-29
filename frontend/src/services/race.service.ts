import api from './api';

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
