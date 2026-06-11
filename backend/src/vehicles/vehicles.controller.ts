import {
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';

import { VehiclesService } from './vehicles.service';
import { VehicleCategory } from '@prisma/client';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get()
  findAll(
    @Query('manufacturer') manufacturer?: string,
    @Query('category', new ParseEnumPipe(VehicleCategory, { optional: true }))
    category?: VehicleCategory,
  ) {
    return this.vehiclesService.findAll(manufacturer, category);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.vehiclesService.findOne(id);
  }
}
