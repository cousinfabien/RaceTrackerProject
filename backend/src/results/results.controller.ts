import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import type { AuthenticatedRequest } from '../auth/types/authenticated-request.type';

import { ResultsService } from './results.service';

import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';

@Controller()
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Post('races/:raceId/results')
  @UseGuards(JwtAuthGuard)
  create(
    @Param('raceId', ParseIntPipe)
    raceId: number,

    @Request()
    req: AuthenticatedRequest,

    @Body()
    dto: CreateResultDto,
  ) {
    return this.resultsService.create(raceId, req.user.userId, dto);
  }

  @Get('races/:raceId/results')
  findByRace(
    @Param('raceId', ParseIntPipe)
    raceId: number,
  ) {
    return this.resultsService.findByRace(raceId);
  }

  @Get('results/:id')
  findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.resultsService.findOne(id);
  }

  @Get('leagues/:leagueId/standings')
  findStandings(
    @Param('leagueId', ParseIntPipe)
    leagueId: number,
  ) {
    return this.resultsService.findStandings(leagueId);
  }

  @Patch('results/:id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe)
    id: number,

    @Request()
    req: AuthenticatedRequest,

    @Body()
    dto: UpdateResultDto,
  ) {
    return this.resultsService.update(id, req.user.userId, dto);
  }

  @Delete('results/:id')
  @UseGuards(JwtAuthGuard)
  remove(
    @Param('id', ParseIntPipe)
    id: number,

    @Request()
    req: AuthenticatedRequest,
  ) {
    return this.resultsService.remove(id, req.user.userId);
  }
}
