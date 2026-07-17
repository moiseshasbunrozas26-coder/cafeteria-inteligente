import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { AddRecipeIngredientDto } from './dto/add-recipe-ingredient.dto.js';
import { UpdateRecipeIngredientDto } from './dto/update-recipe-ingredient.dto.js';

@Injectable()
export class RecipesService {
  constructor(private readonly prisma: PrismaService) {}

  private async validateProduct(productId: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(
        `No existe un producto con el ID ${productId}.`,
      );
    }

    return product;
  }

  private async validateIngredient(ingredientId: number) {
    const ingredient = await this.prisma.ingredient.findUnique({
      where: { id: ingredientId },
    });

    if (!ingredient) {
      throw new NotFoundException(
        `No existe un ingrediente con el ID ${ingredientId}.`,
      );
    }

    return ingredient;
  }

  async addIngredient(
    productId: number,
    dto: AddRecipeIngredientDto,
  ) {
    await this.validateProduct(productId);
    await this.validateIngredient(dto.ingredientId);

    const existingRelation =
      await this.prisma.productIngredient.findUnique({
        where: {
          productId_ingredientId: {
            productId,
            ingredientId: dto.ingredientId,
          },
        },
      });

    if (existingRelation) {
      throw new BadRequestException(
        'Este ingrediente ya forma parte de la receta.',
      );
    }

    return this.prisma.productIngredient.create({
      data: {
        productId,
        ingredientId: dto.ingredientId,
        quantity: dto.quantity,
      },
      include: {
        product: true,
        ingredient: true,
      },
    });
  }

  async findRecipe(productId: number) {
    await this.validateProduct(productId);

    return this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
        ingredients: {
          include: {
            ingredient: true,
          },
          orderBy: {
            ingredientId: 'asc',
          },
        },
      },
    });
  }

  async updateIngredientQuantity(
    productId: number,
    ingredientId: number,
    dto: UpdateRecipeIngredientDto,
  ) {
    await this.validateProduct(productId);
    await this.validateIngredient(ingredientId);

    const relation =
      await this.prisma.productIngredient.findUnique({
        where: {
          productId_ingredientId: {
            productId,
            ingredientId,
          },
        },
      });

    if (!relation) {
      throw new NotFoundException(
        'El ingrediente no forma parte de esta receta.',
      );
    }

    return this.prisma.productIngredient.update({
      where: {
        productId_ingredientId: {
          productId,
          ingredientId,
        },
      },
      data: {
        quantity: dto.quantity,
      },
      include: {
        product: true,
        ingredient: true,
      },
    });
  }

  async removeIngredient(
    productId: number,
    ingredientId: number,
  ) {
    await this.validateProduct(productId);

    const relation =
      await this.prisma.productIngredient.findUnique({
        where: {
          productId_ingredientId: {
            productId,
            ingredientId,
          },
        },
      });

    if (!relation) {
      throw new NotFoundException(
        'El ingrediente no forma parte de esta receta.',
      );
    }

    await this.prisma.productIngredient.delete({
      where: {
        productId_ingredientId: {
          productId,
          ingredientId,
        },
      },
    });

    return {
      message: 'Ingrediente eliminado correctamente de la receta.',
      productId,
      ingredientId,
    };
  }
}