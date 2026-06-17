import { IsDateString, IsInt, Min } from 'class-validator';

export class CreateRaceDto {
  @IsInt()
  trackId!: number;

  @IsDateString()
  raceDate!: string;

  @IsInt()
  @Min(1)
  laps!: number;

  @IsInt()
  @Min(0)
  qualifyingFuelConsumption!: number;

  @IsInt()
  @Min(0)
  raceFuelConsumption!: number;

  @IsInt()
  @Min(0)
  qualifyingTyreWear!: number;

  @IsInt()
  @Min(0)
  raceTyreWear!: number;
}
