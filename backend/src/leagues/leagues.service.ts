import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLeagueDto } from './dto/create-league.dto';
import { UpdateLeagueDto } from './dto/update-league.dto';

@Injectable()
export class LeaguesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.league.findMany({
      include: {
        organizer: {
          select: {
            id: true,
            username: true,
          },
        },
        _count: {
          select: {
            drivers: true,
            races: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findOne(id: number) {
    return this.prisma.league.findUnique({
      where: { id },
      include: {
        organizer: {
          select: {
            id: true,
            username: true,
          },
        },
        regulations: true,
        races: true,
        drivers: true,
        _count: {
          select: {
            drivers: true,
            races: true,
          },
        },
      },
    });
  }

  async create(organizerId: number, dto: CreateLeagueDto) {
    return this.prisma.league.create({
      data: {
        name: dto.name,
        description: dto.description,
        organizerId,
      },
    });
  }

  async update(leagueId: number, organizerId: number, dto: UpdateLeagueDto) {
    const league = await this.prisma.league.findUnique({
      where: { id: leagueId },
    });

    if (!league) {
      throw new NotFoundException('League not found');
    }

    if (league.organizerId !== organizerId) {
      throw new ForbiddenException();
    }

    return this.prisma.league.update({
      where: { id: leagueId },
      data: dto,
    });
  }
  async remove(leagueId: number, organizerId: number) {
    const league = await this.prisma.league.findUnique({
      where: { id: leagueId },
    });

    if (!league) {
      throw new NotFoundException();
    }

    if (league.organizerId !== organizerId) {
      throw new ForbiddenException();
    }

    await this.prisma.league.delete({
      where: { id: leagueId },
    });

    return {
      success: true,
    };
  }

  findMine(userId: number) {
    return this.prisma.league.findMany({
      where: {
        organizerId: userId,
      },

      include: {
        organizer: {
          select: {
            id: true,
            username: true,
          },
        },

        _count: {
          select: {
            drivers: true,
            races: true,
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
