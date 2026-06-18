import { IsBoolean, IsInt, IsNumber, IsString, Min } from 'class-validator';

export class CreateCarSetupDto {
  @IsNumber()
  currentPP!: number;

  @IsInt()
  @Min(1)
  currentPower!: number;

  @IsInt()
  @Min(1)
  currentWeight!: number;

  @IsString()
  tyres!: string;

  @IsBoolean()
  turboInstalled!: boolean;

  @IsBoolean()
  ballastApplied!: boolean;

  @IsInt()
  vehicleModelId!: number;
}
