import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { CreateSaleDto } from './dto/create-sale.dto.js';
import { SalesService } from './sales.service.js';

@Controller('sales')
export class SalesController {
  constructor(
    private readonly salesService: SalesService,
  ) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'STAFF')
  create(@Body() dto: CreateSaleDto) {
    return this.salesService.create(dto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.salesService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.salesService.findOne(id);
  }
}