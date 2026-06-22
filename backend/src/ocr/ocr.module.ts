import { Module } from '@nestjs/common';
import { OcrService } from './ocr.service';
import { OcrController } from './ocr.controller';
import { CarSetupModule } from '../car-setup/car-setup.module';

@Module({
  imports: [CarSetupModule],
  providers: [OcrService],
  controllers: [OcrController],
})
export class OcrModule {}
