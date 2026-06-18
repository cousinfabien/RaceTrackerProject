import { IsArray, IsBoolean, IsInt, IsNumber, IsString } from 'class-validator';

export class CreateRegulationDto {
  @IsNumber()
  maxPP!: number;

  @IsInt()
  maxPower!: number;

  @IsInt()
  minWeight!: number;

  @IsArray()
  @IsString({ each: true })
  allowedTyres!: string[];

  @IsBoolean()
  bopEnabled!: boolean;

  @IsBoolean()
  tuningAllowed!: boolean;
}
