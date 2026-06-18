import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CarSetupService } from './car-setup.service';
import { CarSetupController } from './car-setup.controller';

@Module({
  imports: [PrismaModule],
  providers: [CarSetupService],
  controllers: [CarSetupController],
})
export class CarSetupModule {}
