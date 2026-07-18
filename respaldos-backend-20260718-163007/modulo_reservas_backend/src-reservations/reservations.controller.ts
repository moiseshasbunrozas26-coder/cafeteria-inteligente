import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { CreateReservationDto } from './dto/create-reservation.dto.js';
import { UpdateReservationDto } from './dto/update-reservation.dto.js';
import { ReservationsService } from './reservations.service.js';

@Controller('reservations')
export class ReservationsController {
  constructor(
    private readonly reservationsService: ReservationsService,
  ) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'STAFF')
  create(@Body() dto: CreateReservationDto) {
    return this.reservationsService.create(dto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.reservationsService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.reservationsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'STAFF')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateReservationDto,
  ) {
    return this.reservationsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'STAFF')
  cancel(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.reservationsService.cancel(id);
  }
}
