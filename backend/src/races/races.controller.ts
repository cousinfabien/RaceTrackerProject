import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  ParseIntPipe,
  Request,
  Body,
  UseGuards,
} from '@nestjs/common';
import { RacesService } from './races.service';
import type { AuthenticatedRequest } from '../leagues/leagues.controller';
import { CreateRaceDto } from './dto/create-race.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateRaceDto } from './dto/update-race.dto';

@Controller()
export class RacesController {
  constructor(private readonly racesService: RacesService) {}
  @Post('leagues/:leagueId/races')
  @UseGuards(JwtAuthGuard)
  create(
    @Param('leagueId', ParseIntPipe) leagueId: number,
    @Request() req: AuthenticatedRequest,
    @Body() dto: CreateRaceDto,
  ) {
    return this.racesService.create(leagueId, req.user.userId, dto);
  }

  @Get('leagues/:leagueId/races')
  findByLeague(@Param('leagueId', ParseIntPipe) leagueId: number) {
    return this.racesService.findByLeague(leagueId);
  }

  @Get('races/:id')
  findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.racesService.findOne(id);
  }

  @Patch('races/:id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,

    @Request() req: AuthenticatedRequest,

    @Body() dto: UpdateRaceDto,
  ) {
    return this.racesService.update(id, req.user.userId, dto);
  }

  @Delete('races/:id')
  @UseGuards(JwtAuthGuard)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.racesService.remove(id, req.user.userId);
  }
}
