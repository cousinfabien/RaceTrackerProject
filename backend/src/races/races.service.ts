import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRaceDto } from './dto/create-race.dto';
import { UpdateRaceDto } from './dto/update-race.dto';

@Injectable()
export class RacesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(leagueId: number, organizerId: number, dto: CreateRaceDto) {
    const league = await this.prisma.league.findUnique({
      where: { id: leagueId },
    });

    if (!league) {
      throw new NotFoundException('League not found');
    }

    if (league.organizerId !== organizerId) {
      throw new ForbiddenException();
    }

    return this.prisma.race.create({
      data: {
        ...dto,
        leagueId,
      },
      include: {
        track: true,
      },
    });
  }

  findByLeague(leagueId: number) {
    return this.prisma.race.findMany({
      where: {
        leagueId,
      },
      include: {
        track: true,
      },
      orderBy: {
        raceDate: 'asc',
      },
    });
  }

  findOne(id: number) {
    return this.prisma.race.findUnique({
      where: { id },
      include: {
        track: true,

        league: {
          select: {
            id: true,
          },
        },

        _count: {
          select: {
            results: true,
          },
        },
      },
    });
  }

  async update(raceId: number, organizerId: number, dto: UpdateRaceDto) {
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

    return this.prisma.race.update({
      where: {
        id: raceId,
      },
      data: dto,
      include: {
        track: true,
      },
    });
  }

  async remove(raceId: number, organizerId: number) {
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

    await this.prisma.race.delete({
      where: {
        id: raceId,
      },
    });

    return {
      success: true,
    };
  }
}
