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
import { AddRecipeIngredientDto } from './dto/add-recipe-ingredient.dto.js';
import { UpdateRecipeIngredientDto } from './dto/update-recipe-ingredient.dto.js';
import { RecipesService } from './recipes.service.js';

@Controller('recipes')
export class RecipesController {
  constructor(
    private readonly recipesService: RecipesService,
  ) {}

  @Post(':productId/ingredients')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  addIngredient(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() dto: AddRecipeIngredientDto,
  ) {
    return this.recipesService.addIngredient(productId, dto);
  }

  @Get(':productId')
  @UseGuards(AuthGuard)
  findRecipe(
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.recipesService.findRecipe(productId);
  }

  @Patch(':productId/ingredients/:ingredientId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  updateIngredientQuantity(
    @Param('productId', ParseIntPipe) productId: number,
    @Param('ingredientId', ParseIntPipe) ingredientId: number,
    @Body() dto: UpdateRecipeIngredientDto,
  ) {
    return this.recipesService.updateIngredientQuantity(
      productId,
      ingredientId,
      dto,
    );
  }

  @Delete(':productId/ingredients/:ingredientId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  removeIngredient(
    @Param('productId', ParseIntPipe) productId: number,
    @Param('ingredientId', ParseIntPipe) ingredientId: number,
  ) {
    return this.recipesService.removeIngredient(
      productId,
      ingredientId,
    );
  }
}