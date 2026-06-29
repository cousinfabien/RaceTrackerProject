import api from './api';

export interface CreateRegulationDto {
  maxPP: number;
  maxPower: number;
  minWeight: number;
  allowedTyres: string[];
  bopEnabled: boolean;
  tuningAllowed: boolean;
}

export const createRegulation = async (
  leagueId: number,
  data: CreateRegulationDto,
) => {
  const response = await api.post(
    `/regulations/league/${leagueId}`,
    data,
  );

  return response.data;
};
