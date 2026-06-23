import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Regulation } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCarSetupDto } from './dto/create-car-setup.dto';
import { UpdateCarSetupDto } from './dto/update-car-setup.dto';

@Injectable()
export class CarSetupService {
  constructor(private readonly prisma: PrismaService) {}

  async create(driverEntryId: number, userId: number, dto: CreateCarSetupDto) {
    const driverEntry = await this.prisma.driverEntry.findUnique({
      where: { id: driverEntryId },
    });

    if (!driverEntry) {
      throw new NotFoundException('Driver entry not found');
    }

    if (driverEntry.userId !== userId) {
      throw new ForbiddenException('Not your driver entry');
    }

    const existing = await this.prisma.driverCarSetup.findUnique({
      where: { driverEntryId },
    });

    if (existing) {
      throw new ConflictException('Setup already exists');
    }

    return this.prisma.driverCarSetup.create({
      data: { driverEntryId, ...dto },
      include: { vehicleModel: true },
    });
  }

  findOne(driverEntryId: number) {
    return this.prisma.driverCarSetup.findUnique({
      where: { driverEntryId },
      include: { vehicleModel: true },
    });
  }

  async update(driverEntryId: number, userId: number, dto: UpdateCarSetupDto) {
    const driverEntry = await this.prisma.driverEntry.findUnique({
      where: {
        id: driverEntryId,
      },
    });

    if (!driverEntry) {
      throw new NotFoundException('Driver entry not found');
    }

    if (driverEntry.userId !== userId) {
      throw new ForbiddenException('Not your driver entry');
    }

    return this.prisma.driverCarSetup.update({
      where: {
        driverEntryId,
      },
      data: dto,
      include: {
        vehicleModel: true,
      },
    });
  }

  async remove(driverEntryId: number, userId: number) {
    const driverEntry = await this.prisma.driverEntry.findUnique({
      where: {
        id: driverEntryId,
      },
    });

    if (!driverEntry) {
      throw new NotFoundException('Driver entry not found');
    }

    if (driverEntry.userId !== userId) {
      throw new ForbiddenException('Not your driver entry');
    }

    await this.prisma.driverCarSetup.delete({
      where: {
        driverEntryId,
      },
    });

    return {
      success: true,
    };
  }

  validateSetup(
    setup: {
      currentPP: number;
      currentPower: number;
      currentWeight: number;
      tyres: string;
    },
    regulation: Regulation,
  ) {
    const errors: string[] = [];

    if (setup.currentPP > Number(regulation.maxPP)) {
      errors.push('PP exceeds maximum allowed');
    }

    if (setup.currentPower > regulation.maxPower) {
      errors.push('Power exceeds maximum allowed');
    }

    if (setup.currentWeight < regulation.minWeight) {
      errors.push('Weight below minimum allowed');
    }

    if (!regulation.allowedTyres.includes(setup.tyres)) {
      errors.push('Tyres not allowed');
    }

    return {
      compliant: errors.length === 0,
      errors,
    };
  }

  async checkCompliance(driverEntryId: number) {
    const setup = await this.prisma.driverCarSetup.findUnique({
      where: { driverEntryId },
      include: {
        driverEntry: {
          include: {
            league: {
              include: {
                regulations: true,
              },
            },
          },
        },
        vehicleModel: true,
      },
    });

    if (!setup) {
      throw new NotFoundException('Setup not found');
    }

    const regulation = setup.driverEntry.league.regulations;

    if (!regulation) {
      throw new NotFoundException('League regulation not found');
    }

    return this.validateSetup(
      {
        currentPP: Number(setup.currentPP),
        currentPower: setup.currentPower,
        currentWeight: setup.currentWeight,
        tyres: setup.tyres,
      },
      regulation,
    );
  }
}
