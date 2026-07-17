import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateInventoryMovementDto } from './dto/create-inventory-movement.dto.js';

@Injectable()
export class InventoryMovementsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateInventoryMovementDto) {
    const ingredient = await this.prisma.ingredient.findUnique({
      where: {
        id: dto.ingredientId,
      },
    });

    if (!ingredient) {
      throw new NotFoundException(
        `No existe un ingrediente con el ID ${dto.ingredientId}.`,
      );
    }

    if (!ingredient.active) {
      throw new BadRequestException(
        'No se pueden registrar movimientos para un ingrediente inactivo.',
      );
    }

    if (dto.type !== 'ADJUSTMENT' && dto.quantity <= 0) {
      throw new BadRequestException(
        'Las entradas y salidas deben tener una cantidad mayor que cero.',
      );
    }

    const previousStock = Number(ingredient.currentStock);
    let newStock: number;

    switch (dto.type) {
      case 'IN':
        newStock = previousStock + dto.quantity;
        break;

      case 'OUT':
        if (dto.quantity > previousStock) {
          throw new BadRequestException(
            `Stock insuficiente. Disponible: ${previousStock} ${ingredient.unit}.`,
          );
        }

        newStock = previousStock - dto.quantity;
        break;

      case 'ADJUSTMENT':
        newStock = dto.quantity;
        break;

      default:
        throw new BadRequestException(
          'El tipo de movimiento no es válido.',
        );
    }

    newStock = Number(newStock.toFixed(3));

    return this.prisma.$transaction(async (transaction) => {
      const movement =
        await transaction.inventoryMovement.create({
          data: {
            ingredientId: dto.ingredientId,
            type: dto.type,
            quantity: dto.quantity,
            reason: dto.reason,
          },
        });

      const updatedIngredient =
        await transaction.ingredient.update({
          where: {
            id: dto.ingredientId,
          },
          data: {
            currentStock: newStock,
          },
        });

      return {
        movement,
        previousStock,
        newStock,
        ingredient: updatedIngredient,
      };
    });
  }

  findAll() {
    return this.prisma.inventoryMovement.findMany({
      include: {
        ingredient: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByIngredient(ingredientId: number) {
    const ingredient = await this.prisma.ingredient.findUnique({
      where: {
        id: ingredientId,
      },
    });

    if (!ingredient) {
      throw new NotFoundException(
        `No existe un ingrediente con el ID ${ingredientId}.`,
      );
    }

    return this.prisma.inventoryMovement.findMany({
      where: {
        ingredientId,
      },
      include: {
        ingredient: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}