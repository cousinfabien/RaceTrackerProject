import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const entries = await this.prisma.driverEntry.findMany({
      where: {
        userId,
      },
      include: {
        league: true,
      },
    });

    const results = await this.prisma.result.findMany({
      where: {
        driverEntry: {
          userId,
        },
      },
    });

    const wins = results.filter((result) => result.position === 1).length;
    const podiums = results.filter((result) => result.position <= 3).length;

    const totalPoints = entries.reduce(
      (sum, entry) => sum + entry.championshipPoints,
      0,
    );

    return {
      user: {
        id: user.id,
        username: user.username,
      },
      stats: {
        championshipsJoined: entries.length,
        raceStarts: results.length,
        wins,
        podiums,
        totalPoints,
      },
      championships: entries.map((entry) => ({
        leagueId: entry.league.id,
        leagueName: entry.league.name,
        points: entry.championshipPoints,
      })),
    };
  }
}
