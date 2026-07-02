import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findMe(userId: number) {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async getProfile(userId: number) {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        driverEntries: {
          include: {
            league: {
              select: {
                id: true,
                name: true,
              },
            },
            carSetup: {
              include: {
                vehicleModel: true,
              },
            },
            results: true,
          },
        },
        organizedLeagues: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }
}
