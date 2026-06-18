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
import { CarSetupService } from './car-setup.service';
import { CreateCarSetupDto } from './dto/create-car-setup.dto';
import { UpdateCarSetupDto } from './dto/update-car-setup.dto';

@Controller('driver-entries')
export class CarSetupController {
  constructor(private readonly carSetupService: CarSetupService) {}

  @Post(':driverEntryId/setup')
  @UseGuards(JwtAuthGuard)
  create(
    @Param('driverEntryId', ParseIntPipe) driverEntryId: number,
    @Request() req: AuthenticatedRequest,
    @Body() dto: CreateCarSetupDto,
  ) {
    return this.carSetupService.create(driverEntryId, req.user.userId, dto);
  }

  @Get(':driverEntryId/setup')
  findOne(@Param('driverEntryId', ParseIntPipe) driverEntryId: number) {
    return this.carSetupService.findOne(driverEntryId);
  }

  @Get(':driverEntryId/setup/compliance')
  checkCompliance(@Param('driverEntryId', ParseIntPipe) driverEntryId: number) {
    return this.carSetupService.checkCompliance(driverEntryId);
  }

  @Patch(':driverEntryId/setup')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('driverEntryId', ParseIntPipe) driverEntryId: number,
    @Request() req: AuthenticatedRequest,
    @Body() dto: UpdateCarSetupDto,
  ) {
    return this.carSetupService.update(driverEntryId, req.user.userId, dto);
  }

  @Delete(':driverEntryId/setup')
  @UseGuards(JwtAuthGuard)
  remove(
    @Param('driverEntryId', ParseIntPipe) driverEntryId: number,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.carSetupService.remove(driverEntryId, req.user.userId);
  }
}
