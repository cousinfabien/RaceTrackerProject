import { Module } from '@nestjs/common';
import { CarSetupService } from './car-setup.service';
import { CarSetupController } from './car-setup.controller';

@Module({
  providers: [CarSetupService],
  controllers: [CarSetupController],

  exports: [CarSetupService],
})
export class CarSetupModule {}
