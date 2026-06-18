import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';

@Injectable()
export class ResultsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(raceId: number, organizerId: number, dto: CreateResultDto) {
    const race = await this.prisma.race.findUnique({
      where: {
        id: raceId,
      },

      include: {
        league: true,
      },
    });

    if (!race) {
      throw new NotFoundException('Race not found');
    }

    if (race.league.organizerId !== organizerId) {
      throw new ForbiddenException('You are not the organizer of this league');
    }

    const driverEntry = await this.prisma.driverEntry.findUnique({
      where: {
        id: dto.driverEntryId,
      },
    });

    if (!driverEntry) {
      throw new NotFoundException('Driver entry not found');
    }

    if (driverEntry.leagueId !== race.leagueId) {
      throw new ConflictException('Driver is not registered in this league');
    }
    const existing = await this.prisma.result.findFirst({
      where: {
        raceId,
        driverEntryId: dto.driverEntryId,
      },
    });

    if (existing) {
      throw new ConflictException('Result already exists for this driver');
    }

    const existingPosition = await this.prisma.result.findFirst({
      where: {
        raceId,
        position: dto.position,
      },
    });

    if (existingPosition) {
      throw new ConflictException('Position already assigned');
    }

    const result = await this.prisma.result.create({
      data: {
        raceId,
        ...dto,
      },

      include: {
        driverEntry: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
    });

    await this.prisma.driverEntry.update({
      where: {
        id: dto.driverEntryId,
      },

      data: {
        championshipPoints: {
          increment: dto.points,
        },
      },
    });

    return result;
  }

  findByRace(raceId: number) {
    return this.prisma.result.findMany({
      where: {
        raceId,
      },

      include: {
        driverEntry: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },

      orderBy: {
        position: 'asc',
      },
    });
  }

  findOne(id: number) {
    return this.prisma.result.findUnique({
      where: {
        id,
      },

      include: {
        driverEntry: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },

        race: {
          include: {
            track: true,
          },
        },
      },
    });
  }

  async findStandings(leagueId: number) {
    const entries = await this.prisma.driverEntry.findMany({
      where: { leagueId },
      include: {
        user: { select: { id: true, username: true } },
        carSetup: { include: { vehicleModel: true } },
      },
      orderBy: [{ championshipPoints: 'desc' }, { id: 'asc' }],
    });

    return entries.map((entry, index) => ({
      rank: index + 1,
      points: entry.championshipPoints,
      user: entry.user,
      carSetup: entry.carSetup,
    }));
  }

  async update(resultId: number, organizerId: number, dto: UpdateResultDto) {
    const result = await this.prisma.result.findUnique({
      where: {
        id: resultId,
      },

      include: {
        race: {
          include: {
            league: true,
          },
        },
      },
    });

    if (!result) {
      throw new NotFoundException('Result not found');
    }

    if (result.race.league.organizerId !== organizerId) {
      throw new ForbiddenException('You are not the organizer of this league');
    }

    const oldPoints = result.points;
    const newPoints = dto.points ?? oldPoints;

    const updated = await this.prisma.result.update({
      where: {
        id: resultId,
      },

      data: dto,

      include: {
        driverEntry: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
    });

    if (newPoints !== oldPoints) {
      await this.prisma.driverEntry.update({
        where: {
          id: result.driverEntryId,
        },

        data: {
          championshipPoints: {
            increment: newPoints - oldPoints,
          },
        },
      });
    }

    return updated;
  }

  async remove(resultId: number, organizerId: number) {
    const result = await this.prisma.result.findUnique({
      where: {
        id: resultId,
      },

      include: {
        race: {
          include: {
            league: true,
          },
        },
      },
    });

    if (!result) {
      throw new NotFoundException('Result not found');
    }

    if (result.race.league.organizerId !== organizerId) {
      throw new ForbiddenException('You are not the organizer of this league');
    }

    await this.prisma.driverEntry.update({
      where: {
        id: result.driverEntryId,
      },

      data: {
        championshipPoints: {
          decrement: result.points,
        },
      },
    });

    await this.prisma.result.delete({
      where: {
        id: resultId,
      },
    });

    return {
      success: true,
    };
  }
}
