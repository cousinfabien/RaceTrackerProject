import {
  Injectable,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DriversService {
  constructor(private readonly prisma: PrismaService) {}

  async joinLeague(leagueId: number, userId: number) {
    const existing = await this.prisma.driverEntry.findFirst({
      where: {
        leagueId,
        userId,
      },
    });

    if (existing) {
      throw new ConflictException('Already registered');
    }

    return this.prisma.driverEntry.create({
      data: {
        leagueId,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  }

  findByLeague(leagueId: number) {
    return this.prisma.driverEntry.findMany({
      where: {
        leagueId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        championshipPoints: 'desc',
      },
    });
  }

  async leaveLeague(driverId: number, userId: number) {
    const entry = await this.prisma.driverEntry.findUnique({
      where: {
        id: driverId,
      },
    });

    if (!entry) {
      throw new NotFoundException();
    }

    if (entry.userId !== userId) {
      throw new ForbiddenException();
    }

    await this.prisma.driverEntry.delete({
      where: {
        id: driverId,
      },
    });

    return {
      success: true,
    };
  }
}
