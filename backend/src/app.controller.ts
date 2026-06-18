import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('health')
  async health() {
    const vehicleCount = await this.prisma.vehicleModel.count();
    const trackCount = await this.prisma.track.count();

    return {
      status: 'ok',
      vehicles: vehicleCount,
      tracks: trackCount,
    };
  }
}
