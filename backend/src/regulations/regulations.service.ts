import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRegulationDto } from './dto/create-regulation.dto';
import { UpdateRegulationDto } from './dto/update-regulation.dto';

@Injectable()
export class RegulationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    leagueId: number,
    organizerId: number,
    dto: CreateRegulationDto,
  ) {
    const league = await this.prisma.league.findUnique({
      where: { id: leagueId },
      include: {
        regulations: true,
      },
    });

    if (!league) {
      throw new NotFoundException();
    }

    if (league.organizerId !== organizerId) {
      throw new ForbiddenException();
    }

    if (league.regulations) {
      throw new ConflictException('Regulation already exists');
    }

    return this.prisma.regulation.create({
      data: {
        ...dto,
        leagueId,
      },
    });
  }

  findByLeague(leagueId: number) {
    return this.prisma.regulation.findUnique({
      where: {
        leagueId,
      },
    });
  }

  async update(
    regulationId: number,
    organizerId: number,
    dto: UpdateRegulationDto,
  ) {
    const regulation = await this.prisma.regulation.findUnique({
      where: { id: regulationId },
      include: { league: true },
    });

    if (!regulation) {
      throw new NotFoundException();
    }

    if (regulation.league.organizerId !== organizerId) {
      throw new ForbiddenException();
    }

    return this.prisma.regulation.update({
      where: { id: regulationId },
      data: {
        ...dto,
      },
    });
  }
  async remove(regulationId: number, organizerId: number) {
    const regulation = await this.prisma.regulation.findUnique({
      where: {
        id: regulationId,
      },
      include: {
        league: true,
      },
    });

    if (!regulation) {
      throw new NotFoundException('Regulation not found');
    }

    if (regulation.league.organizerId !== organizerId) {
      throw new ForbiddenException('You are not the organizer of this league');
    }

    await this.prisma.regulation.delete({
      where: {
        id: regulationId,
      },
    });

    return {
      success: true,
    };
  }
}
