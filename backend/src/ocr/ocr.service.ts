import { Injectable, NotFoundException } from '@nestjs/common';
import { recognize } from 'tesseract.js';
import { CarSetupService } from 'src/car-setup/car-setup.service';
import { PrismaService } from 'src/prisma/prisma.service';
import * as fs from 'fs';

type ExtractedSetup = {
  currentPP: number | null;
  currentPower: number | null;
  currentWeight: number | null;
  tyres: string | null;
};

@Injectable()
export class OcrService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly carSetupService: CarSetupService,
  ) {}

  async extractText(
    imagePath: string,
  ): Promise<{ text: string; setup: ExtractedSetup }> {
    if (!fs.existsSync(imagePath)) {
      throw new NotFoundException('Image file not found');
    }
    const result = await recognize(imagePath, 'fra+eng');
    const text = result.data.text;

    return {
      text,
      setup: this.extractSetupData(text),
    };
  }

  async analyzeImage(driverEntryId: number, filename: string) {
    const result = await this.extractText(`uploads/${filename}`);

    const detectedSetup = result.setup;

    const driverEntry = await this.prisma.driverEntry.findUnique({
      where: { id: driverEntryId },
      include: { league: { include: { regulations: true } } },
    });
    const imagePath = `uploads/${filename}`;

    if (!fs.existsSync(imagePath)) {
      throw new NotFoundException('Image file not found');
    }
    if (!driverEntry) {
      throw new NotFoundException('Driver entry not found');
    }

    const regulation = driverEntry.league.regulations;

    if (!regulation) {
      throw new NotFoundException('League regulation not found');
    }

    const compliance = this.carSetupService.validateSetup(
      detectedSetup as {
        currentPP: number;
        currentPower: number;
        currentWeight: number;
        tyres: string;
      },
      regulation,
    );

    return {
      detectedSetup,
      ...compliance,
    };
  }

  extractSetupData(text: string): ExtractedSetup {
    const ppMatch = text.match(/PP\s+(\d+[,.]\d+)/);
    const currentPP = ppMatch ? Number(ppMatch[1].replace(',', '.')) : null;

    const powerMatch = text.match(/Puissance max\.\s+([\d\s]+)\s*ch/i);
    const currentPower = powerMatch
      ? Number(powerMatch[1].replace(/\s/g, ''))
      : null;

    const weightMatch = text.match(/Poids\s+([\d\s]+)\s*kg/i);
    const currentWeight = weightMatch
      ? Number(weightMatch[1].replace(/\s/g, ''))
      : null;

    const tyreMatch = text.match(
      /(Course|Sport|Confort)\s*:?\s*(Tendres|Moyens|Durs)\s*[MSH]?/i,
    );
    const tyres = tyreMatch ? this.normalizeTyre(tyreMatch[0]) : null;

    return {
      currentPP,
      currentPower,
      currentWeight,
      tyres,
    };
  }

  private normalizeTyre(tyre: string): string {
    const cleaned = tyre.trim();

    const mapping: Record<string, string> = {
      'Course : Tendres': 'Race Soft',
      'Course : Moyens': 'Race Medium',
      'Course : Durs': 'Race Hard',

      'Sport : Tendres': 'Sport Soft',
      'Sport : Moyens': 'Sport Medium',
      'Sport : Durs': 'Sport Hard',

      'Confort : Tendres': 'Comfort Soft',
      'Confort : Moyens': 'Comfort Medium',
      'Confort : Durs': 'Comfort Hard',
    };

    return mapping[cleaned] ?? cleaned;
  }
}
