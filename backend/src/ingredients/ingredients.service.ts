import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateIngredientDto } from './dto/create-ingredient.dto.js';
import { UpdateIngredientDto } from './dto/update-ingredient.dto.js';

@Injectable()
export class IngredientsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createIngredientDto: CreateIngredientDto) {
    const existingIngredient = await this.prisma.ingredient.findUnique({
      where: {
        name: createIngredientDto.name,
      },
    });

    if (existingIngredient) {
      throw new BadRequestException(
        `Ya existe un ingrediente llamado "${createIngredientDto.name}".`,
      );
    }

    return this.prisma.ingredient.create({
      data: createIngredientDto,
    });
  }

  findAll() {
    return this.prisma.ingredient.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const ingredient = await this.prisma.ingredient.findUnique({
      where: { id },
    });

    if (!ingredient) {
      throw new NotFoundException(
        `No existe un ingrediente con el ID ${id}.`,
      );
    }

    return ingredient;
  }

  async update(
    id: number,
    updateIngredientDto: UpdateIngredientDto,
  ) {
    const currentIngredient = await this.findOne(id);

    if (
      updateIngredientDto.name &&
      updateIngredientDto.name !== currentIngredient.name
    ) {
      const ingredientWithSameName =
        await this.prisma.ingredient.findUnique({
          where: {
            name: updateIngredientDto.name,
          },
        });

      if (ingredientWithSameName) {
        throw new BadRequestException(
          `Ya existe un ingrediente llamado "${updateIngredientDto.name}".`,
        );
      }
    }

    return this.prisma.ingredient.update({
      where: { id },
      data: updateIngredientDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.ingredient.update({
      where: { id },
      data: {
        active: false,
      },
    });
  }
}