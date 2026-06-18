import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VehicleCategory } from '@prisma/client';

@Injectable()
export class VehiclesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(manufacturer?: string, category?: VehicleCategory) {
    return this.prisma.vehicleModel.findMany({
      where: {
        manufacturer: manufacturer || undefined,
        category: category || undefined,
      },
      orderBy: [{ manufacturer: 'asc' }, { model: 'asc' }],
    });
  }

  findOne(id: number) {
    return this.prisma.vehicleModel.findUnique({
      where: { id },
    });
  }
}
