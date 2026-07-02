import { IsInt, IsNumber, IsString } from 'class-validator';

export class SaveScrutineeringDto {
  @IsInt()
  vehicleModelId!: number;

  @IsNumber()
  currentPP!: number;

  @IsInt()
  currentPower!: number;

  @IsInt()
  currentWeight!: number;

  @IsString()
  tyres!: string;
}
