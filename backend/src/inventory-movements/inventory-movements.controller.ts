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
import { CreateInventoryMovementDto } from './dto/create-inventory-movement.dto.js';
import { InventoryMovementsService } from './inventory-movements.service.js';

@Controller('inventory-movements')
export class InventoryMovementsController {
  constructor(
    private readonly inventoryMovementsService: InventoryMovementsService,
  ) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  create(@Body() dto: CreateInventoryMovementDto) {
    return this.inventoryMovementsService.create(dto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.inventoryMovementsService.findAll();
  }

  @Get('ingredient/:ingredientId')
  @UseGuards(AuthGuard)
  findByIngredient(
    @Param('ingredientId', ParseIntPipe) ingredientId: number,
  ) {
    return this.inventoryMovementsService.findByIngredient(
      ingredientId,
    );
  }
}