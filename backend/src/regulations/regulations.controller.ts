import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  UseGuards,
  Param,
  ParseIntPipe,
  Request,
  Body,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RegulationsService } from './regulations.service';
import { CreateRegulationDto } from './dto/create-regulation.dto';
import { UpdateRegulationDto } from './dto/update-regulation.dto';
import type { AuthenticatedRequest } from '../auth/types/authenticated-request.type';

@Controller('regulations')
export class RegulationsController {
  constructor(private readonly regulationsService: RegulationsService) {}

  @Post('/league/:leagueId')
  @UseGuards(JwtAuthGuard)
  create(
    @Param('leagueId', ParseIntPipe) leagueId: number,
    @Request() req: ExpressRequest & { user: { userId: number } },
    @Body() dto: CreateRegulationDto,
  ) {
    return this.regulationsService.create(leagueId, req.user.userId, dto);
  }

  @Get('/league/:leagueId')
  findByLeague(@Param('leagueId', ParseIntPipe) leagueId: number) {
    return this.regulationsService.findByLeague(leagueId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: AuthenticatedRequest,
    @Body() dto: UpdateRegulationDto,
  ) {
    return this.regulationsService.update(id, req.user.userId, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(
    @Param('id', ParseIntPipe)
    id: number,

    @Request() req: AuthenticatedRequest,
  ) {
    return this.regulationsService.remove(id, req.user.userId);
  }
}
