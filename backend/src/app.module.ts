import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { TracksModule } from './tracks/tracks.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LeaguesModule } from './leagues/leagues.module';

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
  ],
  controllers: [AppController],
})
export class AppModule {}
