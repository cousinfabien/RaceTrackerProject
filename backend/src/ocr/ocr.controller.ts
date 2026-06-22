import { Controller, Get, Param, Post, ParseIntPipe } from '@nestjs/common';

import { OcrService } from './ocr.service';

@Controller('ocr')
export class OcrController {
  constructor(private readonly ocrService: OcrService) {}

  @Get(':filename')
  async extract(@Param('filename') filename: string) {
    return this.ocrService.extractText(`uploads/${filename}`);
  }

  @Post('analyze/:driverEntryId/:filename')
  analyze(
    @Param('driverEntryId', ParseIntPipe)
    driverEntryId: number,

    @Param('filename')
    filename: string,
  ) {
    return this.ocrService.analyzeImage(driverEntryId, filename);
  }
}
