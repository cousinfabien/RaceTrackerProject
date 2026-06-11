import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Patch,
  Delete,
  UseGuards,
  Request,
  Body,
} from '@nestjs/common';
import { LeaguesService } from './leagues.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateLeagueDto } from './dto/create-league.dto';
import { UpdateLeagueDto } from './dto/update-league.dto';
import { Request as ExpressRequest } from 'express';

export interface AuthenticatedRequest extends ExpressRequest {
  user: {
    userId: number;
    role: string;
  };
}

@Controller('leagues')
export class LeaguesController {
  constructor(private readonly leaguesService: LeaguesService) {}

  @Get()
  findAll() {
    return this.leaguesService.findAll();
  }

  @Get('mine')
  @UseGuards(JwtAuthGuard)
  mine(@Request() req: AuthenticatedRequest) {
    return this.leaguesService.findMine(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.leaguesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Request() req: AuthenticatedRequest, @Body() dto: CreateLeagueDto) {
    return this.leaguesService.create(req.user.userId, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: AuthenticatedRequest,
    @Body() dto: UpdateLeagueDto,
  ) {
    return this.leaguesService.update(id, req.user.userId, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.leaguesService.remove(id, req.user.userId);
  }
}
