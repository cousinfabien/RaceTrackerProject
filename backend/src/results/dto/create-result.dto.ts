import { IsBoolean, IsInt, Min } from 'class-validator';

export class CreateResultDto {
  @IsInt()
  driverEntryId!: number;

  @IsInt()
  @Min(1)
  position!: number;

  @IsInt()
  @Min(0)
  points!: number;

  @IsBoolean()
  fastestLap!: boolean;
}
