import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { TracksModule } from './tracks/tracks.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LeaguesModule } from './leagues/leagues.module';
import { RegulationsModule } from './regulations/regulations.module';
import { DriversModule } from './drivers/drivers.module';
import { RacesModule } from './races/races.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    TracksModule,
    VehiclesModule,
    AuthModule,
    UsersModule,
    LeaguesModule,
    RegulationsModule,
    DriversModule,
    RacesModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
