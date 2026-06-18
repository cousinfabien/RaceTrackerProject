import { PartialType } from '@nestjs/mapped-types';
import { CreateCarSetupDto } from './create-car-setup.dto';

export class UpdateCarSetupDto extends PartialType(CreateCarSetupDto) {}
