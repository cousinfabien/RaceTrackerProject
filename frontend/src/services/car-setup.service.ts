import api from './api';

export const saveSetup = async (
  leagueId: number,
  setup: {
    vehicleModelId: number;
    currentPP: number;
    currentPower: number;
    currentWeight: number;
    tyres: string;
  },
) => {
  const response = await api.post(
    `/driver-entries/leagues/${leagueId}/setup`,
    setup,
  );

  return response.data;
};
