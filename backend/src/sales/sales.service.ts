import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateSaleDto } from './dto/create-sale.dto.js';

@Injectable()
export class SalesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSaleDto) {
    /*
     * Agrupa productos repetidos.
     * Si el cliente envía dos veces el mismo producto,
     * sus cantidades se suman.
     */
    const normalizedItems = new Map<number, number>();

    for (const item of dto.items) {
      const currentQuantity =
        normalizedItems.get(item.productId) ?? 0;

      normalizedItems.set(
        item.productId,
        currentQuantity + item.quantity,
      );
    }

    return this.prisma.$transaction(async (transaction) => {
      const productIds = [...normalizedItems.keys()];

      const products = await transaction.product.findMany({
        where: {
          id: {
            in: productIds,
          },
        },
        include: {
          ingredients: {
            include: {
              ingredient: true,
            },
          },
        },
      });

      const productMap = new Map(
        products.map((product) => [product.id, product]),
      );

      const saleItems: Array<{
        productId: number;
        quantity: number;
        unitPrice: number;
        subtotal: number;
      }> = [];

      const ingredientRequirements = new Map<
        number,
        {
          name: string;
          unit: string;
          requiredQuantity: number;
          availableStock: number;
        }
      >();

      for (const [productId, quantity] of normalizedItems) {
        const product = productMap.get(productId);

        if (!product) {
          throw new NotFoundException(
            `No existe un producto con el ID ${productId}.`,
          );
        }

        if (!product.active) {
          throw new BadRequestException(
            `El producto "${product.name}" está inactivo.`,
          );
        }

        if (product.ingredients.length === 0) {
          throw new BadRequestException(
            `El producto "${product.name}" no tiene una receta configurada.`,
          );
        }

        const unitPrice = Number(product.price);
        const subtotal = Number(
          (unitPrice * quantity).toFixed(2),
        );

        saleItems.push({
          productId,
          quantity,
          unitPrice,
          subtotal,
        });

        for (const recipeIngredient of product.ingredients) {
          const ingredient = recipeIngredient.ingredient;

          if (!ingredient.active) {
            throw new BadRequestException(
              `El ingrediente "${ingredient.name}" está inactivo.`,
            );
          }

          const requiredForProduct = Number(
            (
              Number(recipeIngredient.quantity) *
              quantity
            ).toFixed(3),
          );

          const currentRequirement =
            ingredientRequirements.get(ingredient.id);

          const accumulatedQuantity = Number(
            (
              (currentRequirement?.requiredQuantity ?? 0) +
              requiredForProduct
            ).toFixed(3),
          );

          ingredientRequirements.set(ingredient.id, {
            name: ingredient.name,
            unit: ingredient.unit,
            requiredQuantity: accumulatedQuantity,
            availableStock: Number(ingredient.currentStock),
          });
        }
      }

      /*
       * Primera comprobación de stock, para entregar
       * un mensaje claro antes de crear la venta.
       */
      for (const requirement of ingredientRequirements.values()) {
        if (
          requirement.requiredQuantity >
          requirement.availableStock
        ) {
          throw new BadRequestException(
            `Stock insuficiente de "${requirement.name}". ` +
              `Disponible: ${requirement.availableStock} ` +
              `${requirement.unit}. Requerido: ` +
              `${requirement.requiredQuantity} ${requirement.unit}.`,
          );
        }
      }

      const total = Number(
        saleItems
          .reduce(
            (accumulator, item) =>
              accumulator + item.subtotal,
            0,
          )
          .toFixed(2),
      );

      const sale = await transaction.sale.create({
        data: {
          status: 'COMPLETED',
          total,
          items: {
            create: saleItems,
          },
        },
      });

      /*
       * Descuenta cada ingrediente y registra su movimiento.
       * updateMany evita que el stock quede negativo incluso
       * si dos ventas ocurren casi al mismo tiempo.
       */
      for (const [
        ingredientId,
        requirement,
      ] of ingredientRequirements) {
        const updateResult =
          await transaction.ingredient.updateMany({
            where: {
              id: ingredientId,
              active: true,
              currentStock: {
                gte: requirement.requiredQuantity,
              },
            },
            data: {
              currentStock: {
                decrement: requirement.requiredQuantity,
              },
            },
          });

        if (updateResult.count === 0) {
          const currentIngredient =
            await transaction.ingredient.findUnique({
              where: {
                id: ingredientId,
              },
            });

          throw new BadRequestException(
            `No fue posible descontar "${requirement.name}". ` +
              `Stock disponible: ` +
              `${Number(currentIngredient?.currentStock ?? 0)} ` +
              `${requirement.unit}.`,
          );
        }

        await transaction.inventoryMovement.create({
          data: {
            ingredientId,
            type: 'OUT',
            quantity: requirement.requiredQuantity,
            reason: `Consumo por venta #${sale.id}`,
          },
        });
      }

      return transaction.sale.findUnique({
        where: {
          id: sale.id,
        },
        include: {
          items: {
            include: {
              product: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
      });
    });
  }

  findAll() {
    return this.prisma.sale.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const sale = await this.prisma.sale.findUnique({
      where: {
        id,
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    if (!sale) {
      throw new NotFoundException(
        `No existe una venta con el ID ${id}.`,
      );
    }

    return sale;
  }
}