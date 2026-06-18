import {
  Controller,
  Param,
  UseGuards,
  Post,
  Get,
  Delete,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import type { AuthenticatedRequest } from '../auth/types/authenticated-request.type';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DriversService } from './drivers.service';

@Controller()
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Post('/leagues/:leagueId/drivers')
  @UseGuards(JwtAuthGuard)
  join(
    @Param('leagueId', ParseIntPipe)
    leagueId: number,

    @Request()
    req: AuthenticatedRequest,
  ) {
    return this.driversService.joinLeague(leagueId, req.user.userId);
  }

  @Get('/leagues/:leagueId/drivers')
  findByLeague(
    @Param('leagueId', ParseIntPipe)
    leagueId: number,
  ) {
    return this.driversService.findByLeague(leagueId);
  }

  @Delete('/drivers/:id')
  @UseGuards(JwtAuthGuard)
  leave(
    @Param('id', ParseIntPipe)
    id: number,

    @Request()
    req: AuthenticatedRequest,
  ) {
    return this.driversService.leaveLeague(id, req.user.userId);
  }
}
